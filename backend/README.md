### API design
We will use django rest framework to define the APIs

Method  Route                   Descriptions
GET     /api/products           Get all the products
GET     /api/products/25        Get product id 25
POST    /api/products/create    Create a product with product details
PUT     /api/products/update/25 Update product id 25 with details
DELETE  /api/products/delete/25 Delete product id 25

### Django API Project creation
Setup venv, install django and setup the backend project
python -m venv venv
source ./venv/bin/activate
python -m pip install Django
django-admin startproject backend
cd backend
python manage.py runserver

### Django apps
django support multiple apps in a project
we need an app for ecommerce base administration, product vendors and users
django support function and class based views. 
function based views are easier since all logic are in the same code. 
classes are for advanced users and need multiple files to review to understand code.

python manage.py startapp base

We can use class/function based views, function
We can connect url to views by configuring urls.py
From the project backend urls.py we can connect specific routes to the app
install djangorestframework to set the APIs on top of django

pip install djangorestframework

### Database design
User[id, username, first_name, last_name, email, password, is_staff, is_active, is_superuser]

one to many: 1 user can add many products
Product[id, user, productName, image, brand, category, desscription, rating, numReviews, price, countInStock, createdAt]

one to many: 1 user can add review on many products
Review[id, user, product, name, rating, comment, createdAt]

one to many: 1 user can add many orders, each order can have multiple items
Order[id, user, paymentMethod, taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt, createAt]

one to many: 1 order can have many order items from the cart
OrderItem[id, order, product, name, qty, price, image]

one to one: 1 order can have 1 shipping address associated with it
ShippingAddress[id, order, address,city, postalCode, country, shippingPrice]

### Setup Admin
python manage.py createsuperuser
create a superuser with website admin details. It will give us access to all our models

### Setup Databases
models.py add the database tables for different entities and specifiy the relations. Use makemigrations to setup the database creation plan
python manage.py makemigrations

Use migrate to apply the changes to database
python manage.py migrate

### authentication and authorization
authentication is the process where we get customer to provide username/password and then use it to authenticate user

With authorization we restrict customer to have say access to admin
pages where admin can add products to the ecommerce website

### serve react production build
Use npm run build to generate the frontend production build
Add it in frontend/build folder for deployment
Update settings.py template folder and static assets folder frontend/build/static and frontend/build
Serve index.html on the localhost:8000/ root path
manifest.json, favicon.ico and logo are not loading since django can't access them

Hacky solution:
copy the assets in frontend/build/static and update index.html to access them from static folder
https://stackoverflow.com/questions/59538755/how-do-i-get-django-to-load-my-favicon-from-my-react-build-directory
