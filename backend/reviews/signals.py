from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review
from products.models import Product


@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    product = instance.product
    stats = Review.objects.filter(product=product, is_approved=True).aggregate(
        avg_rating=Avg('rating'), review_count=Count('id')
    )
    Product.objects.filter(id=product.id).update(
        rating=round(stats['avg_rating'] or 0, 2),
        review_count=stats['review_count'] or 0,
    )
