from django.urls import path
from base.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name='product-create'),
    path('upload/', views.uploadImage, name='product-upload'),
    path('<str:pk>/', views.getProduct, name="product"),
    # crud operations
    # create a lawyer with law firm if applicable
    # update the lawyer details
    # delete the lawyer profile
    # read the lawyer profile
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
]
