from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.db.models import Q

from .models import *
from .serializers import *
from .permissions import EsDueñoVehiculo, EsMecanicoAsignado
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser


class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            

            rol = ''
            

            if user.is_staff:
                rol = 'administrador'
            

            elif hasattr(user, 'perfil_mecanico'): 
                rol = 'mecanico'
            

            elif hasattr(user, 'perfil_cliente'): 
                rol = 'cliente'

            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'rol': rol
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistroUnificadoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroUnificadoSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "mensaje": "Usuario creado exitosamente",
                "token": token.key,
                "usuario": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class VehiculoList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        user = request.user
        if hasattr(user, 'perfil_cliente'):
            vehiculos = Vehiculo.objects.filter(cliente=user.perfil_cliente)
        else:
            vehiculos = Vehiculo.objects.all()
        
        serializer = VehiculoSerializer(vehiculos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VehiculoSerializer(data=request.data)
        if serializer.is_valid():
            
            if hasattr(request.user, 'perfil_cliente'):
                serializer.save(cliente=request.user.perfil_cliente)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VehiculoDetail(APIView):
    permission_classes = [IsAuthenticated, EsDueñoVehiculo]

    def get_object(self, pk):
        
        obj = get_object_or_404(Vehiculo, pk=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk):
        vehiculo = self.get_object(pk)
        serializer = VehiculoSerializer(vehiculo)
        return Response(serializer.data)

    def put(self, request, pk):
        vehiculo = self.get_object(pk)
        serializer = VehiculoSerializer(vehiculo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        vehiculo = self.get_object(pk)
        vehiculo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class CitaList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        citas = Cita.objects.all()

        if hasattr(user, 'perfil_cliente'):
            citas = citas.filter(vehiculo__cliente=user.perfil_cliente)
        
        elif hasattr(user, 'perfil_mecanico'):
            citas = citas.filter(
                Q(mecanico_asignado=user.perfil_mecanico) | 
                Q(mecanico_asignado__isnull=True)
            )
        

        estados = request.query_params.getlist('estado')
        if estados:
            citas = citas.filter(estado__in=estados)
            
        citas = citas.order_by('fecha_hora')

        serializer = CitaSerializer(citas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CitaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = CitaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CitaDetail(APIView):
    permission_classes = [IsAuthenticated, EsMecanicoAsignado]

    def get_object(self, pk):
        obj = get_object_or_404(Cita, pk=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk):
        cita = self.get_object(pk)
        serializer = CitaSerializer(cita)
        return Response(serializer.data)

    def put(self, request, pk):
        cita = self.get_object(pk)
        serializer = CitaSerializer(cita, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class FinalizarCitaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)
        
        
        if hasattr(request.user, 'perfil_mecanico') and cita.mecanico_asignado != request.user.perfil_mecanico:
            return Response({"error": "No tienes permiso para finalizar esta cita."}, status=status.HTTP_403_FORBIDDEN)

        detalle = request.data.get('detalle_trabajo')
        costo = request.data.get('costo_final')

        if not detalle or not costo:
            return Response({"error": "Faltan datos: detalle_trabajo y costo_final son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            cita.estado = 'Completada'
            cita.save()

            Historial.objects.create(
                cita=cita,
                detalle_trabajo=detalle,
                costo_final=costo,
                mecanico=cita.mecanico_asignado
            )
        
        return Response({"mensaje": "Cita finalizada y guardada en historial."}, status=status.HTTP_200_OK)




class HistorialList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        historiales = Historial.objects.all()

        
        if hasattr(user, 'perfil_cliente'):
            historiales = historiales.filter(cita__vehiculo__cliente=user.perfil_cliente)
        elif hasattr(user, 'perfil_mecanico'):
            historiales = historiales.filter(mecanico=user.perfil_mecanico)

        
        search_query = request.query_params.get('search')
        if search_query:
            historiales = historiales.filter(
                Q(cita__vehiculo__patente__icontains=search_query) |
                Q(cita__vehiculo__cliente__usuario__first_name__icontains=search_query) |
                Q(cita__vehiculo__cliente__usuario__last_name__icontains=search_query) |
                Q(mecanico__usuario__first_name__icontains=search_query)
            )

        serializer = HistorialSerializer(historiales, many=True)
        return Response(serializer.data)

class MecanicoList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mecanicos = Mecanico.objects.filter(aprobado=True)
        serializer = MecanicoSerializer(mecanicos, many=True)
        return Response(serializer.data)
    


class AdminMarcaList(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        marcas = Marca.objects.all()
        serializer = MarcaSerializer(marcas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MarcaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminMecanicosPendientes(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        mecanicos = Mecanico.objects.filter(aprobado=False)
        serializer = MecanicoSerializer(mecanicos, many=True)
        return Response(serializer.data)

class AprobarMecanicoView(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        mecanico = get_object_or_404(Mecanico, pk=pk)
        mecanico.aprobado = True
        mecanico.save()
        return Response({"mensaje": f"Mecánico {mecanico.usuario.username} aprobado exitosamente."})

class AceptarCitaView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)


        if not hasattr(request.user, 'perfil_mecanico'):
             return Response({"error": "Solo mecánicos pueden realizar esta acción"}, status=403)


        if cita.mecanico_asignado and cita.mecanico_asignado != request.user.perfil_mecanico:
             return Response({"error": "Esta cita ya pertenece a otro mecánico."}, status=403)

        with transaction.atomic():

            if not cita.mecanico_asignado:
                cita.mecanico_asignado = request.user.perfil_mecanico
            

            cita.estado = 'En Progreso'
            cita.save()

        return Response({"mensaje": "Cita aceptada. ¡A trabajar!"})

class MiPerfilMecanicoView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'perfil_mecanico'):
            return Response({"error": "No eres mecánico"}, status=403)
        
        mecanico = request.user.perfil_mecanico
        serializer = MecanicoSerializer(mecanico)
        return Response(serializer.data)

    def patch(self, request):

        if not hasattr(request.user, 'perfil_mecanico'):
            return Response({"error": "No eres mecánico"}, status=403)
        
        mecanico = request.user.perfil_mecanico
        
        # El serializer espera una lista de IDs en 'marcas', ej: [1, 2]
        serializer = MecanicoSerializer(mecanico, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class MarcaListPublicView(APIView):

    permission_classes = [IsAuthenticated] # <--- Solo requiere estar logueado

    def get(self, request):
        marcas = Marca.objects.all()
        serializer = MarcaSerializer(marcas, many=True)
        return Response(serializer.data)