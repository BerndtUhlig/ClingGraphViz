from django.urls import path
from . import views

urlpatterns = [
    path('graphUpdate/', views.graphUpdate, name='graphUpdate'),
    path('mock/', views.mockViz, name='mock'),
]