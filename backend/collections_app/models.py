from django.db import models
from core.models import TimeStampedModel


class Collection(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    banner = models.ImageField(upload_to='collections/banners/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_seasonal = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
