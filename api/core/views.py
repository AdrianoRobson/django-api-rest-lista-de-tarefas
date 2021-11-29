from .models import Tarefa, Lista
from .serializers import TarefaSerializer, ListaSerializer  
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status  
from rest_framework.decorators import api_view 

  

# cria e retorna listas
@api_view(['POST', 'GET'])
def lista_cria_retorna(request):

    if request.method == 'POST':            
        lista_data = JSONParser().parse(request)
        lista_serializer = ListaSerializer(data=lista_data)

        if lista_serializer.is_valid():
            lista_serializer.save()
            return JsonResponse(lista_serializer.data, status=status.HTTP_201_CREATED)

        return JsonResponse(lista_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
    elif request.method == 'GET':
        
        listas = Lista.objects.all()
        
        listas_serializer = ListaSerializer(listas, many=True)

        return JsonResponse(listas_serializer.data, safe=False)   
 

# Atualiza, Deleta listas
@api_view(['PUT', 'DELETE'])
def lista_atualiza_deleta(request, pk):
    try: 
        lista = Lista.objects.get(pk=pk) 
    except Lista.DoesNotExist: 
        return JsonResponse({'message': 'The lista does not exist'}, status=status.HTTP_404_NOT_FOUND) 
   
    if request.method == 'PUT': 
        lista_data = JSONParser().parse(request) 
        lista_serializer = ListaSerializer(lista, data=lista_data) 
        if lista_serializer.is_valid(): 
            lista_serializer.save() 
            return JsonResponse(lista_serializer.data) 
        return JsonResponse(lista_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        lista.delete() 
        return JsonResponse({'message': 'Lista was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

 


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
def nota_lista_retorna(request, pk):    
  
    tarefas = Tarefa.objects.filter(lista_id=pk)   
    
    if(tarefas):
        tarefas_serializer = TarefaSerializer(tarefas, many=True)    
        return JsonResponse(tarefas_serializer.data, safe=False)   

    return JsonResponse({'lastnoteid': Tarefa.objects.last().id})
     


@api_view(['PATCH'])
def lista_atualiza_parcial(request, pk):
    try:
        tarefa = Tarefa.objects.get(pk=pk)
    except Tarefa.DoesNotExist:
        return JsonResponse({'message': 'The tarefa doew not exist'}, status=status.HTTP_404_NOT_FOUND)

    tarefa_data = JSONParser().parse(request)
    tarefa_serializer = TarefaSerializer(tarefa, data=tarefa_data, partial=True)
    
    if tarefa_serializer.is_valid():
        tarefa_serializer.save()
        return JsonResponse(tarefa_serializer.data)

    return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Retorna, Atualiza, Deleta nota
@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
def nota_retorna_atualiza_deleta(request, pk):
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
    
    elif request.method == 'PATCH':
        tarefa_data = JSONParser().parse(request)
        tarefa_serializer = TarefaSerializer(tarefa, data=tarefa_data, partial=True)    
        if tarefa_serializer.is_valid():
            tarefa_serializer.save()
            return JsonResponse(tarefa_serializer.data)
        return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    elif request.method == 'DELETE': 
        tarefa.delete() 
        return JsonResponse({'message': 'Tarefa was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
       
    


    
        
        
    
    
