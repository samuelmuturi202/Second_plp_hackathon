# drought_monitor/urls.py

from django.urls import path
from . import views

app_name = 'drought_monitor'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/forecast/', views.get_drought_forecast, name='forecast'),
    path('api/turkana/', views.get_turkana_geojson, name='turkana'),
]