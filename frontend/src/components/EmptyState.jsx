/**
 * Componente para estado vacío cuando no hay tickets
 */
export const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h3>No se encontraron tickets</h3>
      <p>No hay tickets que coincidan con los filtros actuales.</p>
    </div>
  );
};
