import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  // Recuperamos el username, si no existe ponemos 'Usuario'
  const user = localStorage.getItem('username') || 'Usuario'; 

  const handleLogout = () => {
    localStorage.clear(); // Borra token y datos
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm mb-4">
      <Link className="navbar-brand fw-bold text-warning" to="/dashboard">
        🔧 TallerApp
      </Link>
      
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-light d-none d-md-inline">
            Hola, {user} ({rol})
          </span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;