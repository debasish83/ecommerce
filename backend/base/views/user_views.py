from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import User
from base.serializers import MyTokenObtainPairSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer
# Create your views here.
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import logging

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# this particular view is admin only view and can be accessed by admin users only
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# TODO: Add try catch for error handling if userId is not found
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# TODO: Add try catch for handling if userId is not found
# TODO: turned off csrf protection, need to understand more to add it back
@api_view(['DELETE'])
@csrf_exempt
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    print('delete userid ' + pk) 
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')


@api_view(['PUT'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)
    data = request.data
    
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['admin']
    
    user.save()
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


#TODO: turned off csrf protection, need to understand more to add it back
@api_view(['PUT'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    logging.info(request.user)
    logging.info(request.data)
    
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    logging.info(serializer.data)

    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()

    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data ['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'details' : 'User with this email already exists'}
        return Response(message, status = status.HTTP_400_BAD_REQUEST)

