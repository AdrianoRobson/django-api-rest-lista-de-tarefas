from .models import Tarefa, Lista
from .serializers import TarefaSerializer, ListaSerializer
from rest_framework import generics 
#from rest_framework.permissions import IsAuthenticated
 
class ListaList(generics.ListAPIView):      
    serializer_class = ListaSerializer
    queryset = Lista.objects.all()   
     

class TarefaList(generics.ListAPIView):    
    serializer_class = TarefaSerializer  

    def get_queryset(self):
        return Tarefa.objects.filter(lista_id=self.kwargs['pk'])

class TarefaCreate(generics.CreateAPIView):
    serializer_class = TarefaSerializer
    queryset = Tarefa.objects.all()

class TarefaUpdate(generics.UpdateAPIView):
    serializer_class = TarefaSerializer 
    queryset = Tarefa.objects.all()
     
    


    
        
        
    
    
