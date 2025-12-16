import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function MisCitasPage() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const cargarCitas = async () => {
            try {
                // El backend ya filtra automáticamente por el usuario del token
                const res = await api.get('api/citas/');
                setCitas(res.data);
            } catch (error) {
                console.error("Error cargando citas", error);
            }
        };
        cargarCitas();
    }, []);

    const getBadgeColor = (estado) => {
        switch(estado) {
            case 'Pendiente': return 'bg-warning text-dark';
            case 'En Progreso': return 'bg-info text-dark';
            case 'Completada': return 'bg-success';
            case 'Rechazada': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Mis Citas Agendadas</h2>
            
            {citas.length === 0 ? (
                <div className="alert alert-info">No tienes citas registradas.</div>
            ) : (
                <div className="row">
                    {citas.map(cita => (
                        <div key={cita.id} className="col-md-6 mb-3">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 text-primary">
                                        {new Date(cita.fecha_hora).toLocaleDateString()} 
                                        <small className="text-muted ms-2">
                                            {new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </small>
                                    </h5>
                                    <span className={`badge ${getBadgeColor(cita.estado)}`}>
                                        {cita.estado}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">{cita.vehiculo_detalle}</h6>
                                    <p className="card-text"><strong>Motivo:</strong> {cita.motivo}</p>
                                    
                                    <p className="card-text text-muted">
                                        <small>Mecánico: {cita.mecanico_nombre || 'Pendiente de asignación'}</small>
                                    </p>

                                    {/* Si hay historial (trabajo terminado), mostrar detalles extra */}
                                    {cita.estado === 'Completada' && (
                                        <div className="alert alert-success mt-2 p-2">
                                            <small><strong>¡Trabajo Finalizado!</strong> Revisa el historial para ver detalles.</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MisCitasPage;