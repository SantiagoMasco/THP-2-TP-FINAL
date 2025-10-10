import { Link } from 'react-router-dom';
import { ROUTES } from '../../_constants/index.js';

/**
 * Página 404 - No encontrado
 */
export const NotFoundPage = () => {
  return (
    <div className="page">
      <div className="page-content" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '6rem', margin: 0, color: '#e74c3c' }}>404</h1>
        <h2>Página no encontrada</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          La página que buscas no existe o fue movida.
        </p>
        <Link 
          to={ROUTES.TICKETS}
          className="btn btn-primary"
        >
          Volver a Tickets
        </Link>
      </div>
    </div>
  );
};

