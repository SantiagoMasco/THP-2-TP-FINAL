/**
 * Componente para mostrar errores
 * @param {string} error - Mensaje de error
 */
export const ErrorBox = ({ error }) => {
  if (!error) return null;
  
  const looksAuth = /unauthor|token|credencial/i.test(error) || /401/.test(error);
  
  return (
    <div className="error-box" role="alert" aria-live="assertive">
      <h3>Error</h3>
      <p>{error}</p>
      {looksAuth && (
        <p className="error-hint">
          💡 Revisá <code>localStorage.AUTH_TOKEN</code> y que tu backend acepte CORS desde <code>http://localhost:5173</code>.
        </p>
      )}
    </div>
  );
};
