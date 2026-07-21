import uuid
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment, WebhookLog
from .serializers import PaymentSerializer, PaymentInitSerializer, PaymentVerifySerializer
from orders.models import Order
from core.permissions import IsAdminUser


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

        reference = f'SV-{uuid.uuid4().hex[:12].upper()}'
        payment = Payment.objects.create(
            user=request.user,
            order=order,
            provider=serializer.validated_data['provider'],
            amount=order.total,
            reference=reference,
        )
        # TODO: Integrate with actual payment provider
        return Response({
            'payment': PaymentSerializer(payment).data,
            'authorization_url': f'/api/payments/{reference}/confirm/',
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

        # TODO: Verify with actual provider
        payment.status = 'successful'
        payment.save()
        payment.order.status = 'paid'
        payment.order.save()
        return Response(PaymentSerializer(payment).data)


class WebhookReceiver(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider):
        WebhookLog.objects.create(
            provider=provider,
            event=request.data.get('event', 'unknown'),
            payload=request.data,
            headers=dict(request.headers),
        )
        return Response({'status': 'received'})


class RefundPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def post(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
        payment.status = 'refunded'
        payment.save()
        payment.order.status = 'refunded'
        payment.order.save()
        return Response(PaymentSerializer(payment).data)
