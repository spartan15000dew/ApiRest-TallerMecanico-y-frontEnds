import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

function TodasLasCitasPage() {
    const [citas, setCitas] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');

    useEffect(() => { cargarCitas(); }, [filtroEstado]);

    const cargarCitas = async () => {
        try {
            let url = 'api/citas/';
            if (filtroEstado) url += `?estado=${filtroEstado}`;
            const res = await api.get(url);
            setCitas(res.data);
        } catch (error) { console.error(error); }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h2 className="fw-bold">📊 Reporte Global de Citas</h2>
                    
                    <select className="form-select w-auto shadow-sm" onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="">Todos los Estados</option>
                        <option value="Pendiente">🟡 Pendientes</option>
                        <option value="En Progreso">🔵 En Progreso</option>
                        <option value="Completada">🟢 Completadas</option>
                    </select>
                </div>

                <div className="card shadow border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th className="py-3 ps-3">ID</th>
                                        <th>Fecha</th>
                                        <th>Vehículo</th>
                                        <th>Motivo</th>
                                        <th>Mecánico</th>
                                        <th className="pe-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citas.map(cita => (
                                        <tr key={cita.id}>
                                            <td className="ps-3 fw-bold">#{cita.id}</td>
                                            <td>
                                                {new Date(cita.fecha_hora).toLocaleDateString()} <br/>
                                                <small className="text-muted">{new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                            </td>
                                            <td>{cita.vehiculo_detalle}</td>
                                            <td style={{maxWidth: '200px'}} className="text-truncate" title={cita.motivo}>{cita.motivo}</td>
                                            <td>{cita.mecanico_nombre || <span className="badge bg-secondary">Sin Asignar</span>}</td>
                                            <td className="pe-3">
                                                <span className={`badge rounded-pill ${
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
                </div>
            </div>
        </>
    );
}

export default TodasLasCitasPage;