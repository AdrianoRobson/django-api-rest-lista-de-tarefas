import json
from django.http import response
from django.test import TestCase, Client 
from django.urls import reverse_lazy
from model_mommy import mommy  
from django.urls import reverse
from rest_framework import status
from core.models import Lista, Tarefa
from core.serializers import ListaSerializer, TarefaSerializer
from rest_framework.parsers import JSONParser 


client = Client()

 

class RegisterAPI_TestCase(TestCase):

        """ Módulo de teste para criar uma nova Lista """
    
        def setUp(self):       

            self.valid_user =  {
                "username": "usuario_test", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }

            self.invalid_user =  {
                "username": "usuario_test", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }         

        def test_create_valid_user(self):
            response = client.post(
                reverse('register'),
                data=json.dumps(self.valid_user),
                content_type='application/json', 
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        def test_create_invalid_user(self):
            response = client.post(
                reverse('register'),
                data=json.dumps(self.valid_user),
                content_type='application/json', 
            )
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            print(f'@@@@@@@@@@@@@@@@@@@@@@@ response.data["token"]: {response.data["token"]}')
            
             
 
