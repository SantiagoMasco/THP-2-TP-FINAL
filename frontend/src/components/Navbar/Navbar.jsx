import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Navbar - Componente de navegación principal
 * Muestra botones de login/logout según el estado de autenticación
 */
export const Navbar = () => {
  console.log('%c ========== NAVBAR RENDERIZANDO ========== ', 'background: purple; color: white; font-size: 20px; font-weight: bold;');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener usuario del localStorage directamente
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('helpdesk_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  };

  const [user, setUser] = React.useState(getUserFromStorage());

  // Actualizar el usuario cuando cambie el localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserFromStorage());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check cada segundo por si cambia el usuario
    const interval = setInterval(() => {
      const currentUser = getUserFromStorage();
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('helpdesk_user');
    localStorage.removeItem('helpdesk_token');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#FF0000',
      padding: '1rem 2rem',
      marginBottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '100%',
      minHeight: '70px'
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <h1 style={{ 
          color: '#FFFFFF', 
          margin: 0, 
          fontSize: '2rem', 
          fontWeight: 'bold',
          cursor: 'pointer',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
        onClick={() => navigate('/tickets')}
        >
          ⭐⭐⭐ NAVBAR FUNCIONANDO ⭐⭐⭐
        </h1>
        
        {user && (
          <button
            onClick={() => navigate('/tickets')}
            style={{
              background: 'none',
              border: 'none',
              color: isActive('/tickets') ? '#3498db' : '#ecf0f1',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: isActive('/tickets') ? 'rgba(52, 152, 219, 0.15)' : 'transparent'
            }}
          >
            📋 Tickets
          </button>
        )}
        
        {user && (user.role === 'AGENT' || user.role === 'ADMIN') && (
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              color: isActive('/admin') ? '#3498db' : '#ecf0f1',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: isActive('/admin') ? 'rgba(52, 152, 219, 0.15)' : 'transparent'
            }}
          >
            ⚙️ Admin
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{
              color: '#ecf0f1',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px'
            }}>
              {user.role === 'AGENT' && '🎧 '}
              {user.role === 'ADMIN' && '⚙️ '}
              {user.role === 'USER' && '👤 '}
              {user.name || user.email}
              <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '0.25rem' }}>
                ({user.role})
              </span>
            </span>
            <button
              onClick={handleLogout}
              type="button"
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🚪 Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            type="button"
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🔐 Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
};
