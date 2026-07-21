from django.contrib import admin
from .models import User, Address, UserPreference


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'email_verified', 'is_active', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    list_filter = ['role', 'email_verified', 'is_active']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'label', 'city', 'country', 'is_default']
    list_filter = ['country', 'is_default']


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'theme', 'newsletter']
