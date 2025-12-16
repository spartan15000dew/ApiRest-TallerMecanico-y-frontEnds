from django.contrib import admin
from django.urls import path
from tallerApp.views import (
    RegistroUnificadoView, CustomLoginView,
    VehiculoList, VehiculoDetail,
    CitaList, CitaDetail, FinalizarCitaView,
    HistorialList, MecanicoList,AceptarCitaView,MiPerfilMecanicoView,MarcaListPublicView,
    # Vistas de Admin
    AdminMarcaList, AdminMecanicosPendientes, AprobarMecanicoView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/marcas/', MarcaListPublicView.as_view(), name='marcas-list-public'),
    path('api/mecanicos/perfil/', MiPerfilMecanicoView.as_view(), name='mi-perfil-mecanico'),

    path('api/citas/<int:pk>/', CitaDetail.as_view(), name='cita-detail'),
    

    path('api/citas/<int:pk>/aceptar/', AceptarCitaView.as_view(), name='cita-aceptar'),
    
    path('api/citas/<int:pk>/finalizar/', FinalizarCitaView.as_view(), name='cita-finalizar'),


    path('api/auth/registro/', RegistroUnificadoView.as_view(), name='registro'),
    path('api/auth/login/', CustomLoginView.as_view(), name='login'),


    path('api/vehiculos/', VehiculoList.as_view(), name='vehiculo-list'),
    path('api/vehiculos/<int:pk>/', VehiculoDetail.as_view(), name='vehiculo-detail'),


    path('api/citas/', CitaList.as_view(), name='cita-list'),
    path('api/citas/<int:pk>/', CitaDetail.as_view(), name='cita-detail'),
    path('api/citas/<int:pk>/finalizar/', FinalizarCitaView.as_view(), name='cita-finalizar'),


    path('api/historial/', HistorialList.as_view(), name='historial-list'),
    path('api/mecanicos/', MecanicoList.as_view(), name='mecanico-list'),


    path('api/admin/marcas/', AdminMarcaList.as_view(), name='api-admin-marcas'),
    path('api/admin/mecanicos-pendientes/', AdminMecanicosPendientes.as_view(), name='api-admin-mecanicos-pendientes'),
    path('api/admin/aprobar-mecanico/<int:pk>/', AprobarMecanicoView.as_view(), name='api-aprobar-mecanico'),
]