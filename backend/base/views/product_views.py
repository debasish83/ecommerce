from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from base.models import Product
from base.serializers import ProductSerializer
from rest_framework import status

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
