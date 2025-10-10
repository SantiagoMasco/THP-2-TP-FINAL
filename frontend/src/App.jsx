import React from 'react';
import { TicketsContainer } from './containers/TicketsContainer.jsx';

/**
 * Componente raÃ­z de la aplicaciÃ³n
 */
export const App = () => {
  return (
    <div className="app">
      <div className="page">
        <div className="page-content">
          <h1>Frontend MVP - Helpdesk</h1>
          <p>Sistema de tickets conectado al backend</p>
          
          <TicketsContainer />
        </div>
      </div>
    </div>
  );
};
