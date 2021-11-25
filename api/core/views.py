from .models import Tarefa, Lista
from .serializers import TarefaSerializer, ListaSerializer
from rest_framework import generics
#from rest_framework.permissions import IsAuthenticated
 
class ListaList(generics.ListCreateAPIView): 
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer

class ListDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer
