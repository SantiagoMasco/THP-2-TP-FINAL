import { useAuth } from '../../_hooks/index.js';

/**
 * Página de Perfil - Placeholder
 * TODO: Implementar edición de perfil
 */
export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="page-content">
          <h1>Perfil</h1>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-content">
        <h1>Mi Perfil</h1>
        
        <div style={{ 
          maxWidth: '600px', 
          margin: '2rem auto',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>ID:</strong> {user.id}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Nombre:</strong> {user.name || 'N/A'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> {user.email}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Rol:</strong> {user.role || 'USER'}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>TODO: Agregar formulario de edición de perfil</p>
        </div>
      </div>
    </div>
  );
};

