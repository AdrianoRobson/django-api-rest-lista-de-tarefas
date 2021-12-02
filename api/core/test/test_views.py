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

class ListaCreateTestCase(TestCase):

        """ Módulo de teste para criar uma nova Lista """
    
        def setUp(self):            
            self.valid_payload = {'titulo':'Teste'}
            self.invalid_payload ={'titulo':''}

        def test_create_valid_lista(self):
            response = client.post(
                reverse('lista_cria_retorna'),
                data=json.dumps(self.valid_payload),
                content_type='application/json',
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        def test_create_invalid_lista(self):
            response = client.post(
                reverse('lista_cria_retorna'),
                data=json.dumps(self.invalid_payload),
                content_type='application/json',
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ListaGetAllTestCase(TestCase):

    """ Módulo de teste para retornar todas as Listas """
    
    def setUp(self):
        mommy.make('Lista', _quantity=5)

    def test_get_listas(self):        
        response = client.get(reverse('lista_cria_retorna'))
         
        listas = Lista.objects.all() 
        serializer = ListaSerializer(listas, many=True)       
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ListaUpdateTestCase(TestCase):

    """ Módulo de teste para atualizar lista """
    
    def setUp(self): 
        self.lista = mommy.make('Lista', _quantity=3)  
        self.valid_payload = {'titulo':'Test'}
        self.invalid_payload = {'titulo': ''} 
 

    def test_invalid_update_lista(self): 
        response = client.put(
            reverse('lista_atualiza_deleta', kwargs={'pk': self.lista[0].pk}),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

 
    def test_invalid_update_lista(self):
 
        response = client.put(
            reverse('lista_atualiza_deleta', kwargs={'pk': self.lista[0].pk,}),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)    
 

class ListaDeleteTestCase(TestCase):

    def setUp(self):
        self.lista = mommy.make('Lista', _quantity=3)

    def test_valid_delete_lita(self):
        response = client.delete(reverse('lista_atualiza_deleta', kwargs={'pk': self.lista[0].pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_lista(self):
        response = client.delete(reverse('lista_atualiza_deleta', kwargs={'pk': 20}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

 

 ###################################### MODELS TAREFA #######################################################
 
   
class TarefaCreateTestCase(TestCase):   
    """ Módulo de teste para criar uma nova nota """

    def setUp(self):   
       self.lista = mommy.make('Lista', pk='1', titulo='test')
       self.lista = mommy.make('Lista', pk='2', titulo='test')

       self.valid_payload = {'lista_id':'1', 'tarefa_texto':'teste'}
       self.invalid_payload = {'lista_id':'2', 'tarefa_texto':''}
    
    def test_create_valid_nota(self): 
 
        response = client.post(
            reverse_lazy('nota_cria'),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
 
    
    def test_create_invalid_nota(self):
            response = client.post(
                reverse('nota_cria'),
                data=json.dumps(self.invalid_payload),
                content_type='application/json',
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class NotaGetAllTestCase(TestCase):

    """ Módulo de teste para retornar todas as notas de uma lista """
    
    def setUp(self): 
        self.lista = mommy.make('Lista', pk='1') 
        mommy.make('Tarefa', lista_id=self.lista)

    def test_get_listas(self):        
        response = client.get(reverse('nota_lista_retorna', kwargs={'pk':1}))  

        notas = Tarefa.objects.all() 
        serializer = TarefaSerializer(notas, many=True)       
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class NotaUpdateTestCase(TestCase):

    """ Módulo de teste para atualizar notas """
    
    def setUp(self): 

        self.lista1 = mommy.make('Lista', pk='1') 
        self.tarefa1 = mommy.make('Tarefa', pk='1', lista_id=self.lista1) 
        self.tarefa2 = mommy.make('Tarefa', pk='2', lista_id=self.lista1)   

        self.valid_payload = {  
            "lista_id": 1,
            "tarefa_texto": "Ir à praia de miguelópis",
            "status": True
        } 

        self.invalid_payload = {  
            "lista_id": 1,
            "tarefa_texto": "",
            "status": True
        }


        self.patch_valid_payload = {  
            "lista_id": 1, 
            "status": True
        } 

        self.patch_invalid_payload = {  
            "lista_id": 1, 
            "status": ""
        } 

    def test_valid_patch_nota(self): 
        response = client.patch(
            reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 1}),
            data=json.dumps(self.patch_valid_payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_invalid_patch_nota(self): 
        response = client.patch(
            reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 1}),
            data=json.dumps(self.patch_invalid_payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)      


    def test_valid_update_nota(self): 
        response = client.put(
            reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 1}),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_invalid_update_nota(self):
 
        response = client.put(
            reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 1}),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)    
 

class NotaDeleteTestCase(TestCase):

    def setUp(self):
        self.tarefa = mommy.make('Tarefa', _quantity=3)

    def test_valid_delete_nota(self):
        response = client.delete(reverse('nota_retorna_atualiza_deleta', kwargs={'pk': self.tarefa[0].pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_nota(self):
        response = client.delete(reverse('nota_retorna_atualiza_deleta', kwargs={'pk': 20}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
   
 
