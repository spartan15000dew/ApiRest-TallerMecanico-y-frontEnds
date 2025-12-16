import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function VehiculosPage() {
    const [vehiculos, setVehiculos] = useState([]);
    const [nuevoAuto, setNuevoAuto] = useState({ patente: '', marca: '', modelo: '', año: '' });

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const res = await api.get('vehiculos/');
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
            // LÓGICA MEJORADA DE ERRORES
            if (error.response && error.response.data) {
                // Si el backend nos dice qué está mal, mostramos eso
                const mensajes = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
                alert(`Error:\n${mensajes}`);
            } else {
                alert('Error al conectar con el servidor.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Registrar Vehículo</h4>
                        <form onSubmit={handleCrear}>
                            <input className="form-control mb-2" placeholder="Patente" value={nuevoAuto.patente} onChange={e=>setNuevoAuto({...nuevoAuto, patente: e.target.value})} required/>
                            <input className="form-control mb-2" placeholder="Marca" value={nuevoAuto.marca} onChange={e=>setNuevoAuto({...nuevoAuto, marca: e.target.value})} required/>
                            <input className="form-control mb-2" placeholder="Modelo" value={nuevoAuto.modelo} onChange={e=>setNuevoAuto({...nuevoAuto, modelo: e.target.value})} required/>
                            <input type="number" className="form-control mb-2" placeholder="Año" value={nuevoAuto.año} onChange={e=>setNuevoAuto({...nuevoAuto, año: e.target.value})} required/>
                            <button className="btn btn-success w-100">Guardar</button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <h4>Mis Vehículos</h4>
                    <div className="row">
                        {vehiculos.map(v => (
                            <div key={v.id} className="col-md-6 mb-2">
                                <div className="card p-3 border-primary">
                                    <h5>{v.marca} {v.modelo}</h5>
                                    <p className="mb-0 text-muted">Patente: {v.patente} - Año: {v.año}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehiculosPage;