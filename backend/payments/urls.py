from django.urls import path
from . import views

urlpatterns = [
    path('', views.PaymentHistoryView.as_view(), name='payment-list'),
    path('order/<int:order_id>/init/', views.InitiatePaymentView.as_view(), name='payment-init'),
    path('verify/', views.VerifyPaymentView.as_view(), name='payment-verify'),
    path('webhook/<str:provider>/', views.WebhookReceiver.as_view(), name='payment-webhook'),
    path('<int:payment_id>/refund/', views.RefundPaymentView.as_view(), name='payment-refund'),
]
