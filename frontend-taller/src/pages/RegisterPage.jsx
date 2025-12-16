// src/pages/RegisterPage.jsx
import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    
    // Estado inicial
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        tipo_usuario: 'cliente', 
        telefono: '',
        direccion: '', 
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // --- CORRECCIÓN AQUÍ: Agregamos 'auth/' ---
            const response = await api.post('api/auth/registro/', formData);
            
            alert(`¡Usuario ${response.data.usuario} creado con éxito! Ahora inicia sesión.`);
            navigate('/login'); 
        } catch (err) {
            console.error(err);
            
            if (err.response && err.response.data) {
                const serverErrors = err.response.data;

                if (serverErrors.email) {
                    setError(`El correo ${formData.email} ya está registrado.`);
                } 
                else if (serverErrors.username) {
                    setError(`El usuario ${formData.username} ya está ocupado.`);
                }
                else {
                    const primerError = Object.values(serverErrors).flat()[0];
                    setError(primerError || "Error en los datos ingresados.");
                }
            } else {
                setError('Error al conectar con el servidor.');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* --- SELECCIÓN DE TIPO --- */}
                <div className="mb-3">
                    <label className="form-label">¿Qué eres?</label>
                    <select 
                        className="form-select" 
                        name="tipo_usuario" 
                        value={formData.tipo_usuario} 
                        onChange={handleChange}
                    >
                        <option value="cliente">Soy Cliente</option>
                        <option value="mecanico">Soy Mecánico</option>
                    </select>
                </div>

                {/* --- DATOS COMUNES --- */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <input type="text" name="first_name" placeholder="Nombre" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="text" name="last_name" placeholder="Apellido" className="form-control" required onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <input type="email" name="email" placeholder="Correo Electrónico" className="form-control" required onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <input type="text" name="username" placeholder="Nombre de Usuario (Login)" className="form-control" required onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <input type="password" name="password" placeholder="Contraseña" className="form-control" required onChange={handleChange} />
                </div>

                <hr />
                <h5>Datos de Contacto</h5>

                {/* --- TELÉFONO --- */}
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input 
                        type="text" 
                        name="telefono" 
                        className="form-control" 
                        placeholder="+56912345678" 
                        required 
                        onChange={handleChange} 
                    />
                    <small className="text-muted">Formato: +569...</small>
                </div>

                {/* --- DIRECCIÓN (SOLO CLIENTES) --- */}
                {formData.tipo_usuario === 'cliente' && (
                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input 
                            type="text" 
                            name="direccion" 
                            className="form-control" 
                            placeholder="Calle 123, Ciudad" 
                            required 
                            onChange={handleChange} 
                        />
                    </div>
                )}

                {/* --- MENSAJE PARA MECÁNICOS --- */}
                {formData.tipo_usuario === 'mecanico' && (
                    <div className="alert alert-info">
                        Nota: Podrás añadir tus marcas de especialidad en tu perfil más tarde.
                    </div>
                )}

                <button type="submit" className="btn btn-success w-100 mt-3">Registrarse</button>
            </form>
        </div>
    );
}

export default RegisterPage;