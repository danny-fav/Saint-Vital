from django.contrib import admin
from .models import Cart, CartItem, Coupon


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'min_order_amount', 'usage_limit', 'used_count', 'is_active', 'valid_from', 'valid_to']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'subtotal', 'coupon_code']
    inlines = [CartItemInline]
