// Arquivo api.js corrigido para o frontend
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://agenda-mercocamp-backend-production.up.railway.app/api'
});

export const getAgendamentos = async (filters = {}) => {
  const response = await api.get('/agendamentos', { params: filters });
  return response.data;
};

export const getAgendamentoById = async (id) => {
  const response = await api.get(`/agendamentos/${id}`);
  return response.data;
};

export const createAgendamento = async (agendamento) => {
  const response = await api.post('/agendamentos', agendamento);
  return response.data;
};

export const updateAgendamento = async (id, agendamento) => {
  console.log('🔄 API: Iniciando PUT para agendamento:', id);
  console.log('📤 API: Dados sendo enviados:', JSON.stringify(agendamento, null, 2));
  console.log('📊 API: Histórico sendo enviado:', agendamento.historicoStatus);
  
  try {
    const response = await api.put(`/agendamentos/${id}`, agendamento);
    console.log('✅ API: PUT executado com sucesso');
    console.log('📥 API: Status da resposta:', response.status);
    console.log('📄 API: Dados da resposta:', response.data);
    console.log('📊 API: Histórico na resposta:', response.data.historicoStatus);
    
    // Comparar o histórico enviado vs recebido
    console.log('🔍 API: COMPARAÇÃO DE HISTÓRICO:');
    console.log('📤 Enviado:', agendamento.historicoStatus);
    console.log('📥 Recebido:', response.data.historicoStatus);
    
    return response.data;
  } catch (error) {
    console.error('❌ API: Erro no PUT');
    console.error('🔢 API: Status do erro:', error.response?.status);
    console.error('📄 API: Dados do erro:', error.response?.data);
    console.error('💬 API: Mensagem do erro:', error.message);
    throw error;
  }
};

export const patchAgendamento = async (id, agendamento) => {
  const response = await api.patch(`/agendamentos/${id}`, agendamento);
  return response.data;
};

export const updateAgendamentoStatus = async (id, status) => {
  try {
    const response = await api.patch(`/agendamentos/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

// Nova função para atualizar entrada específica do histórico
export const updateHistoricoEntry = async (id, index, entry) => {
  console.log('🔄 API: Iniciando PUT para entrada do histórico');
  console.log('📋 ID do agendamento:', id);
  console.log('📍 Índice da entrada:', index);
  console.log('📊 Dados da entrada:', entry);
  
  try {
    const response = await api.put(`/agendamentos/${id}/historico-status/${index}`, entry);
    console.log('✅ API: PUT do histórico executado com sucesso');
    console.log('📥 API: Status da resposta:', response.status);
    console.log('📄 API: Dados da resposta:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: Erro no PUT do histórico');
    console.error('🔢 API: Status do erro:', error.response?.status);
    console.error('📄 API: Dados do erro:', error.response?.data);
    console.error('💬 API: Mensagem do erro:', error.message);
    throw error;
  }
};

export const deleteAgendamento = async (id) => {
  const response = await api.delete(`/agendamentos/${id}`);
  return response.data;
};

export const searchAgendamentos = async (termo) => {
  console.log('API: Fazendo requisição de busca para termo:', termo);
  
  try {
    // Primeiro tenta o endpoint específico de busca por NF
    let response;
    
    try {
      console.log('Tentando endpoint:', `${api.defaults.baseURL}/agendamentos/busca/nf`);
      response = await api.get('/agendamentos/busca/nf', { params: { termo } });
      console.log('API: Sucesso no endpoint /busca/nf:', response.status, response.data);
    } catch (nfError) {
      console.log('Erro no endpoint /busca/nf:', nfError.response?.status);
      
      // Se falhar, tenta busca com parâmetros de query no endpoint principal
      try {
        console.log('Tentando endpoint alternativo:', `${api.defaults.baseURL}/agendamentos`);
        response = await api.get('/agendamentos', { 
          params: { 
            search: termo,
            numeroNF: termo,
            chaveAcesso: termo 
          } 
        });
        console.log('API: Sucesso no endpoint alternativo:', response.status, response.data);
      } catch (altError) {
        console.log('Erro no endpoint alternativo, fazendo busca local...');
        
        // Fallback: busca todos os agendamentos e filtra localmente
        const allAgendamentos = await getAgendamentos();
        console.log('Total de agendamentos para busca local:', allAgendamentos.length);
        
        const filteredResults = allAgendamentos.filter(agendamento => {
          const nf = agendamento.numeroNF?.toString().toLowerCase() || '';
          const chave = agendamento.chaveAcesso?.toLowerCase() || '';
          const cliente = agendamento.cliente?.nome?.toLowerCase() || '';
          const searchTerm = termo.toLowerCase();
          
          return nf.includes(searchTerm) || 
                 chave.includes(searchTerm) || 
                 cliente.includes(searchTerm);
        });
        
        console.log('Resultados da busca local:', filteredResults.length);
        return filteredResults;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('API: Erro em todos os métodos de busca:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const getClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const getClienteById = async (id) => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const createCliente = async (cliente) => {
  const response = await api.post('/clientes', cliente);
  return response.data;
};

export const updateCliente = async (id, cliente) => {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const deleteCliente = async (id) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};