from rest_framework import generics
from .models import Collection
from .serializers import CollectionSerializer


class CollectionListView(generics.ListAPIView):
    queryset = Collection.objects.filter(is_active=True)
    serializer_class = CollectionSerializer


class CollectionDetailView(generics.RetrieveAPIView):
    queryset = Collection.objects.filter(is_active=True)
    serializer_class = CollectionSerializer
    lookup_field = 'slug'


class CollectionFeaturedView(generics.ListAPIView):
    serializer_class = CollectionSerializer

    def get_queryset(self):
        return Collection.objects.filter(is_active=True, is_featured=True)
