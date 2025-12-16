import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function DashboardPage() {
    const navigate = useNavigate();
    const [rol, setRol] = useState('');
    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        const rolGuardado = localStorage.getItem('rol');
        const userId = localStorage.getItem('user_id'); 
        
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }

        setRol(rolGuardado);
        setUsuario(userId);
    }, [navigate]);

    // --- COMPONENTE INTERNO PARA LAS TARJETAS ---
    const MenuCard = ({ title, desc, img, link, color }) => (
        <div className="col-md-4 mb-4" onClick={() => navigate(link)}>
            <div className={`card card-hover shadow h-100 border-${color}`}>
                <img src={img} className="card-img-top" alt={title} style={{height: '160px', objectFit: 'cover'}} />
                <div className="card-body text-center">
                    <h5 className={`card-title text-${color} fw-bold`}>{title}</h5>
                    <p className="card-text small text-muted">{desc}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            
            <div className="container mt-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Panel de Control</h2>
                    <p className="text-muted">
                        Bienvenido, usuario #{usuario} ({rol})
                    </p>
                </div>

                <div className="row justify-content-center">
                    
                    {/* --- MENÚ CLIENTE --- */}
                    {rol === 'cliente' && (
                        <>
                            <MenuCard 
                                title="Mis Vehículos" 
                                desc="Registra y administra tus autos."
                                img="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop"
                                link="/vehiculos"
                                color="primary"
                            />
                            <MenuCard 
                                title="Agendar Cita" 
                                desc="Solicita una revisión para tu auto."
                                img="https://images.unsplash.com/photo-1599256621730-d3ae22841fb4?w=500&auto=format&fit=crop"
                                link="/agendar"
                                color="success"
                            />
                            <MenuCard 
                                title="Citas Pendientes" 
                                desc="Revisa el estado actual (En proceso, etc)."
                                img="https://images.unsplash.com/photo-1632823471565-1ec2a5258352?w=500&auto=format&fit=crop"
                                link="/mis-citas"
                                color="warning"
                            />
                            {/* AQUÍ ESTÁ EL HISTORIAL PARA EL CLIENTE */}
                            <MenuCard 
                                title="Historial de Reparaciones" 
                                desc="Ver trabajos terminados y costos."
                                img="https://images.unsplash.com/photo-1504222490245-4367b8b79d2b?w=500&auto=format&fit=crop"
                                link="/historial-citas"
                                color="info"
                            />
                        </>
                    )}

                    {/* --- MENÚ MECÁNICO --- */}
                    {rol === 'mecanico' && (
                        <>
                            <MenuCard 
                                title="Trabajos Pendientes" 
                                desc="Acepta y gestiona reparaciones."
                                img="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop"
                                link="/panel-mecanico"
                                color="primary"
                            />
                            <MenuCard 
                                title="Historial Completo" 
                                desc="Consulta todas las reparaciones pasadas."
                                img="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop"
                                link="/historial-citas"
                                color="dark"
                            />
                            <MenuCard 
                                title="Mis Especialidades" 
                                desc="Configura qué marcas atiendes."
                                img="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500&auto=format&fit=crop"
                                link="/mi-perfil-mecanico"
                                color="info"
                            />
                        </>
                    )}

                    {/* --- MENÚ ADMINISTRADOR --- */}
                    {rol === 'administrador' && (
                        <>
                            <MenuCard 
                                title="Administración" 
                                desc="Aprobar mecánicos y crear marcas."
                                img="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop"
                                link="/admin-panel"
                                color="danger"
                            />
                            <MenuCard 
                                title="Reportes Globales" 
                                desc="Ver todas las citas del sistema."
                                img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop"
                                link="/todas-las-citas"
                                color="dark"
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default DashboardPage;