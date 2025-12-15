// src/pages/LoginPage.jsx
import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // POST a tu endpoint de login personalizado
            const response = await api.post('login/', credentials);
            
            const { token, rol, user_id, id_perfil } = response.data;

            // Guardamos todo lo útil en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);          // "cliente" o "mecanico"
            localStorage.setItem('user_id', user_id);  // ID del usuario de Django
            localStorage.setItem('id_perfil', id_perfil); // ID del Cliente o Mecanico

            // Ahora TODOS van al Menú Principal:
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>

                <div className="mt-3 text-center">
                    <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;