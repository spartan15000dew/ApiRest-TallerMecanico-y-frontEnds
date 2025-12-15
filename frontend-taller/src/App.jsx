// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar tus componentes
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// import Dashboard from './pages/Dashboard'; // Tu dashboard existente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto: Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        {/* Menú Principal */}
      <Route path="/dashboard" element={<DashboardPage />} />
        {/* Rutas protegidas (ejemplo) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        
        {/* Página 404 */}
        <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;