from django.db import models  
from django.contrib.auth.models import User 

from django.conf import settings

class Base(models.Model):
    criado = models.DateTimeField('criação', auto_now_add=True)
    modificado = models.DateTimeField('ctualização', auto_now=True)
    status = models.BooleanField('status', default=True) 

    class Meta:
        abstract = True 

class Lista(Base):      
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    titulo = models.CharField('Titulo', max_length=40, help_text="Máximo 40 caracteres")
    
    class Meta:
        verbose_name = 'Lista'
        verbose_name_plural = 'Listas'

    def __str__(self):
        return self.titulo


class Tarefa(Base):  
    lista_id = models.ForeignKey(Lista, on_delete=models.CASCADE)
    tarefa_texto =models.CharField('tarefa', max_length=50, help_text='Máximo 50 caracteres')
    status = models.BooleanField('status', default=False)

    class Meta:
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
    
    def __str__(self):
        return self.tarefa_texto