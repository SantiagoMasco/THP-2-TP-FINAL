import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TicketsContainer } from './containers/TicketsContainer.jsx';

console.log('✅ App.jsx FINAL - Con validacion de usuarios y userId');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Importar dinámicamente para evitar problemas de circular dependencies
      const { getUsersByEmail } = await import('./api/users.js');
      
      const users = await getUsersByEmail(email);
      
      console.log('🔐 Login response:', users);
      
      // Validar que se encontró al menos un usuario
      if (!users || users.length === 0) {
        setError('Usuario no encontrado. Verifica el email.');
        setLoading(false);
        return;
      }
      
      const user = users[0]; // Tomar el primer usuario del array
      
      // Validar que el usuario tenga los campos necesarios
      if (!user.id || !user.email || !user.role) {
        setError('Error: datos de usuario incompletos');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('user_data', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name || user.email, // Fallback al email si no hay name
        role: user.role
      }));
      
      console.log('✅ Login exitoso:', user);
      navigate('/tickets');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Error al iniciar sesion');
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '3rem', maxWidth: '500px', margin: '0 auto', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '3rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
      <h1 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Login Helpdesk</h1>
      <p style={{color: '#7f8c8d', marginBottom: '2rem'}}>Ingresa tu email para acceder</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Email:</label>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
            style={{width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px'}} 
            required 
          />
        </div>
        
        {error && (
          <div style={{padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px'}}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: loading ? '#95a5a6' : '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer'}}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesion'}
        </button>
      </form>
      
      <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f4f8', borderRadius: '4px', fontSize: '0.9rem'}}>
        <p style={{margin: 0, color: '#555'}}><strong>Usuarios de prueba:</strong></p>
        <ul style={{margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#555'}}>
          <li>admin@test.com (Admin)</li>
          <li>agent1@test.com (Agente)</li>
          <li>user@test.com (Usuario)</li>
        </ul>
      </div>
    </div>
  );
};

const TicketsPage = () => {
  const navigate = useNavigate();
  
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  };
  
  const user = getUserData();
  
  console.log('🎫 TicketsPage: User data:', user);
  
  if (!user) return <Navigate to="/login" replace />;
  
  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_email');
    navigate('/login');
  };
  
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{backgroundColor: '#2c3e50', color: 'white', padding: '1rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>Helpdesk - Tickets</h1>
          <p style={{margin: '0.3rem 0 0 0', opacity: 0.8, fontSize: '0.9rem'}}>
            Usuario: <strong>{user.name || user.email}</strong> 
            {user.role && <span style={{marginLeft: '0.5rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', fontSize: '0.8rem'}}>
              {user.role === 'ADMIN' && '👑 Admin'}
              {user.role === 'AGENT' && '🎧 Agente'}
              {user.role === 'USER' && '👤 Usuario'}
            </span>}
          </p>
        </div>
        <button onClick={handleLogout} style={{padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'}}>
          Cerrar Sesion
        </button>
      </div>
      
      <div style={{padding: '0 2rem 2rem 2rem'}}>
        <TicketsContainer userId={user.id} userRole={user.role} />
      </div>
    </div>
  );
};

export const App = () => {
  console.log('App renderizando - Version FINAL');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{minHeight: '100vh', backgroundColor: '#f5f6fa'}}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
