from django.contrib import admin
from .models import Collection


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_featured', 'is_seasonal', 'is_active', 'order']
    list_filter = ['is_featured', 'is_seasonal', 'is_active']
    prepopulated_fields = {'slug': ['name']}
