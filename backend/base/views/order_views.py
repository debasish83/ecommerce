from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )
        # (2) Create shipping address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country']
        )
        # (3) Create order items and set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )
            # (4) Update stock
            product.countInStock -= item.qty
            product.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    order = Order.objects.get(_id=pk)
    try:
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            print(serializer.data)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'}, 
                    status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exists'},
                        status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()
        return Response('Order was paid')
    except:
        return Response({'detail': 'Order does not exists'}, 
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@csrf_exempt
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    # integrate a logistic provider to deliver the order     
    return Response('Order was delivered')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    user = request.user
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
