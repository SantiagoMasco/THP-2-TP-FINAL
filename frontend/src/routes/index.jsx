import { Routes, Route, Navigate } from 'react-router-dom';
import { TicketsPage } from '../components/Tickets/TicketsPage.jsx';
import { LoginPage } from '../components/Login/index.js';
import { AdminPage } from '../components/Admin/index.js';
import { ProfilePage } from '../components/Profile/index.js';
import { NotFoundPage } from '../components/NotFoundPage/index.js';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';

/**
 * Configuración de rutas de la aplicación
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal - redirige a /tickets */}
      <Route path="/" element={<Navigate to="/tickets" replace />} />
      
      {/* Ruta de tickets - requiere autenticación */}
      <Route 
        path="/tickets" 
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta de login - no requiere autenticación */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Ruta de admin - solo AGENT y ADMIN */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta de perfil - requiere autenticación */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 - redirige a tickets */}
      <Route path="*" element={<Navigate to="/tickets" replace />} />
      
      {/* TODO: Agregar rutas protegidas
       * - /tickets/:id para ver detalle
       * - /profile para perfil de usuario
       * - Implementar ProtectedRoute component
       */}
    </Routes>
  );
};

