import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar'; // <--- IMPORTANTE

function VehiculosPage() {
    const [vehiculos, setVehiculos] = useState([]);
    const [nuevoAuto, setNuevoAuto] = useState({ patente: '', marca: '', modelo: '', año: '' });

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const res = await api.get('api/vehiculos/'); // Corregido a api/
            setVehiculos(res.data);
        } catch (error) { console.error(error); }
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            await api.post('api/vehiculos/', nuevoAuto);
            alert('Vehículo registrado exitosamente');
            setNuevoAuto({ patente: '', marca: '', modelo: '', año: '' });
            cargarVehiculos();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const mensajes = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`).join('\n');
                alert(`Error:\n${mensajes}`);
            } else {
                alert('Error al conectar con el servidor.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4 border-bottom pb-2 fw-bold">🚘 Gestión de Vehículos</h2>
                
                <div className="row">
                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow border-0">
                            <div className="card-header bg-primary text-white fw-bold">
                                + Nuevo Vehículo
                            </div>
                            <div className="card-body bg-light">
                                <form onSubmit={handleCrear}>
                                    <div className="mb-2">
                                        <input className="form-control" placeholder="Patente (Ej: ABCD-12)" value={nuevoAuto.patente} onChange={e=>setNuevoAuto({...nuevoAuto, patente: e.target.value})} required/>
                                    </div>
                                    <div className="mb-2">
                                        <input className="form-control" placeholder="Marca (Ej: Toyota)" value={nuevoAuto.marca} onChange={e=>setNuevoAuto({...nuevoAuto, marca: e.target.value})} required/>
                                    </div>
                                    <div className="mb-2">
                                        <input className="form-control" placeholder="Modelo (Ej: Yaris)" value={nuevoAuto.modelo} onChange={e=>setNuevoAuto({...nuevoAuto, modelo: e.target.value})} required/>
                                    </div>
                                    <div className="mb-3">
                                        <input type="number" className="form-control" placeholder="Año (Ej: 2020)" value={nuevoAuto.año} onChange={e=>setNuevoAuto({...nuevoAuto, año: e.target.value})} required/>
                                    </div>
                                    <button className="btn btn-primary w-100 fw-bold">Guardar Vehículo</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: LISTA */}
                    <div className="col-md-8">
                        <div className="row">
                            {vehiculos.length === 0 ? (
                                <div className="col-12 text-center text-muted mt-5">
                                    <h4>No tienes vehículos registrados aún.</h4>
                                    <p>Usa el formulario de la izquierda para agregar uno.</p>
                                </div>
                            ) : vehiculos.map(v => (
                                <div key={v.id} className="col-md-6 mb-3">
                                    <div className="card h-100 shadow-sm border-start border-5 border-primary">
                                        <div className="card-body">
                                            <h4 className="card-title fw-bold text-dark">{v.marca} {v.modelo}</h4>
                                            <hr />
                                            <p className="mb-1 text-muted">Patente: <strong className="text-dark bg-warning px-2 rounded">{v.patente}</strong></p>
                                            <p className="mb-0 text-muted">Año: {v.año}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VehiculosPage;