/**
 * Componente de carga con spinner animado
 */
export const Spinner = () => (
  <div className="spinner-container" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true"></div>
    <p>Cargando tickets...</p>
  </div>
);
