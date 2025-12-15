"""
URL configuration for TallerApiRest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# IMPORTANTE: Asegúrate de que 'tallerApp' sea el nombre real de tu carpeta de aplicación
from tallerApp import views 

# Creamos el router
router = DefaultRouter()

# Registramos las rutas usando los ViewSets que SI existen en tu views.py
router.register(r'marcas', views.MarcaViewSet, basename='marca')
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'mecanicos', views.MecanicoViewSet, basename='mecanico') # Antes buscabas 'empleadoView', ahora es esto
router.register(r'vehiculos', views.VehiculoViewSet, basename='vehiculo')
router.register(r'citas', views.CitaViewSet, basename='cita')
router.register(r'servicios', views.ServicioViewSet, basename='servicio')
router.register(r'historial', views.HistorialViewSet, basename='historial')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Incluimos las URLs generadas por el router
    path('', include(router.urls)),
    path('api/registro/', views.RegistroUsuarioView.as_view(), name='registro'),
    path('api/login/', views.CustomLoginView.as_view(), name='login'),
 
]