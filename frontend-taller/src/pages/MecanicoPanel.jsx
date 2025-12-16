import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function MecanicoPanel() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [datosCierre, setDatosCierre] = useState({ detalle_trabajo: '', costo_final: '' });

    useEffect(() => {
        cargarCitas();
    }, []);

    const cargarCitas = async () => {
        try {
            // Traemos Pendientes (para aceptar) y En Progreso (para finalizar)
            const res = await api.get('api/citas/?estado=Pendiente&estado=En Progreso'); 
            setCitas(res.data);
        } catch (error) {
            console.error("Error cargando citas", error);
        } finally {
            setLoading(false);
        }
    };

    // --- NUEVA FUNCIÓN: ACEPTAR CITA ---
    const handleAceptar = async (id) => {
        try {
            await api.post(`api/citas/${id}/aceptar/`);
            alert("Has aceptado el trabajo. El estado cambió a 'En Progreso'.");
            cargarCitas(); // Recargar para ver el cambio de botón
        } catch (error) {
            alert("Error al aceptar la cita.");
        }
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        try {
            await api.post(`api/citas/${citaSeleccionada}/finalizar/`, datosCierre);
            alert('Trabajo finalizado y guardado en historial.');
            setCitaSeleccionada(null);
            setDatosCierre({ detalle_trabajo: '', costo_final: '' });
            cargarCitas();
        } catch (error) {
            alert('Error al finalizar la cita');
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando trabajos...</div>;

    return (
        <div className="container mt-4">
            <h2>Panel de Trabajo - Mecánico</h2>
            <div className="row">
                {citas.length === 0 ? <p className="alert alert-info">No hay trabajos pendientes ni en curso.</p> : citas.map(cita => (
                    <div key={cita.id} className="col-md-6 mb-3">
                        <div className={`card shadow-sm border-${cita.estado === 'En Progreso' ? 'primary' : 'secondary'}`}>
                            <div className="card-header d-flex justify-content-between text-white" 
                                 style={{backgroundColor: cita.estado === 'En Progreso' ? '#0d6efd' : '#6c757d'}}>
                                <span>Cita #{cita.id}</span>
                                <span>{cita.estado}</span>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{cita.vehiculo_detalle}</h5>
                                <p className="card-text"><strong>Motivo:</strong> {cita.motivo}</p>
                                <p className="text-muted small">
                                    Fecha: {new Date(cita.fecha_hora).toLocaleString()} <br/>
                                    Asignado a: {cita.mecanico_nombre || <span className="text-danger fst-italic">Sin asignar (¡Tómalo!)</span>}
                                </p>

                                {/* --- LÓGICA DE BOTONES --- */}
                                
                                {/* 1. SI ESTÁ PENDIENTE -> BOTÓN ACEPTAR */}
                                {cita.estado === 'Pendiente' && (
                                    <button 
                                        className="btn btn-warning w-100"
                                        onClick={() => handleAceptar(cita.id)}
                                    >
                                        Aceptar Trabajo
                                    </button>
                                )}

                                {/* 2. SI ESTÁ EN PROGRESO -> BOTÓN FINALIZAR */}
                                {cita.estado === 'En Progreso' && (
                                    <>
                                        {citaSeleccionada !== cita.id ? (
                                            <button 
                                                className="btn btn-success w-100"
                                                onClick={() => setCitaSeleccionada(cita.id)}
                                            >
                                                Finalizar Trabajo
                                            </button>
                                        ) : (
                                            <form onSubmit={handleFinalizar} className="mt-3 border p-3 bg-light rounded">
                                                <h6>Cierre de Orden</h6>
                                                <div className="mb-2">
                                                    <textarea 
                                                        className="form-control" 
                                                        placeholder="Detalle del trabajo..."
                                                        required
                                                        value={datosCierre.detalle_trabajo}
                                                        onChange={e => setDatosCierre({...datosCierre, detalle_trabajo: e.target.value})}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        placeholder="Costo Final ($)"
                                                        required
                                                        value={datosCierre.costo_final}
                                                        onChange={e => setDatosCierre({...datosCierre, costo_final: e.target.value})}
                                                    />
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setCitaSeleccionada(null)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MecanicoPanel;