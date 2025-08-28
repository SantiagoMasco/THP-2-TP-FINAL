import { useState } from 'react';

/**
 * Componente de paginación
 * @param {number} page - Página actual
 * @param {number} pageSize - Tamaño de página
 * @param {boolean} hasNext - Si hay siguiente página
 * @param {Function} onPrev - Callback para página anterior
 * @param {Function} onNext - Callback para página siguiente
 * @param {Function} onChangePageSize - Callback para cambiar tamaño de página
 * @param {Function} onGoToPage - Callback para ir a página específica
 */
export const Pagination = ({ 
  page, 
  pageSize, 
  hasNext, 
  onPrev, 
  onNext, 
  onChangePageSize, 
  onGoToPage 
}) => {
  const [goToPage, setGoToPage] = useState('');

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage);
    if (pageNum && pageNum > 0) {
      onGoToPage(pageNum);
      setGoToPage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>Página {page}</span>
        
        <div className="page-size-control">
          <label htmlFor="page-size">Mostrar:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onChangePageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="pagination-controls">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="btn btn-secondary"
        >
          ← Anterior
        </button>

        <div className="go-to-page">
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ir a página"
            min="1"
            className="page-input"
          />
          <button
            onClick={handleGoToPage}
            className="btn btn-secondary"
          >
            Ir
          </button>
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="btn btn-primary"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
