interface FilterSummaryProps {
    filters:  {[key: string]: any}
}
export default function FilterSummary({ filters }: FilterSummaryProps) {

  function getFilterParts() {
    const ignoredKeys = ['offset'];

    return Object.entries(filters)
        .filter(([key]) => !ignoredKeys.includes(key) && key !== 'limit')
        .map(([key, value]) => {
        const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/Desc$/, '');

        if (value && typeof value === 'object') {
            return `${formattedKey}`;
        }

        return `${formattedKey}: ${value}`;
        });
    }

  const parts = getFilterParts();

  return (
    <nav className="level mb-3">
      {/* LEFT: Filters */}
      <div className="level-left">
        <div className="level-item">
          <span className="has-text-grey mr-2">🔍 Filtrando:</span>
        </div>

        {parts.length === 0 ? (
          <div className="level-item">
            <span className="tag is-light">Sin filtros</span>
          </div>
        ) : (
          parts.map((part, i) => (
            <div className="level-item" key={i}>
              <span className="tag  is-light">{part}</span>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: Limit */}
      <div className="level-right">
        {filters.limit && (
          <div className="level-item">
            <span className="tag is-dark is-light">
              Mostrando {filters.limit} registros
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}