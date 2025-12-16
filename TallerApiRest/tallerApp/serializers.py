from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User
from .models import Marca, Cliente, Mecanico, Vehiculo, Cita, Servicio, Historial


class UsuarioInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    usuario_detalle = UsuarioInfoSerializer(source='usuario', read_only=True)

    class Meta:
        model = Cliente
        fields = ['id', 'usuario', 'usuario_detalle', 'telefono', 'direccion']


class MecanicoSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    marcas = serializers.PrimaryKeyRelatedField(many=True, queryset=Marca.objects.all())

    usuario_detalle = UsuarioInfoSerializer(source='usuario', read_only=True)
    marcas_detalle = MarcaSerializer(source='marcas', many=True, read_only=True)

    class Meta:
        model = Mecanico
        fields = ['id', 'usuario', 'usuario_detalle', 'telefono', 'marcas', 'marcas_detalle', 'aprobado']

class VehiculoSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(read_only=True) 
    cliente_nombre = serializers.StringRelatedField(source='cliente', read_only=True)

    class Meta:
        model = Vehiculo
        fields = ['id', 'patente', 'marca', 'modelo', 'año', 'cliente', 'cliente_nombre']


class CitaSerializer(serializers.ModelSerializer):
    vehiculo_detalle = serializers.StringRelatedField(source='vehiculo', read_only=True)
    mecanico_nombre = serializers.StringRelatedField(source='mecanico_asignado', read_only=True)
    tiene_historial = serializers.BooleanField(source='historial_detalle', read_only=True, default=False)

    class Meta:
        model = Cita
        fields = [
            'id', 'fecha_hora', 'motivo', 'estado', 
            'vehiculo', 'vehiculo_detalle', 
            'mecanico_asignado', 'mecanico_nombre',
            'tiene_historial'
        ]


class ServicioSerializer(serializers.ModelSerializer):
    cita = serializers.PrimaryKeyRelatedField(queryset=Cita.objects.all())
    mecanico = serializers.PrimaryKeyRelatedField(
        queryset=Mecanico.objects.all(), 
        allow_null=True, 
        required=False
    )

    class Meta:
        model = Servicio
        fields = '__all__'



class HistorialSerializer(serializers.ModelSerializer):

    vehiculo_patente = serializers.CharField(source='cita.vehiculo.patente', read_only=True)
    cliente_nombre = serializers.CharField(source='cita.vehiculo.cliente.usuario.get_full_name', read_only=True)
    mecanico_nombre = serializers.StringRelatedField(source='mecanico', read_only=True)

    class Meta:
        model = Historial
        fields = [
            'id', 
            'cita', 
            'detalle_trabajo', 
            'costo_final', 
            'fecha_realizacion', 
            'mecanico', 
            'mecanico_nombre', 
            'vehiculo_patente', 
            'cliente_nombre'
        ]
        read_only_fields = ['fecha_realizacion', 'mecanico'] 


class RegistroUnificadoSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    tipo_usuario = serializers.ChoiceField(choices=['cliente', 'mecanico'], required=True)

    telefono = serializers.CharField(required=False)
    direccion = serializers.CharField(max_length=100, required=False, allow_blank=True)  
    marcas = serializers.PrimaryKeyRelatedField(
        queryset=Marca.objects.all(), many=True, required=False
    ) 

    def validate(self, data):
        tipo = data.get('tipo_usuario')
        
        if User.objects.filter(username=data.get('username')).exists():
            raise serializers.ValidationError({"username": "Este nombre de usuario ya existe."})
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": "Este correo ya está registrado."})

        if tipo == 'cliente':
            if not data.get('direccion'):
                raise serializers.ValidationError({"direccion": "La dirección es obligatoria para clientes."})
            if not data.get('telefono'):
                raise serializers.ValidationError({"telefono": "El teléfono es obligatorio."})
        
        elif tipo == 'mecanico':
            if not data.get('telefono'):
                raise serializers.ValidationError({"telefono": "El teléfono es obligatorio."})
            
        return data

    def create(self, validated_data):
        tipo = validated_data.pop('tipo_usuario')
        password = validated_data.pop('password')
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        
        telefono = validated_data.get('telefono')
        direccion = validated_data.get('direccion')
        marcas = validated_data.get('marcas', [])

        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            if tipo == 'cliente':
                Cliente.objects.create(
                    usuario=user,
                    telefono=telefono,
                    direccion=direccion
                )
            elif tipo == 'mecanico':
                mecanico = Mecanico.objects.create(
                    usuario=user,
                    telefono=telefono
                )
                if marcas:
                    mecanico.marcas.set(marcas)
            
            return user