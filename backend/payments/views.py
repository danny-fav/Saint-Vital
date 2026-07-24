import uuid
import logging
import hashlib
import hmac
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from .models import Payment, Transaction, WebhookLog
from .serializers import PaymentSerializer, PaymentInitSerializer, PaymentVerifySerializer
from .utils import get_payment_client
from orders.models import Order
from core.permissions import IsAdminUser

logger = logging.getLogger(__name__)


class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)


class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        serializer = PaymentInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status != 'pending':
            return Response({'error': 'Order is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        provider = serializer.validated_data['provider']
        reference = f'SV-{uuid.uuid4().hex[:12].upper()}'

        client = get_payment_client(provider)
        if client and client.is_configured:
            callback_url = serializer.validated_data.get('redirect_url', '')
            result = client.initialize_transaction(
                email=request.user.email,
                amount=float(order.total),
                reference=reference,
                callback_url=callback_url,
            )
            if not result:
                return Response({'error': 'Payment provider unavailable'}, status=status.HTTP_502_BAD_GATEWAY)
            authorization_url = result['authorization_url']
        else:
            authorization_url = f'{settings.FRONTEND_URL}/order/success?reference={reference}'

        payment = Payment.objects.create(
            user=request.user,
            order=order,
            provider=provider,
            amount=order.total,
            reference=reference,
        )
        return Response({
            'payment': PaymentSerializer(payment).data,
            'authorization_url': authorization_url,
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payment = Payment.objects.get(reference=serializer.validated_data['reference'])
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        if payment.status == 'successful':
            return Response(PaymentSerializer(payment).data)

        provider = serializer.validated_data['provider']
        client = get_payment_client(provider)

        if client and client.is_configured:
            verify_result = client.verify_transaction(payment.reference)
            if verify_result is None:
                return Response({'error': 'Verification failed'}, status=status.HTTP_502_BAD_GATEWAY)
            payment.status = verify_result['status']
            payment.provider_reference = verify_result.get('provider_reference', '')
        else:
            payment.status = 'successful'

        payment.save()
        Transaction.objects.create(
            payment=payment,
            type='payment',
            amount=payment.amount,
            reference=f'TRX-{uuid.uuid4().hex[:12].upper()}',
            status=payment.status,
        )

        if payment.status == 'successful':
            payment.order.status = 'paid'
            payment.order.paid_at = payment.updated_at
            payment.order.save()

        return Response(PaymentSerializer(payment).data)


class WebhookReceiver(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider):
        log = WebhookLog.objects.create(
            provider=provider,
            event=request.data.get('event', 'unknown'),
            payload=request.data,
            headers=dict(request.headers),
        )

        try:
            client = get_payment_client(provider)
            if provider == 'paystack':
                signature = request.headers.get('x-paystack-signature', '')
                if client and not client.verify_webhook(signature, request.body):
                    log.processed = False
                    log.error = 'Invalid signature'
                    log.save()
                    return Response({'status': 'invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
            elif provider == 'flutterwave':
                signature = request.headers.get('verif-hash', '')
                expected = getattr(settings, 'FLUTTERRAYVE_WEBHOOK_SECRET', '')
                if expected and signature != expected:
                    log.processed = False
                    log.error = 'Invalid signature'
                    log.save()
                    return Response({'status': 'invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

            event = request.data.get('event', '')
            data = request.data.get('data', {})

            if event in ('charge.success', 'payment.completed'):
                reference = data.get('reference', '')
                if not reference:
                    reference = data.get('tx_ref', '')
                try:
                    payment = Payment.objects.get(reference=reference)
                    payment.status = 'successful'
                    payment.provider_reference = str(data.get('id', ''))
                    payment.save()
                    payment.order.status = 'paid'
                    payment.order.paid_at = payment.updated_at
                    payment.order.save()
                    log.processed = True
                except Payment.DoesNotExist:
                    log.error = f'Payment not found for reference: {reference}'

            elif event in ('charge.failed', 'payment.failed'):
                reference = data.get('reference', '') or data.get('tx_ref', '')
                try:
                    payment = Payment.objects.get(reference=reference)
                    payment.status = 'failed'
                    payment.save()
                    log.processed = True
                except Payment.DoesNotExist:
                    log.error = f'Payment not found for reference: {reference}'

            log.save()
        except Exception as e:
            log.error = str(e)
            log.save()
            logger.exception('Webhook processing error: %s', str(e))

        return Response({'status': 'received'})


class RefundPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def post(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        if payment.status != 'successful':
            return Response({'error': 'Payment not eligible for refund'}, status=status.HTTP_400_BAD_REQUEST)

        client = get_payment_client(payment.provider)
        if client and client.is_configured:
            if payment.provider == 'paystack':
                success = client.refund_transaction(payment.reference)
            elif payment.provider == 'flutterwave':
                success = client.refund_transaction(payment.provider_reference)
            else:
                success = False
            if not success:
                return Response({'error': 'Refund failed'}, status=status.HTTP_502_BAD_GATEWAY)

        payment.status = 'refunded'
        payment.save()
        payment.order.status = 'refunded'
        payment.order.save()

        Transaction.objects.create(
            payment=payment,
            type='refund',
            amount=payment.amount,
            reference=f'RFND-{uuid.uuid4().hex[:12].upper()}',
            status='successful',
        )

        return Response(PaymentSerializer(payment).data)
