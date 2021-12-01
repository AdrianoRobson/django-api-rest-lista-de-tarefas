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




class UpdateSinglePuppyTest(TestCase):
    
    def setUp(self):
        
        self.muffin = mommy.make('Lista')  #Lista.objects.create(titulo='Muffy')
        self.valid_payload = {'titulo': 'Muffy',}
        self.invalid_payload = {'titulo': '',} 

    def test_valid_update_puppy(self):

        self.data = json.dumps(self.valid_payload)

        print(f'***************** self.data: {self.data}')

        response = client.put(
            reverse('lista_atualiza_deleta', kwargs={'pk':self.muffin.pk,}),
            dada=self.data,
            content_type='application/json'
        )

        print(f'***************** self.data: {self.data}')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
 





 

 


"""


class Lista_atualiza_deletaUpdateTestCase(TestCase):

    def setUp(self):
        self.lista = mommy.make('Lista') 
        self.valid_payload = {'titulo': 'Teste',}
        self.invalid_payload = {'titulo': '',} 

    def test_valid_update_lista(self):   
         
        self.data = json.dumps(self.valid_payload)

        response = client.put(
            reverse_lazy('lista_atualiza_deleta', kwargs={'pk':self.lista.pk,}),
            data=self.data, 
            content_type='application/json'
        ) 
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)  
   
    
    def test_invalid_update_lista(self):

        self.data = json.dumps(self.invalid_payload)

        response = client.put(
            reverse('lista_atualiza_deleta', kwargs={'pk': self.lista.pk,}),
            data=self.invalid_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)






 
class UpdateSinglePuppyTest(TestCase):
    
    def setUp(self):
        
        self.muffin = Lista.objects.create(titulo='Muffy')
        self.valid_payload = {'titulo': 'Muffy',}
        self.invalid_payload = {'titulo': '',}
        self.data = json.dumps(self.invalid_payload)

    def test_valid_update_puppy(self):
        response = client.put(
            reverse('lista_atualiza_deleta2', args=[self.muffin.pk]),
            self.data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        """


 
