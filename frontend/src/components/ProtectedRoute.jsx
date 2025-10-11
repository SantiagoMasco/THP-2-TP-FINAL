import { Navigate } from 'react-router-dom';
import { useAuth } from '../_hooks/index.js';
import { ROUTES } from '../_constants/index.js';

/**
 * Componente para proteger rutas por autenticación y rol
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar si está autorizado
 * @param {Array<string>} [props.allowedRoles] - Roles permitidos (ej: ['AGENT', 'ADMIN'])
 * @param {boolean} [props.requireAuth=true] - Si requiere autenticación
 */
export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si hay roles específicos y el usuario no tiene uno de ellos
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="page">
        <div className="page-content" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: '4rem', margin: 0, color: '#e74c3c' }}>403</h1>
          <h2>Acceso Denegado</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            No tienes permisos para acceder a esta página.
          </p>
          <p style={{ color: '#999' }}>
            Tu rol actual: <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
};


