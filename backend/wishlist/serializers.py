from rest_framework import serializers
from .models import Wishlist, WishlistItem
from products.serializers import ProductListSerializer


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'count', 'created_at', 'updated_at']
