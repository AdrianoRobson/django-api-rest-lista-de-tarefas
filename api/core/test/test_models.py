from django.test import TestCase
from model_mommy import mommy
 
class ListaTestCase(TestCase):

    def setUp(self):
        self.lista = mommy.make('Lista')
    
    def test_str(self):
        self.assertEquals(str(self.lista), self.lista.titulo)


class TarefaTestCase(TestCase):

    def setUp(self):
        self.tarefa = mommy.make('Tarefa')

    def test_str(self):
        self.assertEquals(str(self.tarefa), self.tarefa.tarefa_texto)