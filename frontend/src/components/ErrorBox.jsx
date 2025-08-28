/**
 * Componente para mostrar errores
 * @param {string} error - Mensaje de error
 */
export const ErrorBox = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-box">
      <h3>Error</h3>
      <p>{error}</p>
      {error.includes('401') && (
        <p className="error-hint">
          💡 Falta AUTH_TOKEN en localStorage o es inválido
        </p>
      )}
    </div>
  );
};
