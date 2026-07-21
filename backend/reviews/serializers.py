from rest_framework import serializers
from .models import Review, ReviewImage


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    images = ReviewImageSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_avatar', 'product', 'rating',
            'title', 'content', 'is_verified_purchase', 'helpful_count',
            'images', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'helpful_count', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'title', 'content']
