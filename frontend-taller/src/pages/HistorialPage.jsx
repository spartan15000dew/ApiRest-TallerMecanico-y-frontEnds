import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

function HistorialPage() {
    const [historial, setHistorial] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    const buscarHistorial = async (query = '') => {
        try {
            // CORRECCIÓN: Agregamos 'api/' al principio
            const endpoint = query 
                ? `api/historial/?search=${query}` 
                : 'api/historial/';
            
            const res = await api.get(endpoint);
            setHistorial(res.data);
        } catch (error) {
            console.error("Error buscando historial", error);
        }
    };

    useEffect(() => {
        buscarHistorial();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        buscarHistorial(busqueda);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4 border-bottom pb-2 fw-bold">📜 Historial de Reparaciones</h2>
                
                {/* Barra de Búsqueda */}
                <div className="card shadow-sm border-0 mb-4 bg-white">
                    <div className="card-body">
                        <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                placeholder="🔍 Buscar por Patente, Cliente o Mecánico..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary px-4 fw-bold">Buscar</button>
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-4" 
                                onClick={() => { setBusqueda(''); buscarHistorial(''); }}
                            >
                                Limpiar
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tabla de Resultados */}
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th className="py-3 ps-3">Fecha</th>
                                        <th>Vehículo / Cliente</th>
                                        <th>Mecánico</th>
                                        <th>Detalle del Trabajo</th>
                                        <th className="pe-3 text-end">Costo Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.length > 0 ? (
                                        historial.map(item => (
                                            <tr key={item.id}>
                                                <td className="ps-3">{item.fecha_realizacion}</td>
                                                <td>
                                                    <strong className="text-primary">{item.vehiculo_patente}</strong><br/>
                                                    <small className="text-muted">{item.cliente_nombre}</small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {item.mecanico_nombre || 'No asignado'}
                                                    </span>
                                                </td>
                                                <td>{item.detalle_trabajo}</td>
                                                <td className="text-success fw-bold fs-5 text-end pe-3">
                                                    ${item.costo_final}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                <h4>No se encontraron registros.</h4>
                                                <p className="small">Recuerda: Aquí solo aparecen los trabajos <strong>FINALIZADOS</strong>.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HistorialPage;