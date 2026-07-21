from django.db import models
from core.models import TimeStampedModel
from django.conf import settings


class AnalyticsEvent(TimeStampedModel):
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('product_view', 'Product View'),
        ('add_to_cart', 'Add to Cart'),
        ('purchase', 'Purchase'),
        ('search', 'Search'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    data = models.JSONField(default=dict)
    session_id = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
        ]

    def __str__(self):
        return f'{self.event_type} at {self.created_at}'


class DashboardMetric(TimeStampedModel):
    date = models.DateField()
    metric_type = models.CharField(max_length=50)
    value = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    class Meta:
        unique_together = ['date', 'metric_type']
        ordering = ['-date']

    def __str__(self):
        return f'{self.date} - {self.metric_type}: {self.value}'
