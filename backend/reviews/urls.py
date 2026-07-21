from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.ProductReviewListView.as_view(), name='product-reviews'),
    path('product/<int:product_id>/create/', views.CreateReviewView.as_view(), name='create-review'),
    path('pending/', views.PendingReviewsView.as_view(), name='pending-reviews'),
    path('<int:review_id>/moderate/', views.ModerateReviewView.as_view(), name='moderate-review'),
]
