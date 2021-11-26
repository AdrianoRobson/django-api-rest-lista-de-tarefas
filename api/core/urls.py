from django.urls import path 
from rest_framework.authtoken.views import obtain_auth_token  

from .views import nota_lista_retorna, \
nota_retorna_atualiza_deleta, \
nota_cria,\
lista_cria_retorna, \
lista_atualiza_deleta
 
urlpatterns = [
    
    path('token-auth/', obtain_auth_token, name='api_token_auth'),  

    # retorna notas
    path('api/notas/<str:pk>/', nota_lista_retorna),

    # retorna, atualiza, deleta nota
    path('api/nota/<str:pk>/', nota_retorna_atualiza_deleta), 

    # cria nota
    path('api/nota/',nota_cria), 

    # cria e retorna listas
    path('api/lista/', lista_cria_retorna),

    # Atualiza, Deleta listas
    path('api/lista/<str:pk>/', lista_atualiza_deleta),

] 