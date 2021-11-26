from .models import Tarefa, Lista
from .serializers import TarefaSerializer, ListaSerializer  
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status  
from rest_framework.decorators import api_view 


@api_view(['GET', 'PUT', 'DELETE'])
def tarefa_detail(request, pk):
    try: 
        tarefa = Tarefa.objects.get(pk=pk) 
    except Tarefa.DoesNotExist: 
        return JsonResponse({'message': 'The tarefa does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        tarefa_serializer = TarefaSerializer(tarefa) 
        return JsonResponse(tarefa_serializer.data, safe=False) 
 
    elif request.method == 'PUT': 
        tarefa_data = JSONParser().parse(request) 
        tarefa_serializer = TarefaSerializer(tarefa, data=tarefa_data) 
        if tarefa_serializer.is_valid(): 
            tarefa_serializer.save() 
            return JsonResponse(tarefa_serializer.data) 
        return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        tarefa.delete() 
        return JsonResponse({'message': 'Tarefa was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
       
    


    
        
        
    
    
