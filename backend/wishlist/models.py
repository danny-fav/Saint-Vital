from django.db import models
from django.conf import settings
from core.models import TimeStampedModel
from products.models import Product


class Wishlist(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')

    def __str__(self):
        return f'{self.user.email} wishlist'

    @property
    def count(self):
        return self.items.count()


class WishlistItem(TimeStampedModel):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['wishlist', 'product']

    def __str__(self):
        return self.product.name
