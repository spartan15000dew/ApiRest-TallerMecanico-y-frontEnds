import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function AdminPanel() {
    const [mecanicosPendientes, setMecanicosPendientes] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [nuevaMarca, setNuevaMarca] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // CORRECCIÓN: URL coincide con path('api/admin/mecanicos-pendientes/')
            const resMec = await api.get('api/admin/mecanicos-pendientes/');
            setMecanicosPendientes(resMec.data);

            // CORRECCIÓN: URL coincide con path('api/admin/marcas/')
            const resMarcas = await api.get('api/admin/marcas/');
            setMarcas(resMarcas.data);
        } catch (error) {
            console.error("Error cargando datos de admin", error);
            alert("Error: Asegúrate de ser usuario Administrador (Staff)");
        }
    };

    const handleAprobar = async (id, nombre) => {
        if (!window.confirm(`¿Seguro deseas aprobar al mecánico ${nombre}?`)) return;

        try {
            // CORRECCIÓN IMPORTANTE: Agregamos 'api/' al inicio aquí también
            await api.post(`api/admin/aprobar-mecanico/${id}/`);
            alert('Mecánico aprobado');
            cargarDatos(); // Recargar la lista
        } catch (error) {
            alert('Error al aprobar mecánico');
        }
    };

    const handleCrearMarca = async (e) => {
        e.preventDefault();
        try {
            // CORRECCIÓN IMPORTANTE: Agregamos 'api/' al inicio aquí también
            await api.post('api/admin/marcas/', { nombre: nuevaMarca });
            alert('Marca creada correctamente');
            setNuevaMarca('');
            cargarDatos();
        } catch (error) {
            alert('Error al crear marca (quizás ya existe)');
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-danger mb-4">Panel de Administración</h1>

            <div className="row">
                {/* --- SECCIÓN 1: APROBAR MECÁNICOS --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-dark text-white">
                            Mecánicos Pendientes de Aprobación
                        </div>
                        <div className="card-body">
                            {mecanicosPendientes.length === 0 ? (
                                <p className="text-muted">No hay solicitudes pendientes.</p>
                            ) : (
                                <ul className="list-group">
                                    {mecanicosPendientes.map(mec => (
                                        <li key={mec.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{mec.usuario_detalle.first_name} {mec.usuario_detalle.last_name}</strong>
                                                <br />
                                                <small className="text-muted">{mec.usuario_detalle.email}</small>
                                                <br />
                                                <small>Tel: {mec.telefono}</small>
                                            </div>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAprobar(mec.id, mec.usuario_detalle.username)}
                                            >
                                                Aprobar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN 2: GESTIONAR MARCAS --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-primary text-white">
                            Gestión de Marcas
                        </div>
                        <div className="card-body">
                            {/* Formulario Nueva Marca */}
                            <form onSubmit={handleCrearMarca} className="mb-4 d-flex gap-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Nueva Marca (ej: Ford)"
                                    value={nuevaMarca}
                                    onChange={(e) => setNuevaMarca(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Añadir</button>
                            </form>

                            {/* Lista de Marcas */}
                            <h6>Marcas Registradas:</h6>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <ul className="list-group list-group-flush">
                                    {marcas.map(m => (
                                        <li key={m.id} className="list-group-item">
                                            {m.nombre}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;