import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser } from '../../api/users.js';
import { Spinner, ErrorBox } from '../Shared/index.js';

/**
 * Componente para gestión de usuarios (CRUD)
 */
export const UsersManager = () => {
  const queryClient = useQueryClient();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER'
  });

  // Query para obtener usuarios
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Limpiar formulario
      setFormData({ name: '', email: '', role: 'USER' });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      alert('El email es obligatorio');
      return;
    }
    if (!formData.email.includes('@')) {
      alert('El email no es válido');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', role: 'USER' });
    createMutation.reset();
  };

  return (
    <div className="users-manager">
      <div className="users-manager-header">
        <h2>Gestión de Usuarios</h2>
        <p>Crear y listar usuarios del sistema</p>
      </div>

      {/* Formulario de creación */}
      <div className="users-form-container">
        <h3>Crear Nuevo Usuario</h3>
        <form onSubmit={handleSubmit} className="users-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="user-name">Nombre *</label>
              <input
                type="text"
                id="user-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                disabled={createMutation.isPending}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-email">Email *</label>
              <input
                type="email"
                id="user-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@ejemplo.com"
                disabled={createMutation.isPending}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-role">Rol *</label>
              <select
                id="user-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={createMutation.isPending}
              >
                <option value="USER">Usuario</option>
                <option value="AGENT">Agente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          {createMutation.error && (
            <ErrorBox error={createMutation.error.message} />
          )}

          {createMutation.isSuccess && (
            <div className="success-message">
              ✅ Usuario creado exitosamente
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Usuario'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={createMutation.isPending}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="users-list-container">
        <h3>Lista de Usuarios</h3>
        
        {isLoading && <Spinner />}
        {error && <ErrorBox error={error.message} />}
        
        {!isLoading && !error && (
          <>
            <p className="users-count">Total: {users.length} usuarios</p>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Activo</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role === 'USER' && '👤 Usuario'}
                            {user.role === 'AGENT' && '🎧 Agente'}
                            {user.role === 'ADMIN' && '⚙️ Admin'}
                          </span>
                        </td>
                        <td>
                          <span className={user.active ? 'status-active' : 'status-inactive'}>
                            {user.active ? '✓ Activo' : '✗ Inactivo'}
                          </span>
                        </td>
                        <td>
                          {new Date(user.createdAt).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

