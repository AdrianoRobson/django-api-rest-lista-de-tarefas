from django.urls import path, include
from .views import nota_lista_retorna, \
nota_retorna_atualiza_deleta, \
lista_cria_retorna, \
lista_atualiza_deleta, \
RegisterAPI, LoginAPI, UserAPI

from knox import views as knox_views
 
urlpatterns = [ 
    
    # Retorna id, name, email usuario autênticado
    path('api/user/', UserAPI.as_view()),    

    # path('api/user/logout/', knox_views.LogoutAllView.as_view()), 

    # Registra usuário
    path('api/register/', RegisterAPI.as_view(), name='register'),

    # Login usuário
    path('api/login/', LoginAPI.as_view(), name='login'),

    # Logout usuário
    path('api/logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),




    # Retorna notas
    path('api/notas/<str:pk>/', nota_lista_retorna, name='nota_lista_retorna'),

    #Cria, Retorna, atualiza, deleta tarefa
    path('api/nota/<str:pk>/', nota_retorna_atualiza_deleta, name='nota_retorna_atualiza_deleta'),  
     
    # Cria e retorna listas
    path('api/lista/', lista_cria_retorna, name='lista_cria_retorna'),

    # Atualiza, Deleta listas
    path('api/lista/<str:pk>/', lista_atualiza_deleta, name='lista_atualiza_deleta'),

] 