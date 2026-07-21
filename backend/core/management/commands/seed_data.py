import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from products.models import Category, Product, ProductVariant, ProductImage, ProductColor, ProductSize
from collections_app.models import Collection
from accounts.models import User


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        admin, _ = User.objects.get_or_create(
            email='admin@saintvital.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'Saint Vital',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin.set_password('admin123')
        admin.save()

        categories_data = [
            {'name': 'T-Shirts', 'slug': 't-shirts', 'description': 'Essential tees and tops'},
            {'name': 'Hoodies', 'slug': 'hoodies', 'description': 'Premium hoodies and sweatshirts'},
            {'name': 'Jackets', 'slug': 'jackets', 'description': 'Outerwear and jackets'},
            {'name': 'Outerwear', 'slug': 'outerwear', 'description': 'Coats and premium outerwear'},
            {'name': 'Accessories', 'slug': 'accessories', 'description': 'Hats, bags, and accessories'},
        ]
        for cat_data in categories_data:
            Category.objects.get_or_create(**cat_data)

        collections_data = [
            {'name': 'Core', 'slug': 'core', 'description': 'The foundation of the Saint Vital wardrobe. Timeless essentials crafted for permanence.'},
            {'name': 'Signature', 'slug': 'signature', 'description': 'Our signature pieces. Defined by restraint, executed in premium materials.'},
            {'name': 'Limited Edition', 'slug': 'limited-edition', 'description': 'Limited runs that push the boundaries of the collection.'},
        ]
        for col_data in collections_data:
            Collection.objects.get_or_create(**col_data)

        sizes_data = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        for size in sizes_data:
            ProductSize.objects.get_or_create(name=size)

        colors_data = [
            {'name': 'Noir', 'hex': '#0a0a0a'},
            {'name': 'Ivory', 'hex': '#f5f0e8'},
            {'name': 'Onyx', 'hex': '#1a1a1a'},
            {'name': 'Sand', 'hex': '#d4c5a9'},
            {'name': 'Burgundy', 'hex': '#6e2022'},
        ]
        for color in colors_data:
            ProductColor.objects.get_or_create(**color)

        products_data = [
            {
                'name': 'Vital Monogram Hoodie',
                'slug': 'vital-hoodie-noir',
                'price': 189.00,
                'compare_at_price': 0,
                'description': 'A heavyweight essential. The Vital Monogram Hoodie is cut from 100% organic cotton fleece and garment-dyed for a lived-in feel. Finished with a tonal logo application at the chest.',
                'category_slug': 'hoodies',
                'collection_slug': 'core',
                'is_new': True,
                'featured': True,
                'stock': 50,
                'images': ['product-hoodie.jpg'],
                'color_names': ['Noir', 'Ivory'],
            },
            {
                'name': 'Legacy Essential Tee',
                'slug': 'legacy-tee',
                'price': 72.00,
                'compare_at_price': 0,
                'description': 'The foundation of the Saint Vital wardrobe. Cut from 220 GSM ring-spun cotton with a relaxed fit and ribbed collar.',
                'category_slug': 't-shirts',
                'collection_slug': 'core',
                'is_new': False,
                'featured': False,
                'stock': 100,
                'images': ['product-tshirt.jpg'],
                'color_names': ['Noir', 'Ivory', 'Sand'],
            },
            {
                'name': 'Sovereign Bomber',
                'slug': 'sovereign-bomber',
                'price': 420.00,
                'compare_at_price': 0,
                'description': 'A modern take on the classic MA-1. Constructed from Japanese nylon with a satin interior and ribbed trims.',
                'category_slug': 'jackets',
                'collection_slug': 'signature',
                'is_new': True,
                'featured': True,
                'stock': 25,
                'images': ['product-jacket.jpg'],
                'color_names': ['Onyx', 'Burgundy'],
            },
            {
                'name': 'Monogram Cap',
                'slug': 'monogram-cap',
                'price': 68.00,
                'compare_at_price': 0,
                'description': 'A structured six-panel cap in premium cotton twill. Embroidered monogram at the front.',
                'category_slug': 'accessories',
                'collection_slug': 'core',
                'is_new': False,
                'featured': False,
                'stock': 75,
                'images': ['product-cap.jpg'],
                'color_names': ['Noir', 'Sand'],
            },
            {
                'name': 'Atelier Camel Coat',
                'slug': 'atelier-coat',
                'price': 890.00,
                'compare_at_price': 1100.00,
                'description': 'A restored-chic silhouette cut from Italian wool-cashmere melton. Fully lined with horn buttons.',
                'category_slug': 'outerwear',
                'collection_slug': 'signature',
                'is_new': False,
                'featured': True,
                'stock': 15,
                'images': ['product-jacket.jpg'],
                'color_names': ['Sand'],
            },
            {
                'name': 'Obsidian Tailored Coat',
                'slug': 'obsidian-suit',
                'price': 1240.00,
                'compare_at_price': 0,
                'description': 'A single-breasted overcoat in heavy wool flannel. Peak lapels, pick stitching, and a silk lining.',
                'category_slug': 'outerwear',
                'collection_slug': 'limited-edition',
                'is_new': False,
                'featured': True,
                'stock': 10,
                'images': ['product-jacket.jpg'],
                'color_names': ['Onyx'],
            },
            {
                'name': 'Onyx & Gold Set',
                'slug': 'onyx-accessories',
                'price': 340.00,
                'compare_at_price': 0,
                'description': 'A curated set of daily essentials: enamel cufflinks, a cardholder, and a signet ring.',
                'category_slug': 'accessories',
                'collection_slug': 'limited-edition',
                'is_new': True,
                'featured': False,
                'stock': 30,
                'images': ['product-cap.jpg'],
                'color_names': ['Onyx', 'Burgundy'],
            },
            {
                'name': 'SL Signature Tee',
                'slug': 'sl-tee-white',
                'price': 85.00,
                'compare_at_price': 0,
                'description': 'A lighter-weight essential with a refined fit. The SL monogram is embroidered at the hem.',
                'category_slug': 't-shirts',
                'collection_slug': 'signature',
                'is_new': False,
                'featured': False,
                'stock': 90,
                'images': ['product-tshirt.jpg'],
                'color_names': ['Ivory', 'Noir'],
            },
        ]

        for prod_data in products_data:
            category = Category.objects.get(slug=prod_data['category_slug'])
            collection = Collection.objects.get(slug=prod_data['collection_slug'])
            product, _ = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults={
                    'name': prod_data['name'],
                    'price': prod_data['price'],
                    'compare_at_price': prod_data['compare_at_price'],
                    'description': prod_data['description'],
                    'category': category,
                    'collection': collection,
                    'is_new': prod_data['is_new'],
                    'featured': prod_data['featured'],
                    'stock': prod_data['stock'],
                }
            )
            for img_name in prod_data['images']:
                ProductImage.objects.get_or_create(
                    product=product,
                    image=f'products/{img_name}',
                    defaults={'alt_text': product.name, 'order': 0}
                )
            for color_name in prod_data['color_names']:
                color = ProductColor.objects.get(name=color_name)
                ProductVariant.objects.get_or_create(
                    product=product,
                    color=color,
                    size=ProductSize.objects.first(),
                    defaults={'stock': prod_data['stock'], 'price': prod_data['price']}
                )

        self.stdout.write(self.style.SUCCESS('Data seeded successfully'))
