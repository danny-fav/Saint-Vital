from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from decimal import Decimal
from django.utils import timezone
from .models import Cart, CartItem, Coupon
from .serializers import CartSerializer, CartItemCreateSerializer, CartItemUpdateSerializer
from products.models import Product, ProductVariant


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = Product.objects.get(id=serializer.validated_data['product_id'])
        variant_id = serializer.validated_data.get('variant_id')
        variant = ProductVariant.objects.get(id=variant_id) if variant_id else None
        quantity = serializer.validated_data['quantity']
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant,
            defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = Cart.objects.get(user=request.user)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        qty = serializer.validated_data['quantity']
        if qty == 0:
            item.delete()
        else:
            item.quantity = qty
            item.save()
        return Response(CartSerializer(cart).data)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = Cart.objects.get(user=request.user)
        CartItem.objects.filter(id=item_id, cart=cart).delete()
        cart.refresh_from_db()
        return Response(CartSerializer(cart).data, status=status.HTTP_204_NO_CONTENT)


class ToggleSaveForLaterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        cart = Cart.objects.get(user=request.user)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        item.saved_for_later = not item.saved_for_later
        item.save()
        return Response(CartSerializer(cart).data)


class ApplyCouponView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code', '')
        cart = Cart.objects.get(user=request.user)
        if not code:
            cart.coupon_code = ''
            cart.discount = 0
            cart.save()
            return Response(CartSerializer(cart).data)
        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_400_BAD_REQUEST)
        if not coupon.is_valid():
            return Response({'error': 'Coupon is expired or no longer valid'}, status=status.HTTP_400_BAD_REQUEST)
        if cart.subtotal < coupon.min_order_amount:
            return Response({'error': f'Minimum order amount of ${coupon.min_order_amount} not met'}, status=status.HTTP_400_BAD_REQUEST)
        if coupon.discount_type == 'percentage':
            discount = (cart.subtotal * coupon.discount_value / Decimal('100'))
            if coupon.max_discount and discount > coupon.max_discount:
                discount = coupon.max_discount
        else:
            discount = coupon.discount_value
        cart.coupon_code = code
        cart.discount = discount
        cart.save()
        return Response(CartSerializer(cart).data)


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
