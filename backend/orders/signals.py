from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import models as db_models
from .models import Order, OrderItem
from products.models import Product, ProductVariant
from notifications.models import Notification


@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            type='order',
            title='Order Placed',
            message=f'Your order {instance.order_number} has been placed successfully.',
            link=f'/account?order={instance.id}',
        )
        return
    messages = {
        'paid': ('Payment Confirmed', f'Payment for order {instance.order_number} has been confirmed.'),
        'shipped': ('Order Shipped', f'Your order {instance.order_number} has been shipped.'),
        'delivered': ('Order Delivered', f'Your order {instance.order_number} has been delivered.'),
        'cancelled': ('Order Cancelled', f'Your order {instance.order_number} has been cancelled.'),
        'refunded': ('Order Refunded', f'Your order {instance.order_number} has been refunded.'),
    }
    if instance.status in messages:
        title, message = messages[instance.status]
        Notification.objects.create(
            user=instance.user, type='order', title=title, message=message, link=f'/account?order={instance.id}',
        )


@receiver(post_save, sender=Order)
def decrement_stock_on_payment(sender, instance, **kwargs):
    if instance.status == 'paid' and instance.paid_at:
        for item in OrderItem.objects.filter(order=instance):
            if item.product:
                Product.objects.filter(id=item.product.id).update(stock=db_models.F('stock') - item.quantity)
            if item.variant:
                ProductVariant.objects.filter(id=item.variant.id).update(stock=db_models.F('stock') - item.quantity)
