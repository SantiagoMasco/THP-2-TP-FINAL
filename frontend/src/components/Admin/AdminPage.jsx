import { useAuth } from '../../_hooks/index.js';
import { UsersManager } from './UsersManager.jsx';

/**
 * Página de Administración
 */
export const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="page">
      <div className="page-content">
        <h1>Panel de Administración</h1>
        <p>Gestión de usuarios y configuración del sistema</p>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{ marginTop: 0 }}>Estado de Sesión</h2>
          <p><strong>Usuario autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
          {user && (
            <>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </>
          )}
        </div>

        {/* Gestión de usuarios */}
        <UsersManager />

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>📋 Features pendientes:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>✅ Gestión de usuarios (crear, listar)</li>
            <li>TODO: Editar y eliminar usuarios</li>
            <li>TODO: Asignación manual de tickets a agentes</li>
            <li>TODO: Estadísticas y métricas del sistema</li>
            <li>TODO: Configuración de categorías y prioridades</li>
            <li>TODO: Logs y auditoría</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

