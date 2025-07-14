import React, { useState, useEffect } from 'react';
import SearchInput from '../components/leitura/SearchInput';
import FilterControls from '../components/leitura/FilterControls';
import SchedulesList from '../components/leitura/SchedulesList';
import InvoiceDetailsModal from '../components/administrativo/InvoiceDetailsModal';
import { getAgendamentos, getClientes } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { timestampToDate } from '../utils/nfUtils';

const statusOptions = ['agendado', 'recebido', 'informado', 'em tratativa', 'a paletizar', 'paletizado', 'fechado'];

const LeituraPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalVolumes, setTotalVolumes] = useState(0);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const { ambienteChanged, resetAmbienteChanged } = useAuth();
  const [clientes, setClientes] = useState([]);

  // Estado centralizado para os filtros
  const [filters, setFilters] = useState(() => {
    const hoje = new Date();
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return {
      dataInicial: primeiroDiaDoMes.toISOString().split('T')[0],
      dataFinal: hoje.toISOString().split('T')[0],
      cliente: '',
      status: statusOptions,
      ordenacao: 'data_antiga',
    };
  });
  
  // Carrega clientes e agendamentos iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [clientesList, agendamentosList] = await Promise.all([
          getClientes(),
          getAgendamentos()
        ]);
        
        clientesList.sort((a, b) => a.nome.localeCompare(b.nome));
        setClientes(clientesList);
        setAgendamentos(agendamentosList);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    if (ambienteChanged) {
      resetAmbienteChanged();
    }
  }, [ambienteChanged, resetAmbienteChanged]);

  // Efeito para aplicar filtros e ordenação
  useEffect(() => {
    let resultado = searchResults ? [...searchResults] : [...agendamentos];
    
    // Aplica filtros
    if (filters.cliente) {
      resultado = resultado.filter(a => a.clienteId === filters.cliente);
    }
    
    if (filters.status) {
      if (filters.status.length > 0) {
        resultado = resultado.filter(a => filters.status.includes(a.status));
      } else {
        resultado = [];
      }
    }
    
    if (filters.dataInicial && filters.dataFinal) {
      const dataInicio = new Date(filters.dataInicial);
      dataInicio.setHours(0, 0, 0, 0);
      const dataFim = new Date(filters.dataFinal);
      dataFim.setHours(23, 59, 59, 999);
      
      resultado = resultado.filter(a => {
        if (a.ePrevisao) return true;
        if (!a.data) return false;
        const dataAgendamento = timestampToDate(a.data);
        return dataAgendamento >= dataInicio && dataAgendamento <= dataFim;
      });
    }
    
    // Aplica ordenação
    switch (filters.ordenacao) {
      case 'data_recente':
        resultado.sort((a, b) => {
          if (a.ePrevisao && !b.ePrevisao) return 1;
          if (!a.ePrevisao && b.ePrevisao) return -1;
          return timestampToDate(b.data) - timestampToDate(a.data);
        });
        break;
      case 'volumes':
        resultado.sort((a, b) => (b.volumes || 0) - (a.volumes || 0));
        break;
      default: // data_antiga
        resultado.sort((a, b) => {
          if (a.ePrevisao && !b.ePrevisao) return 1;
          if (!a.ePrevisao && b.ePrevisao) return -1;
          return timestampToDate(a.data) - timestampToDate(b.data);
        });
        break;
    }
    
    setFilteredAgendamentos(resultado);
  }, [filters, agendamentos, searchResults]);
  
  // Efeito para calcular o total de volumes
  useEffect(() => {
    const total = filteredAgendamentos.reduce((acc, agendamento) => acc + (Number(agendamento.volumes) || 0), 0);
    setTotalVolumes(total);
  }, [filteredAgendamentos]);
  
  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await getAgendamentos();
      setAgendamentos(response);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchResults = (resultados) => {
    setSearchResults(resultados);
  };
  
  const clearSearch = () => {
    setSearchResults(null);
  };
  
  const handleRowClick = (agendamento) => {
    setSelectedAgendamento(agendamento);
  };

  const closeModal = () => {
    setSelectedAgendamento(null);
  };
  
  return (
    <div className="page leitura-page" style={{ maxWidth: '70%', margin: '0 auto' }}>
      <h2>Leitura</h2>
      
      <SearchInput onSearchResults={handleSearchResults} />
      
      <FilterControls 
        filters={filters}
        setFilters={setFilters}
        clientes={clientes}
      />
      
      <div className="total-volumes-info">
        <p>Volumetria total: <strong>{totalVolumes}</strong></p>
      </div>
      
      {searchResults !== null && (
        <div className="search-info">
          <p>Exibindo resultados da busca ({filteredAgendamentos.length})</p>
          <button onClick={clearSearch}>
            Limpar busca
          </button>
        </div>
      )}
      
      <SchedulesList 
        agendamentos={filteredAgendamentos} 
        loading={loading}
        onRowClick={handleRowClick}
      />
      
      {/* Debug info - pode ser removido posteriormente */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        fontSize: '12px',
        borderRadius: '4px',
        maxWidth: '300px'
      }}>
        <div>Total agendamentos: {agendamentos.length}</div>
        <div>Agendamentos filtrados: {filteredAgendamentos.length}</div>
        <div>Search results: {searchResults ? searchResults.length : 'null'}</div>
        <div>Loading: {loading ? 'true' : 'false'}</div>
      </div>

      {selectedAgendamento && (
        <InvoiceDetailsModal
          agendamento={selectedAgendamento}
          onClose={closeModal}
          onRefresh={fetchAgendamentos}
          showStatusChange={true}
        />
      )}
    </div>
  );
};

export default LeituraPage;