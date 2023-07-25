from django.urls import path
from . import views

urlpatterns = [
    path('clingviz/', views.clingviz, name='clingviz'),
]