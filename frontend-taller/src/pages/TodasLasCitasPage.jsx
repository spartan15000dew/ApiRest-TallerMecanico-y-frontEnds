import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function TodasLasCitasPage() {
    const [citas, setCitas] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');

    useEffect(() => {
        cargarCitas();
    }, [filtroEstado]); // Recargar si cambia el filtro

    const cargarCitas = async () => {
        try {
            let url = 'api/citas/';
            if (filtroEstado) {
                url += `?estado=${filtroEstado}`;
            }
            const res = await api.get(url);
            setCitas(res.data);
        } catch (error) {
            console.error("Error cargando todas las citas", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión General de Citas</h2>
                
                {/* Filtro rápido */}
                <select 
                    className="form-select w-auto" 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos los Estados</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completada">Completadas</option>
                </select>
            </div>

            <div className="table-responsive shadow-sm">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Vehículo</th>
                            <th>Motivo</th>
                            <th>Mecánico</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map(cita => (
                            <tr key={cita.id}>
                                <td>#{cita.id}</td>
                                <td>
                                    {new Date(cita.fecha_hora).toLocaleDateString()} <br/>
                                    <small className="text-muted">{new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                </td>
                                <td>{cita.vehiculo_detalle}</td>
                                <td>{cita.motivo}</td>
                                <td>{cita.mecanico_nombre || <span className="text-danger">Sin Asignar</span>}</td>
                                <td>
                                    <span className={`badge ${
                                        cita.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                        cita.estado === 'Completada' ? 'bg-success' : 
                                        'bg-primary'
                                    }`}>
                                        {cita.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TodasLasCitasPage;