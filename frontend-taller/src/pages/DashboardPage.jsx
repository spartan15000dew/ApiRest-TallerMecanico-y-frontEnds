import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
    const navigate = useNavigate();
    const [rol, setRol] = useState('');
    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        // 1. Recuperamos los datos que guardamos al loguearnos
        const rolGuardado = localStorage.getItem('rol');
        const userId = localStorage.getItem('user_id'); 
        
        // Si no hay token, lo mandamos al login (Protección básica)
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }

        setRol(rolGuardado);
        setUsuario(userId); // Por ahora mostramos el ID, luego podemos mejorar para mostrar el Nombre
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); // Borra todo
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h1 className="text-center mb-4">Bienvenido al Taller Mecánico</h1>

                <div className="user-welcome text-center">
                    <h2>¡Hola, usuario #{usuario}!</h2>
                    <p className="text-muted">Has iniciado sesión como: <strong>{rol}</strong></p>
                </div>

                <hr />

                {/* --- MENÚ PARA CLIENTES --- */}
                {rol === 'cliente' && (
                    <div className="text-center">
                        <div className="alert alert-info">
                            Bienvenido a tu panel de cliente. Gestiona tus citas y vehículos.
                        </div>
                        <div className="d-grid gap-2 d-md-block">
                            <Link to="/perfil" className="btn btn-primary m-2">Mi Panel</Link>
                            <Link to="/vehiculos" className="btn btn-success m-2">Mis Vehículos</Link>
                            <Link to="/agendar" className="btn btn-warning m-2">Agendar Cita</Link>
                            <Link to="/mis-citas" className="btn btn-secondary m-2">Ver mis Citas</Link>
                        </div>
                    </div>
                )}

                {/* --- MENÚ PARA MECÁNICOS --- */}
                {rol === 'mecanico' && (
                    <div className="text-center">
                        <div className="alert alert-warning">
                            Bienvenido a tu panel de mecánico. Revisa tus trabajos.
                        </div>
                        <div className="d-grid gap-2 d-md-block">
                            <Link to="/panel-mecanico" className="btn btn-primary m-2">Mi Panel de Trabajo</Link>
                            <Link to="/historial-citas" className="btn btn-dark m-2">Historial de Citas</Link>
                        </div>
                    </div>
                )}

                {/* --- MENÚ PARA ADMINISTRADORES --- */}
                {rol === 'administrador' && (
                    <div className="text-center">
                        <div className="alert alert-danger">
                            Panel de Administración del Sistema.
                        </div>
                        <div className="d-grid gap-2 d-md-block">
                            <Link to="/admin-panel" className="btn btn-danger m-2">Panel de Control</Link>
                            <Link to="/todas-las-citas" className="btn btn-outline-dark m-2">Ver Todas las Citas</Link>
                            {/* Enlace externo al Admin de Django */}
                            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="btn btn-dark m-2">
                                Ir al Admin Django
                            </a>
                        </div>
                    </div>
                )}

                <hr className="mt-5" />
                
                <div className="text-center">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;