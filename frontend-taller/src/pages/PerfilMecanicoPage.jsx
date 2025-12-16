import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PerfilMecanicoPage() {
    const navigate = useNavigate();
    const [todasLasMarcas, setTodasLasMarcas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const resMarcas = await api.get('api/marcas/'); 
            setTodasLasMarcas(resMarcas.data);
            const resPerfil = await api.get('api/mecanicos/perfil/');
            setMarcasSeleccionadas(resPerfil.data.marcas);
        } catch (error) { console.error("Error", error); } finally { setLoading(false); }
    };

    const handleCheckboxChange = (id) => {
        setMarcasSeleccionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleGuardar = async () => {
        try {
            await api.patch('api/mecanicos/perfil/', { marcas: marcasSeleccionadas });
            alert("✅ Perfil actualizado correctamente.");
            navigate('/dashboard');
        } catch (error) { alert("Error al actualizar perfil."); }
    };

    if (loading) return <><Navbar /><div className="text-center mt-5">Cargando...</div></>;

    return (
        <>
            <Navbar />
            <div className="container mt-5" style={{maxWidth: '800px'}}>
                <div className="card shadow-lg border-0">
                    <div className="card-header bg-dark text-white py-3">
                        <h3 className="mb-0 text-center">🛠️ Mis Especialidades</h3>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-muted text-center mb-4">
                            Marca las casillas de las marcas de vehículos en las que te especializas.
                            <br/><small>Esto nos ayuda a asignarte los trabajos adecuados.</small>
                        </p>

                        <div className="row g-3">
                            {todasLasMarcas.map(marca => (
                                <div key={marca.id} className="col-md-6">
                                    <div 
                                        className={`p-3 border rounded d-flex align-items-center cursor-pointer ${marcasSeleccionadas.includes(marca.id) ? 'bg-info bg-opacity-10 border-info' : 'bg-light'}`}
                                        onClick={() => handleCheckboxChange(marca.id)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <input 
                                            className="form-check-input me-3" 
                                            type="checkbox" 
                                            checked={marcasSeleccionadas.includes(marca.id)}
                                            onChange={() => {}} // Controlado por el div
                                            style={{transform: 'scale(1.3)'}}
                                        />
                                        <span className="fw-bold fs-5">{marca.nombre}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 d-flex gap-3">
                            <button className="btn btn-primary btn-lg w-50 fw-bold" onClick={handleGuardar}>
                                Guardar Cambios
                            </button>
                            <button className="btn btn-outline-secondary btn-lg w-50" onClick={() => navigate('/dashboard')}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerfilMecanicoPage;