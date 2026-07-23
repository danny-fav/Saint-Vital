from decimal import Decimal
from django.db import models
from django.conf import settings
from core.models import TimeStampedModel
from products.models import Product, ProductVariant


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
