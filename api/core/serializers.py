from rest_framework import serializers
from .models import Lista, Tarefa
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model 
 

class ListaSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = Lista
        fields = ('id', 'usuario', 'titulo')

class TarefaSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tarefa
        fields = '__all__' 


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')



# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}  


    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'], 
            validated_data['email'], 
            validated_data['password'])
        return user
        
 
# Login Serializer
# Usando o serializer para validar o usuário autenticado
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField() 
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('usuário ou senha inválido!')
 