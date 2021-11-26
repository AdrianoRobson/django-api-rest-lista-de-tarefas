from django.urls import path 
from rest_framework.authtoken.views import obtain_auth_token  
from .views import nota_lista, nota_cria, nota_detail
 
urlpatterns = [
    
    path('token-auth/', obtain_auth_token, name='api_token_auth'),  

    # retorna notas
    path('api/notas/<str:pk>/', nota_lista),

    # cria nota
    path('api/nota/',nota_cria), 

    # retorna, atualiza, deleta nota
    path('api/nota/<str:pk>/', nota_detail),
 

] 