from django.db import models
from core.models import TimeStampedModel


class IntegrationConfig(models.Model):
    PROVIDER_CHOICES = [
        ('printful', 'Printful'),
        ('printify', 'Printify'),
    ]
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, unique=True)
    api_key = models.CharField(max_length=500, blank=True)
    api_url = models.URLField(max_length=500, blank=True)
    shop_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=False)
    webhook_secret = models.CharField(max_length=500, blank=True)
    config = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.get_provider_display()} config'


class SyncLog(TimeStampedModel):
    SYNC_TYPES = [
        ('products', 'Products'),
        ('inventory', 'Inventory'),
        ('orders', 'Orders'),
        ('fulfillment', 'Fulfillment'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    integration = models.ForeignKey(IntegrationConfig, on_delete=models.CASCADE, related_name='sync_logs')
    sync_type = models.CharField(max_length=20, choices=SYNC_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    error = models.TextField(blank=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.integration.provider} - {self.sync_type} - {self.status}'


class FulfillmentSync(TimeStampedModel):
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='fulfillments')
    sync_log = models.ForeignKey(SyncLog, on_delete=models.CASCADE, related_name='fulfillments')
    provider_order_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, default='pending')
    tracking_number = models.CharField(max_length=255, blank=True)
    tracking_url = models.URLField(max_length=500, blank=True)
    carrier = models.CharField(max_length=100, blank=True)
    error = models.TextField(blank=True)

    def __str__(self):
        return f'Fulfillment {self.order.order_number}'


class ShipmentTracking(models.Model):
    fulfillment = models.ForeignKey(FulfillmentSync, on_delete=models.CASCADE, related_name='tracking_updates')
    status = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.fulfillment.order.order_number} - {self.status}'
