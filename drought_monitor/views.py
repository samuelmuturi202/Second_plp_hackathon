# Create your views here.
# drought_app/views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.gis.geos import GEOSGeometry
import json

def index(request):
    return render(request, 'index.html')

def get_drought_forecast(request):
    # Simulate ML model output
    data = {
        'next_month': 'Severe',
        'two_months': 'Moderate',
        'three_months': 'Normal',
        'accuracy': 0.89
    }
    return JsonResponse(data)

def get_turkana_geojson(request):
    # In real app, load from shapefile or PostGIS
    geojson = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[34.0, 2.0], [35.0, 2.0], [35.0, 3.0], [34.0, 3.0], [34.0, 2.0]]]
        },
        "properties": {"name": "Turkana"}
    }
    return JsonResponse(geojson)
