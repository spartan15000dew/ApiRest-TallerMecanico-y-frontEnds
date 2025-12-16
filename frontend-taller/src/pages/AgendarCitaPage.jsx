import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar'; // <--- IMPORTANTE

function AgendarCitaPage() {
    const navigate = useNavigate();
    const [vehiculos, setVehiculos] = useState([]);
    const [formData, setFormData] = useState({ vehiculo: '', fecha_hora: '', motivo: '' });

    useEffect(() => {
        const cargarVehiculos = async () => {
            try {
                const res = await api.get('api/vehiculos/');
                setVehiculos(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, vehiculo: res.data[0].id }));
                }
            } catch (error) { console.error("Error", error); }
        };
        cargarVehiculos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.vehiculo) { alert("Debes registrar un vehículo primero."); return; }
        try {
            await api.post('api/citas/', formData);
            alert("¡Cita agendada con éxito!");
            navigate('/mis-citas');
        } catch (error) { alert("Error al agendar."); }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex justify-content-center">
                <div className="card shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
                    <div className="card-header bg-success text-white text-center py-3">
                        <h3 className="mb-0 fw-bold">📅 Agendar Nueva Cita</h3>
                    </div>
                    <div className="card-body p-4">
                        {vehiculos.length === 0 ? (
                            <div className="alert alert-warning text-center">
                                <h5>⚠️ No tienes vehículos registrados</h5>
                                <p>Para pedir una cita, primero debes agregar un auto.</p>
                                <button className="btn btn-dark mt-2" onClick={() => navigate('/vehiculos')}>
                                    Registrar Vehículo Ahora
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Selecciona tu Vehículo</label>
                                    <select 
                                        className="form-select form-select-lg"
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
                                    <label className="form-label fw-bold">Fecha y Hora Preferida</label>
                                    <input 
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.fecha_hora}
                                        onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Motivo de la visita</label>
                                    <textarea 
                                        className="form-control"
                                        rows="4"
                                        placeholder="Describe los síntomas (ej: Ruido al frenar, cambio de aceite...)"
                                        value={formData.motivo}
                                        onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                                        required
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success btn-lg fw-bold">Confirmar Cita</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>Cancelar</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AgendarCitaPage;