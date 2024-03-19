from django.core.management.base import BaseCommand, CommandError
from base.products import products
from base.models import Product, User
from base.serializers import ProductSerializer, UserSerializer
from django.utils import timezone

# {'_id': '1', 'name': 'Airpods Wireless Bluetooth Headphones', 'image': '/images/airpods.jpg', 
# 'description': 'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working', 
# 'brand': 'Apple', 'category': 'Electronics', 'price': 89.99, 
# 'countInStock': 10, 'rating': 4.5, 'numReviews': 12}

class Command(BaseCommand):
    help = "Command to add bulk products in ecommerce"

    def handle(self, *args, **options):
        try:
            user = User.objects.get(username='ecommerceadmin')
            userserializer = UserSerializer(user, many=False)
            print(userserializer.data)
            for p in products:
                product = Product(_id=p['_id'], 
                        name=p['name'], 
                        image=p['image'], 
                        description = p['description'],
                        brand = p['brand'],
                        category = p['category'],
                        price = p['price'],
                        countInStock = p['countInStock'],
                        rating = p['rating'],
                        numReviews = p['numReviews'],
                        user = user,
                        createdAt = timezone.now()
                        )
                serializer = ProductSerializer(product, many=False)
                print(serializer.data)
                product.save()
        except Exception as e:
            raise CommandError(e)

        