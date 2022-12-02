from django.shortcuts import render

# Create your views here.
def todoPage(request):
    return render(request, 'frontend/todos.html')
