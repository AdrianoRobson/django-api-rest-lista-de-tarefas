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
from django.contrib.auth.models import User 

client = Client()

 

class RegisterAPI_TestCase(TestCase):

        """ Módulo de teste para criar uma nova Lista """
    
        def setUp(self): 

            mommy.make('User', username='username1', password='12345') 
            mommy.make('User', username='username2', password='12345')
            mommy.make('User', username='username3', password='12345')  


            self.valid_username = 'username_valid' 
            self.user_name_exist = 'username_invalid'       

            self.valid_user =  {
                "username": "usuario_test", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }

            self.invalid_user =  {
                "username": "", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }

            self.invalid_username =  {
                "username": "username3", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }

            self.valid_username =  {
                "username": "username4", 
                "email": "usuario_test@email.com",
                "password": "senha_test@123"
                }

            self.invalid_user_pass =  {
                "username": "username5", 
                "email": "usuario_test@email.com",
                "password": "123"
                } 

            self.valid_user_pass =  {
                "username": "username6", 
                "email": "usuario_test@email.com",
                "password": "1234"
                }            

        def test_create_valid_user(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.valid_user),
                content_type='application/json', 
            )
            self.assertEqual(request_response.status_code, status.HTTP_201_CREATED)


        def test_create_invalid_user(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.invalid_user),
                content_type='application/json', 
            )
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)
        

        def test_invalid_username(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.invalid_username),
                content_type='application/json', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)
           

        def test_valid_username(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.valid_user),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_201_CREATED)


        def test_invalid_pass(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.invalid_user_pass),
                content_type='application/json', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)
        

        def test_valid_pass(self):
            request_response = client.post(
                reverse('register'),
                data=json.dumps(self.valid_user_pass),
                content_type='application/json', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_201_CREATED)

          


class LoginAPI_TestCase(TestCase):

    def setUp(self):

        # mommy.make('User', username='username1', password='Password@123') 
        mommy.make('User', username='username2', password='12345')
        mommy.make('User', username='username3', password='12345') 

        User.objects.create(username='username1', password='Password@123')

        self.valid_user = {
            "username": "username1", 
            "password": "Password@123"
        }

        self.invalid_user = {
            "username": "username4", 
            "password": "Password@123"
        }


    def test_valid_user(self):
        request_response = client.post(
            reverse('login'),
            data=json.dumps(self.valid_user),
            content_type='application/json', 
        )

        print(f'********** request_response: {request_response.data}')

        self.assertEqual(request_response.status_code, status.HTTP_200_OK)

    def test_invalid_user(self):
        request_response = client.post(
            reverse('login'),
            data=json.dumps(self.invalid_user),
            content_type='application/json', 
        )
        self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)



                   

          
            
         
           
 
