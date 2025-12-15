from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import RegistroUnificadoSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import Marca, Cliente, Mecanico, Vehiculo, Cita, Servicio, Historial
from .serializers import (
    MarcaSerializer, ClienteSerializer, MecanicoSerializer, 
    VehiculoSerializer, CitaSerializer, ServicioSerializer, HistorialSerializer
)

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class MecanicoViewSet(viewsets.ModelViewSet):
    queryset = Mecanico.objects.all()
    serializer_class = MecanicoSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class HistorialViewSet(viewsets.ModelViewSet):
    queryset = Historial.objects.all()
    serializer_class = HistorialSerializer

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny] # Permite que usuarios no autenticados se registren

    def post(self, request):
        serializer = RegistroUnificadoSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "mensaje": "Usuario creado exitosamente",
                "usuario": user.username,
                "tipo": request.data.get('tipo_usuario')
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        # Determinar el rol
        rol = "desconocido"
        id_perfil = None
        
        # Verificamos los related_name definidos en tus modelos
        if hasattr(user, 'perfil_cliente'):
            rol = 'cliente'
            id_perfil = user.perfil_cliente.id
        elif hasattr(user, 'perfil_mecanico'):
            rol = 'mecanico'
            id_perfil = user.perfil_mecanico.id

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'rol': rol,
            'id_perfil': id_perfil # Útil para luego hacer fetch de datos del perfil
        })
