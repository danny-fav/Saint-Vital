from django.contrib import admin
from .models import Order, OrderItem, OrderNote, Invoice


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity']


class OrderNoteInline(admin.TabularInline):
    model = OrderNote
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method']
    search_fields = ['order_number', 'user__email']
    inlines = [OrderItemInline, OrderNoteInline]
    readonly_fields = ['order_number', 'subtotal', 'total']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'order', 'created_at']
