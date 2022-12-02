from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'GET': '/api/routes/'},
        {'POST': '/api/create-todo/'},
        {'POST': '/api/todos/'},
        {'POST': '/api/todo/id'},

        {'POST': '/api/update-todo/id'},
        {'DELETE': '/api/delete-todo/id'},
    ]
    return Response(routes)

@api_view(['GET'])
def getTodos(request):
    todo = Todo.objects.all()
    serializer = TodoSerializer(todo, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getTodoDetails(request, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TodoSerializer(todo, many=False)
    print(todo.natural_time)
    return Response(serializer.data)

@api_view(['POST'])
def createTodo(request):
    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def updateTodo(request, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TodoSerializer(instance=todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteTodo(request, pk):
    todo = Todo.objects.get(id=pk)
    todo.delete()
    return Response(f'{todo.title} deleted successfully!')
