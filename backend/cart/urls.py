from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart'),
    path('add/', views.AddToCartView.as_view(), name='cart-add'),
    path('items/<int:item_id>/', views.UpdateCartItemView.as_view(), name='cart-item-update'),
    path('items/<int:item_id>/remove/', views.RemoveFromCartView.as_view(), name='cart-item-remove'),
    path('items/<int:item_id>/save/', views.ToggleSaveForLaterView.as_view(), name='cart-item-save'),
    path('coupon/', views.ApplyCouponView.as_view(), name='cart-coupon'),
    path('clear/', views.ClearCartView.as_view(), name='cart-clear'),
]
