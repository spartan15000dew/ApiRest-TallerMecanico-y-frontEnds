import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MecanicoPanel from './pages/MecanicoPanel';
import HistorialPage from './pages/HistorialPage'; 
import VehiculosPage from './pages/VehiculosPage'; 
import AdminPanel from './pages/AdminPanel';

// --- IMPORTAMOS LAS NUEVAS PÁGINAS ---
import AgendarCitaPage from './pages/AgendarCitaPage';
import MisCitasPage from './pages/MisCitasPage';
import TodasLasCitasPage from './pages/TodasLasCitasPage';

const RutaProtegida = ({ children, rolesPermitidos }) => {
  const token = localStorage.getItem('token');
  const rolUsuario = localStorage.getItem('rol');

  if (!token) return <Navigate to="/login" replace />;
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={
            <RutaProtegida>
              <DashboardPage />
            </RutaProtegida>
        } />

        {/* --- CLIENTE --- */}
        <Route path="/vehiculos" element={
            <RutaProtegida rolesPermitidos={['cliente', 'administrador']}>
              <VehiculosPage />
            </RutaProtegida>
        } />
        
        {/* Agendar Cita (REAL) */}
        <Route path="/agendar" element={
            <RutaProtegida rolesPermitidos={['cliente']}>
               <AgendarCitaPage /> 
            </RutaProtegida>
        } />
        
        {/* Mis Citas (REAL) */}
        <Route path="/mis-citas" element={
            <RutaProtegida rolesPermitidos={['cliente']}>
               <MisCitasPage />
            </RutaProtegida>
        } />

        {/* --- MECÁNICO --- */}
        <Route path="/panel-mecanico" element={
            <RutaProtegida rolesPermitidos={['mecanico', 'administrador']}>
              <MecanicoPanel />
            </RutaProtegida>
        } />
        <Route path="/historial-citas" element={
            <RutaProtegida rolesPermitidos={['mecanico', 'administrador']}>
              <HistorialPage />
            </RutaProtegida>
        } />

        {/* --- ADMINISTRADOR --- */}
        <Route path="/admin-panel" element={
            <RutaProtegida rolesPermitidos={['administrador']}>
              <AdminPanel />
            </RutaProtegida>
        } />
        
        {/* Todas las Citas (REAL) */}
        <Route path="/todas-las-citas" element={
            <RutaProtegida rolesPermitidos={['administrador']}>
               <TodasLasCitasPage />
            </RutaProtegida>
        } />

        <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;