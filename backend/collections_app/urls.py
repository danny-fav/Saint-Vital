from django.urls import path
from . import views

urlpatterns = [
    path('', views.CollectionListView.as_view(), name='collection-list'),
    path('featured/', views.CollectionFeaturedView.as_view(), name='collection-featured'),
    path('<slug:slug>/', views.CollectionDetailView.as_view(), name='collection-detail'),
]
