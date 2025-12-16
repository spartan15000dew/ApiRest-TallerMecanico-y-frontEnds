import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function PerfilMecanicoPage() {
    const navigate = useNavigate();
    const [todasLasMarcas, setTodasLasMarcas] = useState([]);
    const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]); // IDs de las marcas
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {

            const resMarcas = await api.get('api/marcas/'); 
            setTodasLasMarcas(resMarcas.data);


            const resPerfil = await api.get('api/mecanicos/perfil/');
           
            setMarcasSeleccionadas(resPerfil.data.marcas);
            
        } catch (error) {
            console.error("Error cargando perfil", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (idMarca) => {
        setMarcasSeleccionadas(prev => {
            if (prev.includes(idMarca)) {

                return prev.filter(id => id !== idMarca);
            } else {

                return [...prev, idMarca];
            }
        });
    };

    const handleGuardar = async () => {
        try {

            await api.patch('api/mecanicos/perfil/', { marcas: marcasSeleccionadas });
            alert("Especialidades actualizadas correctamente.");
            navigate('/dashboard');
        } catch (error) {
            alert("Error al actualizar perfil.");
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando datos...</div>;

    return (
        <div className="container mt-5" style={{maxWidth: '700px'}}>
            <div className="card shadow p-4">
                <h2 className="mb-4">Mis Especialidades</h2>
                <p className="text-muted">
                    Selecciona las marcas de camiones en las que te especializas. 
                    Esto ayudará a asignarte las citas correctas.
                </p>

                <div className="row">
                    {todasLasMarcas.map(marca => (
                        <div key={marca.id} className="col-md-6 mb-2">
                            <div className="form-check p-3 border rounded">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id={`marca-${marca.id}`}
                                    checked={marcasSeleccionadas.includes(marca.id)}
                                    onChange={() => handleCheckboxChange(marca.id)}
                                    style={{transform: 'scale(1.2)', marginRight: '10px'}}
                                />
                                <label className="form-check-label fw-bold" htmlFor={`marca-${marca.id}`}>
                                    {marca.nombre}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 d-grid gap-2">
                    <button className="btn btn-primary" onClick={handleGuardar}>
                        Guardar Cambios
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PerfilMecanicoPage;