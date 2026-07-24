from decimal import Decimal
from django.db import models
from django.conf import settings
from core.models import TimeStampedModel
from products.models import Product, ProductVariant


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=10, choices=[('percentage', 'Percentage'), ('fixed', 'Fixed Amount')])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.IntegerField(default=0)
    used_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_to and (self.usage_limit == 0 or self.used_count < self.usage_limit)


class Cart(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    coupon_code = models.CharField(max_length=50, blank=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f'{self.user.email} cart'

    @property
    def subtotal(self):
        return sum(item.total for item in self.items.all())

    @property
    def total(self):
        return self.subtotal - Decimal(str(self.discount))

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    saved_for_later = models.BooleanField(default=False)

    class Meta:
        unique_together = ['cart', 'product', 'variant']

    def __str__(self):
        return f'{self.product.name} x{self.quantity}'

    @property
    def unit_price(self):
        return self.variant.price if self.variant and self.variant.price else self.product.price

    @property
    def total(self):
        return self.unit_price * self.quantity
