from rest_framework import permissions

class EsDueñoVehiculo(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if hasattr(request.user, 'perfil_cliente'):
            return obj.cliente == request.user.perfil_cliente
        return False

class EsMecanicoAsignado(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff: return True
        
        es_cliente = hasattr(request.user, 'perfil_cliente') and obj.vehiculo.cliente == request.user.perfil_cliente
        es_mecanico = hasattr(request.user, 'perfil_mecanico') and obj.mecanico_asignado == request.user.perfil_mecanico
        
        return es_cliente or es_mecanico