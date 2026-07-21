from rest_framework import serializers
from .models import Collection


class CollectionSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'slug', 'description', 'banner', 'is_featured', 'is_seasonal', 'product_count', 'created_at']

    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()
