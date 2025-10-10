import { TicketsContainer } from '../../containers/TicketsContainer.jsx';

/**
 * Página principal de tickets
 * Muestra el contenedor de tickets con toda su funcionalidad
 */
export const TicketsPage = () => {
  return (
    <div className="page">
      <div className="page-content">
        <h1>Frontend MVP - Helpdesk</h1>
        <p>Sistema de tickets con gestión de estados</p>
        
        <TicketsContainer />
      </div>
    </div>
  );
};
