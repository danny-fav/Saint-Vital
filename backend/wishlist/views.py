from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer
from products.models import Product


class WishlistView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


class AddToWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product = Product.objects.get(id=product_id)
        WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)
        return Response(WishlistSerializer(wishlist).data, status=status.HTTP_201_CREATED)


class RemoveFromWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        wishlist = Wishlist.objects.get(user=request.user)
        WishlistItem.objects.filter(id=item_id, wishlist=wishlist).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response({'count': wishlist.count})
