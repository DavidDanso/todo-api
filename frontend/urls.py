from django.urls import path
from . import views

urlpatterns = [
    path('', views.todoPage, name='todos'),
]