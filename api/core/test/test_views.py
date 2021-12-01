import json
from django.http import response
from django.test import TestCase, Client 
from django.urls import reverse_lazy
from model_mommy import mommy 
#from rest_framework.test import APIRequestFactory
from django.urls import reverse
from rest_framework import status
from core.models import Lista
from core.serializers import ListaSerializer

client = Client()

class Lista_create_retornaCreateTestCase(TestCase):

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

class Lista_create_retornaGetAllTestCase(TestCase):

    """ Módulo de teste para retornar todas as Listas """
    
    def setUp(self):
        mommy.make('Lista', _quantity=5)

    def test_get_listas(self):        
        response = client.get(reverse('lista_cria_retorna'))
         
        listas = Lista.objects.all() 
        serializer = ListaSerializer(listas, many=True)       
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class Lista_atualiza_deletaUpdateTestCase(TestCase):

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



class Lista_atualiza_deletaDeleteTestCase(TestCase):

    def setUp(self):
        self.lista = mommy.make('Lista', _quantity=3)

    def test_valid_delete_lita(self):
        response = client.delete(reverse('lista_atualiza_deleta', kwargs={'pk': self.lista[0].pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_lista(self):
        response = client.delete(reverse('lista_atualiza_deleta', kwargs={'pk': 20}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

 

 
 
 
