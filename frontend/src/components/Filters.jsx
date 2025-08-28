/**
 * Componente de filtros para tickets
 * @param {string} scope - Scope actual ('assigned' | 'created')
 * @param {string} status - Status actual
 * @param {Function} onChangeScope - Callback para cambiar scope
 * @param {Function} onChangeStatus - Callback para cambiar status
 */
export const Filters = ({ scope, status, onChangeScope, onChangeStatus }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="scope-filter">Mostrar:</label>
        <select
          id="scope-filter"
          value={scope}
          onChange={(e) => onChangeScope(e.target.value)}
        >
          <option value="assigned">Asignados a mí</option>
          <option value="created">Creados por mí</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Estado:</label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="in_progress">En progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>
    </div>
  );
};
