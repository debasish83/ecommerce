from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from base.models import Product, Review
from base.serializers import ProductSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    
    print('getProducts query: ' + query)
    # name__icontains looks for query match in name
    # i is case insensitive
    products = Product.objects.filter(name__icontains=query)

    page = request.query_params.get('page')
    paginator = Paginator(products, 2)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1

    page = int(page)
    
    serializer = ProductSerializer(products, many=True)
    # we can't return queryset from ORM, we need to serialize it to a json response
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

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

@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    #1 review already exist
    filteredReviews = product.review_set.filter(user=user).values('pk')
    alreadyExists = filteredReviews.exists()

    if alreadyExists:
        content = {'detail': 'Product already revieweed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        #2 - No rating or 0
        content = {'detail': 'Select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        #3 - create review
        review = Review.objects.create(
            user = user,
            product = product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        
        product.rating = total/len(reviews)
        product.save()
        return Response('review added')
