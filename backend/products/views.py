from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Tag, ProductColor, ProductSize
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    CategorySerializer, TagSerializer, ProductColorSerializer, ProductSizeSerializer
)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_new', 'featured', 'best_seller', 'collection__slug']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'rating', 'name']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class ProductFeaturedView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(status='active', featured=True)[:8]


class ProductNewArrivalsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(status='active', is_new=True)[:8]


class ProductBestSellersView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(status='active', best_seller=True)[:8]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class ProductColorListView(generics.ListAPIView):
    queryset = ProductColor.objects.all()
    serializer_class = ProductColorSerializer


class ProductSizeListView(generics.ListAPIView):
    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
