from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token  
from .views import tarefa_detail
 
urlpatterns = [
    
    path('token-auth/', obtain_auth_token, name='api_token_auth'), 
    
    path('api/<str:pk>/', tarefa_detail),  

]

#urlpatterns = format_suffix_patterns(urlpatterns)