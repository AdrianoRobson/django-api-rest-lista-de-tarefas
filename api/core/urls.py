from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token  
from .views import ListaList, ListDetail

urlpatterns = [
    
    path('token-auth/', obtain_auth_token, name='api_token_auth'), 

    path('lista/', ListaList.as_view()),

    path('lista/<str:pk>/', ListDetail.as_view()),  

]

urlpatterns = format_suffix_patterns(urlpatterns)