from django.contrib import admin

from .models import Lista, Tarefa  
 
@admin.register(Lista)
class ListaAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'titulo']

@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = ['lista_id', 'tarefa_texto', 'status']