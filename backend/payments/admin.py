from django.contrib import admin
from .models import Payment, Transaction, WebhookLog


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'user', 'order', 'provider', 'amount', 'status', 'created_at']
    list_filter = ['status', 'provider']
    search_fields = ['reference', 'user__email', 'order__order_number']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['reference', 'payment', 'type', 'amount', 'status']


@admin.register(WebhookLog)
class WebhookLogAdmin(admin.ModelAdmin):
    list_display = ['provider', 'event', 'processed', 'created_at']
