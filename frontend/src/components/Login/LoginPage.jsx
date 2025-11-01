import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../_hooks/index.js';
import { ROUTES } from '../../_constants/index.js';
import axiosInstance from '../../api/axiosInstance.js';

/**
 * Página de Login
 * Permite login con email de usuario existente
 */
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Buscar usuario por email
      const response = await axiosInstance.get(`/users?email=${email}`);
      const users = response.data;
      
      if (users.length === 0) {
        setError('Usuario no encontrado. Por favor verifica el email.');
        return;
      }

      const user = users[0];
      
      // Guardar usuario en authStore
      login(user);
      
      // Redirigir según rol
      if (user.role === 'AGENT' || user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.TICKETS);
      }
      
    } catch (err) {
      setError(err.message || 'Error al buscar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <h1>Login - Helpdesk</h1>
        <p>Ingresa tu email para acceder al sistema</p>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="tu@email.com"
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#dc3545', 
              marginBottom: '1rem', 
              padding: '0.75rem',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          <p>💡 Tip: Usa el email de un usuario creado desde /admin</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            Ejemplo: admin@ejemplo.com, maria@ejemplo.com
          </p>
        </div>
      </div>
    </div>
  );
};

