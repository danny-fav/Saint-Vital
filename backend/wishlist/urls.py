from django.urls import path
from . import views

urlpatterns = [
    path('', views.WishlistView.as_view(), name='wishlist'),
    path('add/', views.AddToWishlistView.as_view(), name='wishlist-add'),
    path('items/<int:item_id>/remove/', views.RemoveFromWishlistView.as_view(), name='wishlist-remove'),
    path('count/', views.WishlistCountView.as_view(), name='wishlist-count'),
]
