from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
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
        cart.coupon_code = code
        # TODO: Validate coupon against a Coupon model
        cart.discount = 0
        cart.save()
        return Response(CartSerializer(cart).data)


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
