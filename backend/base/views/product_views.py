from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from base.models import Product
from base.serializers import ProductSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    # we can't return queryset from ORM, we need to serialize it to a json response
    return Response(serializer.data)

# O(n) for loop can be improved to O(logn) & O(1)
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='samsung-galaxy-tab-a9-plus-5g',
        price=269.99,
        brand='samsung',
        countInStock=10,
        numReviews=400,
        category='Electronics',
        description="The new Samsung Galaxy Tab A9+ 5G for your on-the-go family fun. Fast AT&T 5G* connectivity makes every experience feel smooth and easy while the bright, engaging 11-inch screen1 and quad Dolby Atmos®-powered speakers bring entertainment to life. Plus, pre-loaded Samsung Kids app provides a safe digital environment for your little ones to happily learn and play. Give your family a great, all-in-one Tab that meets their everyday needs at a great value price!")
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@csrf_exempt
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.description = data['description']
    product.category = data['category']
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@csrf_exempt
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('product deleted')
