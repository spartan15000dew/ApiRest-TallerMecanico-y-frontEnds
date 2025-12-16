import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function AgendarCitaPage() {
    const navigate = useNavigate();
    const [vehiculos, setVehiculos] = useState([]);
    const [formData, setFormData] = useState({
        vehiculo: '',
        fecha_hora: '',
        motivo: ''
    });

    // 1. Cargar los vehículos del cliente al entrar
    useEffect(() => {
        const cargarVehiculos = async () => {
            try {
                const res = await api.get('api/vehiculos/');
                setVehiculos(res.data);
                // Si tiene vehículos, seleccionar el primero por defecto
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, vehiculo: res.data[0].id }));
                }
            } catch (error) {
                console.error("Error cargando vehículos", error);
            }
        };
        cargarVehiculos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.vehiculo) {
            alert("Debes registrar un vehículo primero.");
            return;
        }

        try {
            await api.post('api/citas/', formData);
            alert("¡Cita agendada con éxito!");
            navigate('/mis-citas'); // Lo mandamos a ver su lista
        } catch (error) {
            console.error(error);
            alert("Error al agendar. Verifica los datos.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Agendar Nueva Cita</h2>
                
                {vehiculos.length === 0 ? (
                    <div className="alert alert-warning text-center">
                        No tienes vehículos registrados. <br/>
                        <button className="btn btn-sm btn-dark mt-2" onClick={() => navigate('/vehiculos')}>
                            Registrar Vehículo
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Selecciona tu Vehículo</label>
                            <select 
                                className="form-select"
                                value={formData.vehiculo}
                                onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
                                required
                            >
                                {vehiculos.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.marca} {v.modelo} ({v.patente})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha y Hora</label>
                            <input 
                                type="datetime-local"
                                className="form-control"
                                value={formData.fecha_hora}
                                onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Motivo (Describe el problema)</label>
                            <textarea 
                                className="form-control"
                                rows="3"
                                placeholder="Ej: Ruido al frenar, cambio de aceite..."
                                value={formData.motivo}
                                onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                                required
                            ></textarea>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Confirmar Cita</button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AgendarCitaPage;