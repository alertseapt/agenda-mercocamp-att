import React from 'react';

const statusLabels = {
  'agendado': 'Agendado',
  'recebido': 'Recebido',
  'informado': 'Informado',
  'em tratativa': 'Em Tratativa',
  'a paletizar': 'A Paletizar',
  'paletizado': 'Paletizado',
  'fechado': 'Fechado'
};

const statusOptions = Object.keys(statusLabels);

const FilterControls = ({ filters, setFilters, clientes }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (statusValue) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(statusValue) 
        ? prev.status.filter(s => s !== statusValue) 
        : [...prev.status, statusValue];
      return { ...prev, status: newStatus };
    });
  };

  const smallInputStyle = {
    padding: '4px 8px',
    fontSize: '0.875rem',
    height: 'auto',
    width: 'fit-content'
  };
  
  return (
    <div className="filter-container">
      <div className="main-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
        <div className="filter-group">
          <label style={{ marginRight: '5px' }}>Data Inicial</label>
          <input type="date" name="dataInicial" value={filters.dataInicial} onChange={handleInputChange} style={smallInputStyle} />
        </div>
        <div className="filter-group">
          <label style={{ marginRight: '5px' }}>Data Final</label>
          <input type="date" name="dataFinal" value={filters.dataFinal} onChange={handleInputChange} style={smallInputStyle} />
        </div>
        
        <div className="filter-group">
          <label style={{ marginRight: '5px' }}>Cliente</label>
          <select name="cliente" value={filters.cliente} onChange={handleInputChange} style={smallInputStyle}>
            <option value="">Todos</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label style={{ marginRight: '5px' }}>Ordenar por</label>
          <select name="ordenacao" value={filters.ordenacao} onChange={handleInputChange} style={smallInputStyle}>
            <option value="data_antiga">Data mais antiga</option>
            <option value="data_recente">Data mais recente</option>
            <option value="volumes">Volumes (maior para menor)</option>
          </select>
        </div>
      </div>

      <div className="status-buttons-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', marginBottom: '10px', justifyContent: 'center' }}>
        {statusOptions.map(s => (
          <button 
            key={s} 
            onClick={() => handleStatusChange(s)}
            style={{ 
              opacity: filters.status.includes(s) ? 1 : 0.3,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filters.status.includes(s) ? '#007bff' : '#f0f0f0',
              color: filters.status.includes(s) ? 'white' : 'black',
              fontWeight: filters.status.includes(s) ? 'bold' : 'normal',
            }}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;