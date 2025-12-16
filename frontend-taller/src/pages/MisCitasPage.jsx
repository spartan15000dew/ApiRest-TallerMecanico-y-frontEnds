import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

function MisCitasPage() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const cargarCitas = async () => {
            try {
                const res = await api.get('api/citas/');
                setCitas(res.data);
            } catch (error) { console.error("Error", error); }
        };
        cargarCitas();
    }, []);

    const getBadgeColor = (estado) => {
        switch(estado) {
            case 'Pendiente': return 'bg-warning text-dark';
            case 'En Progreso': return 'bg-info text-dark';
            case 'Completada': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4 border-bottom pb-2 fw-bold">🗓️ Mis Citas Agendadas</h2>
                
                {citas.length === 0 ? (
                    <div className="alert alert-info text-center py-5">
                        <h4>No tienes citas registradas.</h4>
                        <p>¡Agenda una nueva cita para revisar tu auto!</p>
                    </div>
                ) : (
                    <div className="row">
                        {citas.map(cita => (
                            <div key={cita.id} className="col-md-6 mb-4">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h5 className="mb-0 text-primary fw-bold">
                                                {new Date(cita.fecha_hora).toLocaleDateString()}
                                            </h5>
                                            <small className="text-muted">
                                                {new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </small>
                                        </div>
                                        <span className={`badge rounded-pill px-3 py-2 ${getBadgeColor(cita.estado)}`}>
                                            {cita.estado}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-subtitle mb-3 text-muted fw-bold">{cita.vehiculo_detalle}</h6>
                                        <p className="card-text bg-light p-2 rounded">
                                            <strong>Motivo:</strong> {cita.motivo}
                                        </p>
                                        
                                        <div className="d-flex align-items-center mt-3">
                                            <span className="me-2">🔧 Mecánico:</span>
                                            <span className={cita.mecanico_nombre ? "fw-bold" : "text-danger fst-italic"}>
                                                {cita.mecanico_nombre || 'Pendiente de asignación'}
                                            </span>
                                        </div>

                                        {cita.estado === 'Completada' && (
                                            <div className="alert alert-success mt-3 mb-0 p-2 text-center">
                                                <small>✨ <strong>Trabajo Finalizado</strong> - Revisa el historial</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default MisCitasPage;