"""
WSGI config for app_tarefa project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Importando o dj_static para trabalhar com arquivos státicos/midia
from dj_static import Cling, MediaCling

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app_tarefa.settings')

application = Cling(MediaCling(get_wsgi_application()))
