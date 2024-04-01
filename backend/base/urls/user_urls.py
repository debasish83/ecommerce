from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('register/', views.registerUser, name="register"),
    path('profile/', views.getUserProfile, name="users-profile"),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    # general pattern for entity=user
    # api/users/ - all users
    # api/users/${id} - get specific user by id
    # api/users/search/${query} - get specific users by query
    # api/users/add - add an user
    # api/users/update/$id - update user id
    # api/users/delete/$id - delete user id
    path('', views.getUsers, name='users'),
    path('<str:pk>/', views.getUserById, name='user'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]
