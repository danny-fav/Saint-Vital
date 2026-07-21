from rest_framework import serializers
from .models import Product, ProductVariant, ProductImage, Category, Tag, ProductColor, ProductSize


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = '__all__'


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class ProductVariantSerializer(serializers.ModelSerializer):
    color_name = serializers.CharField(source='color.name', read_only=True)
    color_hex = serializers.CharField(source='color.hex', read_only=True)
    size_name = serializers.CharField(source='size.name', read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'color', 'color_name', 'color_hex', 'size', 'size_name', 'price', 'stock', 'sku']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    primary_image = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'compare_at_price', 'category_name', 'category_slug',
            'is_new', 'featured', 'best_seller', 'stock', 'rating', 'review_count',
            'primary_image', 'available_colors', 'available_sizes', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            return ProductImageSerializer(img).data
        return None

    def get_available_colors(self, obj):
        return ProductColorSerializer(obj.colors.distinct(), many=True).data

    def get_available_sizes(self, obj):
        return ProductSizeSerializer(obj.sizes.distinct(), many=True).data


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_available_colors(self, obj):
        return ProductColorSerializer(obj.colors.distinct(), many=True).data

    def get_available_sizes(self, obj):
        return ProductSizeSerializer(obj.sizes.distinct(), many=True).data
