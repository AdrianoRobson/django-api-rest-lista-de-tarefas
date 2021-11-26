from .models import Tarefa, Lista
from .serializers import TarefaSerializer, ListaSerializer  
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status  
from rest_framework.decorators import api_view 





@api_view(['GET', 'POST', 'DELETE'])
def tarefa_lista(request):

    if request.method == 'GET':
        #tarefas = Tarefa.objects.filter(lista_id=pk)   
        #tarefas_serializer = TarefaSerializer(tarefas, many=True)
        #return JsonResponse(tarefas_serializer.data, safe=False) 
        pass 
 
    elif request.method == 'POST':
        tarefa_data = JSONParser().parse(request)
        tarefa_serializer = TarefaSerializer(data=tarefa_data)
        if tarefa_serializer.is_valid():
            tarefa_serializer.save()
            return JsonResponse(tarefa_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        count = Tarefa.objects.all().delete()
        return JsonResponse({'message': '{} Tutorials were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)


# Cria uma nota
@api_view(['POST'])
def nota_cria(request):
    nota_data = JSONParser().parse(request)
    nota_serializer = TarefaSerializer(data=nota_data)

    if nota_serializer.is_valid():
        nota_serializer.save()
        return JsonResponse(nota_serializer.data, status=status.HTTP_201_CREATED)

    return JsonResponse(nota_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    


# Retorna lista de notas
@api_view(['GET'])
def nota_lista(request, pk):    
  
    if tarefas := Tarefa.objects.filter(lista_id=pk):   
        tarefas_serializer = TarefaSerializer(tarefas, many=True)
        return JsonResponse(tarefas_serializer.data, safe=False) 
  
    return JsonResponse({'message': 'The tarefa does not exist'}, status=status.HTTP_404_NOT_FOUND) 
  

# Retorna, Atualiza, Deleta nota
@api_view(['GET', 'PUT', 'DELETE'])
def nota_detail(request, pk):
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
       
    


    
        
        
    
    
