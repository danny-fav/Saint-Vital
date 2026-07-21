from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Order, OrderItem
from .serializers import (
    OrderListSerializer, OrderDetailSerializer,
    CreateOrderSerializer, OrderStatusSerializer
)
from cart.models import Cart
from cart.serializers import CartSerializer
from core.permissions import IsAdminUser


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderListSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = Cart.objects.get(user=request.user)
        if cart.item_count == 0:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            subtotal=cart.subtotal,
            shipping_cost=0,
            tax=round(float(cart.subtotal) * 0.08, 2),
            total=cart.total,
            coupon_code=cart.coupon_code,
            discount=cart.discount,
            shipping_address=serializer.validated_data['shipping_address'],
            billing_address=serializer.validated_data.get('billing_address', serializer.validated_data['shipping_address']),
            payment_method=serializer.validated_data.get('payment_method', ''),
            customer_notes=serializer.validated_data.get('notes', ''),
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                product_name=cart_item.product.name,
                price=float(cart_item.unit_price),
                quantity=cart_item.quantity,
                color=cart_item.variant.color.name if cart_item.variant else '',
                size=cart_item.variant.size.name if cart_item.variant else '',
            )

        cart.items.all().delete()
        return Response(OrderDetailSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)


class AdminOrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'paid' and not instance.paid_at:
            instance.paid_at = timezone.now()
        elif instance.status == 'shipped' and not instance.shipped_at:
            instance.shipped_at = timezone.now()
        elif instance.status == 'delivered' and not instance.delivered_at:
            instance.delivered_at = timezone.now()
        instance.save()


class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)[:10]
