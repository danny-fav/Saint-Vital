from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('featured/', views.ProductFeaturedView.as_view(), name='product-featured'),
    path('new-arrivals/', views.ProductNewArrivalsView.as_view(), name='product-new-arrivals'),
    path('best-sellers/', views.ProductBestSellersView.as_view(), name='product-best-sellers'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('tags/', views.TagListView.as_view(), name='tag-list'),
    path('colors/', views.ProductColorListView.as_view(), name='color-list'),
    path('sizes/', views.ProductSizeListView.as_view(), name='size-list'),
]
