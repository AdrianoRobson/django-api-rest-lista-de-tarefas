from .models import Tarefa, Lista
from .serializers import LoginSerializer, TarefaSerializer, ListaSerializer, UserSerializer, RegisterSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status  
from rest_framework.decorators import api_view 
from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken 
from django.contrib.auth import login
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly

import json

class RegisterAPI(generics.GenericAPIView):
    
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })
 
class LoginAPI(generics.GenericAPIView):

    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        user = serializer.validated_data
        
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })
 

class UserAPI(generics.RetrieveAPIView): 
    permission_classes = [permissions.IsAuthenticated,] 
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
 
  

# cria e retorna listas
@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET']) 
def lista_cria_retorna(request): 

    lista_data = {} 
    if 'titulo' in request.data:       
        lista_data = {"usuario": request.user.pk, "titulo": request.data["titulo"]} 
        print(f'************************** lista_data: {lista_data}')  

    if request.method == 'POST':   
        lista_serializer = ListaSerializer(data=lista_data)  

        if lista_serializer.is_valid():
            lista_serializer.save() 
            return JsonResponse(lista_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(lista_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
    elif request.method == 'GET':        
        listas = Lista.objects.filter(usuario_id=request.user.pk)        
        listas_serializer = ListaSerializer(listas, many=True)
        return JsonResponse(listas_serializer.data, safe=False, status=status.HTTP_200_OK)   
 

# Atualiza, Deleta listas 
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def lista_atualiza_deleta(request, pk):  

    try: 
        lista = Lista.objects.get(pk=pk) 
    except Lista.DoesNotExist: 
        return JsonResponse({'message': 'lista não existe!'}, status=status.HTTP_404_NOT_FOUND) 
    
    
    lista_data = {} 
    if 'titulo' in request.data:   
        lista_data = {"usuario": request.user.pk, "titulo": request.data["titulo"]} 
        print(f'************************** lista_data: {lista_data}')  
   
    if request.method == 'PUT':   
        lista_serializer = ListaSerializer(lista, data=lista_data) 
        if lista_serializer.is_valid(): 
            lista_serializer.save() 
            return JsonResponse(lista_serializer.data, status=status.HTTP_200_OK) 
        return JsonResponse(lista_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        lista.delete() 
        return JsonResponse({'message': 'lista deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)
 

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
@permission_classes([IsAuthenticated])
def nota_lista_retorna(request, pk):  
    
    # Para não permitir que um usuário autenticado acesse notas de outro usuário
    try: 
        usuario = Lista.objects.get(pk=pk).usuario_id 

        if usuario != request.user.pk:
            raise Lista.DoesNotExist

    except Lista.DoesNotExist: 
        return JsonResponse({'message': 'vazio'}, status=status.HTTP_404_NOT_FOUND)   

    tarefas = Tarefa.objects.filter(lista_id=pk)   
    
    if(tarefas):
        tarefas_serializer = TarefaSerializer(tarefas, many=True)    
        return JsonResponse(tarefas_serializer.data, safe=False, status=status.HTTP_200_OK)  
        
    return JsonResponse({'message': 'vazio'}, status=status.HTTP_404_NOT_FOUND)
    
  
# Retorna, Atualiza, Deleta nota
@api_view(['PUT', 'DELETE', 'PATCH'])
def nota_retorna_atualiza_deleta(request, pk):
    try: 
        tarefa = Tarefa.objects.get(pk=pk) 
    except Tarefa.DoesNotExist: 
        return JsonResponse({'message': 'nota não existe'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'PUT': 
        tarefa_data = JSONParser().parse(request) 
        tarefa_serializer = TarefaSerializer(tarefa, data=tarefa_data) 
        if tarefa_serializer.is_valid(): 
            tarefa_serializer.save() 
            return JsonResponse(tarefa_serializer.data, status=status.HTTP_200_OK) 
        return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
    elif request.method == 'PATCH':
        tarefa_data = JSONParser().parse(request)
        tarefa_serializer = TarefaSerializer(tarefa, data=tarefa_data, partial=True)    
        if tarefa_serializer.is_valid():
            tarefa_serializer.save()
            return JsonResponse(tarefa_serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(tarefa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    elif request.method == 'DELETE': 
        tarefa.delete() 
        return JsonResponse({'message': 'nota foi deletada com sucesso!'}, status=status.HTTP_204_NO_CONTENT)
       
    


    
        
        
    
    
