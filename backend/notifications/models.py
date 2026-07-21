from django.db import models
from django.conf import settings
from core.models import TimeStampedModel


class Notification(TimeStampedModel):
    TYPE_CHOICES = [
        ('order', 'Order'),
        ('account', 'Account'),
        ('promotional', 'Promotional'),
        ('security', 'Security'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} - {self.title}'


class NotificationPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_prefs')
    order_updates = models.BooleanField(default=True)
    promotions = models.BooleanField(default=False)
    security_alerts = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.user.email} notification prefs'
