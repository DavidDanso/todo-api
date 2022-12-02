from django.urls import path
from . import views

urlpatterns = [
    path('routes', views.getRoutes),
    path('todos', views.getTodos),
    path('todo/<str:pk>', views.getTodoDetails),

    path('create-todo', views.createTodo),
    path('update-todo/<str:pk>', views.updateTodo),
    path('delete-todo/<str:pk>', views.deleteTodo),

]