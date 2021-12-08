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
            user1 = mommy.make('User', id='1', username='username1', password='12345') 
            user2 = mommy.make('User', id='2', username='username2', password='12345')
            user3 = mommy.make('User', id='3', username='username3', password='12345')  

            lista1 = mommy.make('Lista', id='1', usuario=user1, titulo='Lista 1')
            lista2 = mommy.make('Lista', id='2', usuario=user2, titulo='Lista 2')
            lista3 = mommy.make('Lista', id='3', usuario=user3, titulo='Lista 3')

            tarefa1 = mommy.make('Tarefa', lista_id=lista1)
            tarefa2 = mommy.make('Tarefa', lista_id=lista2)
            tarefa3 = mommy.make('Tarefa', lista_id=lista3) 

 

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
           
            token = request_response.data['token'] 

            # Teste para recuperar informações do usuário pelo token
            request_response = client.get(
                reverse('user'), 
                HTTP_AUTHORIZATION=f'Token {token}' 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_200_OK)    


            # Teste para tentativa de recuperação de inoforações com token inválido
            request_response = client.get(
                reverse('user'), 
                HTTP_AUTHORIZATION=f'Token {token}1' 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_401_UNAUTHORIZED)  

           
            # Cria lista com token inválido
            request_response = client.post(
                reverse('lista_cria_retorna'), 
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"titulo": "Lista de compras"}),
                content_type='application/json', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_201_CREATED)

             # Tentativa de criação de lista com campo nulo
            request_response = client.post(
                reverse('lista_cria_retorna'), 
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"titulo": ""}),
                content_type='application/json', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)  


            # Teste do retorno de listas de tarefa pelo token
            request_response = client.get(
                reverse('lista_cria_retorna'), 
                HTTP_AUTHORIZATION=f'Token {token}' 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_200_OK) 


            # Teste de update válido da lista
            request_response = client.put(
                reverse('lista_atualiza_deleta', kwargs={'pk': 4}), 
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"titulo": "Lista de materiais"}),
                content_type='application/json',  
            )    
            self.assertEqual(request_response.status_code, status.HTTP_200_OK) 
 
             # Teste de update inválido da lista
            request_response = client.put(
                reverse('lista_atualiza_deleta', kwargs={'pk': 4}), 
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"titulo": ""}),
                content_type='application/json',  
            )    
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)


            # Teste de tentativa de update em um dado de outro usuário cadastrado
            request_response = client.put(
                reverse('lista_atualiza_deleta', kwargs={'pk': 3}), 
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"titulo": "Lista de natal"}),
                content_type='application/json',  
            )    
            self.assertEqual(request_response.status_code, status.HTTP_404_NOT_FOUND) 

             # Teste de retorno das listas invalido com id da lista de outro usuário
            request_response = client.get(
                reverse('nota_lista_retorna', kwargs={'pk': 1}), 
                HTTP_AUTHORIZATION=f'Token {token}', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_204_NO_CONTENT)   


            request_response = client.get(
                reverse('nota_lista_retorna', kwargs={'pk': 4}), 
                HTTP_AUTHORIZATION=f'Token {token}', 
            )    
            self.assertEqual(request_response.status_code, status.HTTP_204_NO_CONTENT)  
    

            # Criação de nota/tarefa válida
            request_response = client.post(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 4}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps( {"tarefa_texto": "Coprar presentes"}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_201_CREATED) 
            
            # Criação de nota/tarefa invalida
            request_response = client.post(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 4}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps( {"tarefa_texto": ""}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)  
            
           
             # Teste de retorno das listas valido  
            request_response = client.get(
                reverse('nota_lista_retorna', kwargs={'pk': 4}), 
                HTTP_AUTHORIZATION=f'Token {token}', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_200_OK)



            # Criação de nota/tarefa invalida com id de outro usuario
            request_response = client.post(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 3}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps( {"tarefa_texto": "Comprar leite"}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_404_NOT_FOUND) 

            
             # Update de nota/tarefa válida
            request_response = client.put(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 8}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"tarefa_texto": "Comprar presentes de natal", "status": False}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_200_OK)


            # Update de nota/tarefa inválida com id de outro usuario
            request_response = client.put(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 7}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"tarefa_texto": "Comprar presentes de natal", "status": False}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_404_NOT_FOUND)


             # Update de nota/tarefa inválida
            request_response = client.put(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 8}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"tarefa_texto": "", "status": False}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)


            # Update parcial de nota/tarefa válida
            request_response = client.patch(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 8}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"status": False}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_200_OK)


            # Update parcial de nota/tarefa inválida pelo id de outro usuario
            request_response = client.patch(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 7}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"status": False}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_404_NOT_FOUND)

             # Update parcial de nota/tarefa inválida por campo vazio
            request_response = client.patch(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 8}),
                HTTP_AUTHORIZATION=f'Token {token}',
                data=json.dumps({"status": ""}),
                content_type='application/json', 
            )  
            self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)


            # Deleta nota teste
            request_response = client.delete(
                reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 8}),
                HTTP_AUTHORIZATION=f'Token {token}',  
            )  
            self.assertEqual(request_response.status_code, status.HTTP_204_NO_CONTENT) 
 

             # Teste para o delete
            request_response = client.delete(
                reverse('lista_atualiza_deleta', kwargs={'pk': 4}), 
                HTTP_AUTHORIZATION=f'Token {token}',  
                content_type='application/json',  
            )    
            self.assertEqual(request_response.status_code, status.HTTP_204_NO_CONTENT)   


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

        self.user1 = User.objects.create(username='username1', is_active=True, is_staff=False, is_superuser=True) 
        self.user1.set_password('12345') 
        self.user1.save()

        self.user2 = User.objects.create(username='username2', is_active=True, is_staff=False, is_superuser=True) 
        self.user2.set_password('12345') 
        self.user2.save()

        self.user3 = User.objects.create(username='username3', is_active=True, is_staff=False, is_superuser=True) 
        self.user3.set_password('12345') 
        self.user3.save() 

        self.valid_login = {
            "username": "username1", 
            "password": "12345"
        }  

        self.invalid_login = {
            "username": "username4", 
            "password": "12345"
        }  

    def test_valid_user(self):
        request_response = client.post(
            reverse('login'),
            data=json.dumps(self.valid_login),
            content_type='application/json', 
        )  
        self.assertEqual(request_response.status_code, status.HTTP_200_OK)


    def test_invalid_login(self):
        request_response = client.post(
            reverse('login'),
            data=json.dumps(self.invalid_login),
            content_type='application/json', 
        )  
        self.assertEqual(request_response.status_code, status.HTTP_400_BAD_REQUEST)


 
 

    


          
            
         
           
 
