import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../_hooks/index.js';
import { ROUTES } from '../../_constants/index.js';

/**
 * Página de Login - Placeholder temporal
 * TODO: Implementar integración real con backend
 */
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Reemplazar con llamada real al backend
    // Por ahora, solo simula un login exitoso
    const mockUser = {
      id: 1,
      email: email,
      name: email.split('@')[0],
      role: 'USER'
    };
    
    login(mockUser);
    navigate(ROUTES.TICKETS);
  };

  return (
    <div className="page">
      <div className="page-content">
        <h1>Login - Helpdesk</h1>
        <p>Placeholder temporal para autenticación</p>
        
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
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          <p>⚠️ Esta es una página temporal</p>
          <p>TODO: Integrar con endpoint /api/auth/login del backend</p>
        </div>
      </div>
    </div>
  );
};

