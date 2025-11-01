import { TicketsContainer } from '../../containers/TicketsContainer.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Página principal de tickets
 * Muestra el contenedor de tickets con toda su funcionalidad
 */
export const TicketsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Obtener usuario del localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem('helpdesk_user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        return null;
      }
    };
    
    setUser(getUserFromStorage());
    
    // Actualizar cada segundo
    const interval = setInterval(() => {
      setUser(getUserFromStorage());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('helpdesk_user');
    localStorage.removeItem('helpdesk_token');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="page">
      {/* Barra de navegación integrada */}
      <div style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#ecf0f1', margin: 0, fontSize: '1.2rem' }}>
          Frontend MVP - Helpdesk
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{
                color: '#ecf0f1',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px'
              }}>
                {user.role === 'AGENT' && '🎧 '}
                {user.role === 'ADMIN' && '⚙️ '}
                {user.role === 'USER' && '👤 '}
                {user.name || user.email} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                🚪 Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              🔐 Iniciar sesión
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        <p>Sistema de tickets con gestión de estados</p>
        
        <TicketsContainer />
      </div>
    </div>
  );
};
