import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../_hooks/index.js';
import { ROUTES } from '../../_constants/index.js';

/**
 * Componente de navegación simple
 * Muestra links a las diferentes rutas de la aplicación
 */
export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Helper para determinar si un link está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 2rem',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* Tickets - visible para todos */}
        <Link 
          to={ROUTES.TICKETS}
          style={{
            color: isActive(ROUTES.TICKETS) ? '#3498db' : '#ecf0f1',
            textDecoration: 'none',
            fontWeight: isActive(ROUTES.TICKETS) ? 'bold' : 'normal',
            fontSize: '1rem'
          }}
        >
          📋 Tickets
        </Link>
        
        {/* Admin - solo para AGENT y ADMIN */}
        {user && (user.role === 'AGENT' || user.role === 'ADMIN') && (
          <Link 
            to={ROUTES.ADMIN}
            style={{
              color: isActive(ROUTES.ADMIN) ? '#3498db' : '#ecf0f1',
              textDecoration: 'none',
              fontWeight: isActive(ROUTES.ADMIN) ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            ⚙️ Admin
          </Link>
        )}
        
        {/* Login - solo si no está autenticado */}
        {!isAuthenticated && (
          <Link 
            to={ROUTES.LOGIN}
            style={{
              color: isActive(ROUTES.LOGIN) ? '#3498db' : '#ecf0f1',
              textDecoration: 'none',
              fontWeight: isActive(ROUTES.LOGIN) ? 'bold' : 'normal',
              fontSize: '1rem'
            }}
          >
            🔐 Login
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated && user ? (
          <>
            <span style={{ color: '#ecf0f1', fontSize: '0.9rem' }}>
              {user.role === 'AGENT' && '🎧'}
              {user.role === 'ADMIN' && '⚙️'}
              {user.role === 'USER' && '👤'} {user.name || user.email}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                ({user.role})
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <span style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
            No autenticado
          </span>
        )}
      </div>

      {/* TODO: Agregar más elementos de navegación
       * - Notificaciones
       * - Perfil de usuario
       * - Búsqueda global
       * - Menú responsive para móviles
       */}
    </nav>
  );
};

