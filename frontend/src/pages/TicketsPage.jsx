import { TicketsContainer } from '../containers/TicketsContainer.jsx';

/**
 * Página principal de tickets con layout simple
 */
export const TicketsPage = () => {
  return (
    <div className="page">
      <div className="page-content">
        <TicketsContainer />
      </div>
    </div>
  );
};
