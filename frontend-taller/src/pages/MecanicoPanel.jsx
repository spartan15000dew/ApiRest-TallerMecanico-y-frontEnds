import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function MecanicoPanel() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para el formulario de finalización
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [datosCierre, setDatosCierre] = useState({ detalle_trabajo: '', costo_final: '' });

    useEffect(() => {
        cargarCitas();
    }, []);

    const cargarCitas = async () => {
        try {
            // La API ya filtra por el mecánico logueado gracias al Token
            const res = await api.get('citas/?estado=Pendiente&estado=En Progreso'); 
            // Nota: Puedes ajustar el filtro de estado según tu lógica
            setCitas(res.data);
        } catch (error) {
            console.error("Error cargando citas", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        try {
            await api.post(`citas/${citaSeleccionada}/finalizar/`, datosCierre);
            alert('Trabajo finalizado y guardado en historial.');
            setCitaSeleccionada(null); // Cerrar formulario
            setDatosCierre({ detalle_trabajo: '', costo_final: '' });
            cargarCitas(); // Recargar lista
        } catch (error) {
            alert('Error al finalizar la cita');
        }
    };

    if (loading) return <div>Cargando trabajos asignados...</div>;

    return (
        <div className="container mt-4">
            <h2>Panel de Trabajo - Mecánico</h2>
            <div className="row">
                {citas.length === 0 ? <p>No tienes citas pendientes.</p> : citas.map(cita => (
                    <div key={cita.id} className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white d-flex justify-content-between">
                                <span>Cita #{cita.id}</span>
                                <span className="badge bg-warning text-dark">{cita.estado}</span>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{cita.vehiculo_detalle}</h5>
                                <p className="card-text"><strong>Motivo:</strong> {cita.motivo}</p>
                                <p className="text-muted">Fecha: {new Date(cita.fecha_hora).toLocaleString()}</p>

                                {/* Botón para abrir formulario de cierre */}
                                {citaSeleccionada !== cita.id ? (
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setCitaSeleccionada(cita.id)}
                                    >
                                        Finalizar Trabajo
                                    </button>
                                ) : (
                                    /* Formulario incrustado para cerrar la orden */
                                    <form onSubmit={handleFinalizar} className="mt-3 border p-3 bg-light rounded">
                                        <h6>Reporte de Trabajo Realizado</h6>
                                        <div className="mb-2">
                                            <textarea 
                                                className="form-control" 
                                                placeholder="Describa el trabajo técnico realizado..."
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
                                            <button type="submit" className="btn btn-success btn-sm">Guardar y Cerrar</button>
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MecanicoPanel;