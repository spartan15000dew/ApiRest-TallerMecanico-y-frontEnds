import api from './axiosConfig';

export const authService = {
  login: async (username, password) => {
    // 1. URL CORREGIDA: Coincide con urls.py
    const response = await api.post('api/auth/login/', { username, password });
    
    // 2. GUARDADO DE DATOS CORREGIDO:
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Tu backend devuelve estos campos sueltos, no un objeto 'user'
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  logout: () => {
    localStorage.clear(); // Borra todo de una vez (token, rol, id)
    window.location.href = '/login';
  }
};