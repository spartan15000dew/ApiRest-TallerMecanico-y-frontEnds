import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar'; // <--- IMPORTANTE

function AdminPanel() {
    const [mecanicosPendientes, setMecanicosPendientes] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [nuevaMarca, setNuevaMarca] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const resMec = await api.get('api/admin/mecanicos-pendientes/');
            setMecanicosPendientes(resMec.data);

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
            await api.post(`api/admin/aprobar-mecanico/${id}/`);
            alert('Mecánico aprobado');
            cargarDatos();
        } catch (error) {
            alert('Error al aprobar mecánico');
        }
    };

    const handleCrearMarca = async (e) => {
        e.preventDefault();
        try {
            await api.post('api/admin/marcas/', { nombre: nuevaMarca });
            alert('Marca creada correctamente');
            setNuevaMarca('');
            cargarDatos();
        } catch (error) {
            alert('Error al crear marca (quizás ya existe)');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-danger mb-4 fw-bold border-bottom pb-2">
                    <span style={{marginRight: '10px'}}>🛡️</span> Panel de Administración
                </h2>

                <div className="row">
                    {/* --- SECCIÓN 1: APROBAR MECÁNICOS --- */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow border-0 h-100">
                            <div className="card-header bg-dark text-white fw-bold">
                                👨‍🔧 Mecánicos Pendientes
                            </div>
                            <div className="card-body">
                                {mecanicosPendientes.length === 0 ? (
                                    <div className="alert alert-success text-center">
                                        ¡Todo al día! No hay solicitudes pendientes.
                                    </div>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {mecanicosPendientes.map(mec => (
                                            <li key={mec.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong className="text-primary">{mec.usuario_detalle.first_name} {mec.usuario_detalle.last_name}</strong>
                                                    <br />
                                                    <small className="text-muted">{mec.usuario_detalle.email}</small>
                                                    <br />
                                                    <small>📞 {mec.telefono}</small>
                                                </div>
                                                <button 
                                                    className="btn btn-success btn-sm fw-bold"
                                                    onClick={() => handleAprobar(mec.id, mec.usuario_detalle.username)}
                                                >
                                                    ✓ Aprobar
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
                        <div className="card shadow border-0 h-100">
                            <div className="card-header bg-primary text-white fw-bold">
                                🚗 Gestión de Marcas
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
                                    <button type="submit" className="btn btn-primary fw-bold">Añadir</button>
                                </form>

                                <hr />
                                {/* Lista de Marcas */}
                                <h6 className="text-muted mb-3">Marcas Registradas ({marcas.length}):</h6>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-2 bg-light">
                                    <div className="d-flex flex-wrap gap-2">
                                        {marcas.map(m => (
                                            <span key={m.id} className="badge bg-secondary p-2">
                                                {m.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPanel;