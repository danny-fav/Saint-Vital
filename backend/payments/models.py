from django.db import models
from django.conf import settings
from core.models import TimeStampedModel


class Payment(TimeStampedModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]
    PROVIDER_CHOICES = [
        ('paystack', 'Paystack'),
        ('flutterwave', 'Flutterwave'),
        ('stripe', 'Stripe'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=255, unique=True)
    provider_reference = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(blank=True, default=dict)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.reference} - {self.status}'


class Transaction(TimeStampedModel):
    TYPES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('payout', 'Payout'),
    ]
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=20, choices=TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f'{self.type} - {self.reference}'


class WebhookLog(TimeStampedModel):
    provider = models.CharField(max_length=20)
    event = models.CharField(max_length=255)
    payload = models.JSONField()
    headers = models.JSONField(default=dict)
    processed = models.BooleanField(default=False)
    error = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.provider} - {self.event}'
