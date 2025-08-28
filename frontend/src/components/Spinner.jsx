/**
 * Componente de carga con spinner animado
 */
export const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Cargando tickets...</p>
    </div>
  );
};
