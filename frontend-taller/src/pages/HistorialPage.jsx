import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function HistorialPage() {
    const [historial, setHistorial] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtros, setFiltros] = useState(''); // Para acumular query params

    const buscarHistorial = async (query = '') => {
        try {
            // Si hay texto en busqueda, usa el endpoint de search
            const endpoint = query 
                ? `historial/?search=${query}` 
                : 'historial/';
            
            const res = await api.get(endpoint);
            setHistorial(res.data);
        } catch (error) {
            console.error("Error buscando historial", error);
        }
    };

    // Cargar historial inicial
    useEffect(() => {
        buscarHistorial();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        buscarHistorial(busqueda);
    };

    return (
        <div className="container mt-4">
            <h2>Historial de Reparaciones</h2>
            
            {/* Barra de Búsqueda */}
            <div className="card p-3 mb-4 bg-light">
                <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Buscar por Patente, Cliente o Mecánico..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Buscar</button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => { setBusqueda(''); buscarHistorial(''); }}
                    >
                        Limpiar
                    </button>
                </form>
            </div>

            {/* Tabla de Resultados */}
            <div className="table-responsive">
                <table className="table table-striped table-hover border">
                    <thead className="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Vehículo / Cliente</th>
                            <th>Mecánico</th>
                            <th>Detalle del Trabajo</th>
                            <th>Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.length > 0 ? (
                            historial.map(item => (
                                <tr key={item.id}>
                                    <td>{item.fecha_realizacion}</td>
                                    <td>
                                        <strong>{item.vehiculo_patente}</strong><br/>
                                        <small>{item.cliente_nombre}</small>
                                    </td>
                                    <td>{item.mecanico_nombre || 'No asignado'}</td>
                                    <td>{item.detalle_trabajo}</td>
                                    <td className="text-success fw-bold">${item.costo_final}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No se encontraron registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistorialPage;