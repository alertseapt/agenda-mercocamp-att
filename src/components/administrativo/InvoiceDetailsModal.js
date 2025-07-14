import React, { useState, useEffect } from 'react';
import { formatarData, formatarDataHora } from '../../utils/nfUtils';
import { updateAgendamento, deleteAgendamento, getClientes, updateAgendamentoStatus, updateHistoricoEntry } from '../../services/api';
import PasswordModal from './PasswordModal';
import DateInputModal from './DateInputModal';
import DateTimeInputModal from './DateTimeInputModal';
import './InvoiceDetailsModal.css';

const InvoiceDetailsModal = ({ agendamento, onClose, onRefresh, showStatusChange = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para os dados do agendamento (pode ser atualizado após save)
  const [currentAgendamento, setCurrentAgendamento] = useState(agendamento);
  
  const [editedData, setEditedData] = useState({
    numeroNF: agendamento?.numeroNF || '',
    chaveAcesso: agendamento?.chaveAcesso || '',
    volumes: agendamento?.volumes || 0,
    observacoes: agendamento?.observacoes || '',
    clienteId: agendamento?.clienteId || '',
    data: agendamento?.data || null,
    ePrevisao: agendamento?.ePrevisao || false,
    historicoStatus: agendamento?.historicoStatus || []
  });
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [clientes, setClientes] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [editingHistoryIndex, setEditingHistoryIndex] = useState(null);
  const [isEditingMainDate, setIsEditingMainDate] = useState(false);
  
  // Função auxiliar para processar timestamps em qualquer objeto de dados
  const processTimestamps = (data) => {
    if (!data) return data;
    
    const processedData = { ...data };
    
    // Processar campo 'data' principal
    if (processedData.data) {
      if (typeof processedData.data === 'object' && (processedData.data._seconds !== undefined || processedData.data.seconds !== undefined)) {
        // Se for um timestamp do Firebase/Firestore
        const seconds = processedData.data._seconds !== undefined ? processedData.data._seconds : processedData.data.seconds;
        const nanoseconds = processedData.data._nanoseconds || processedData.data.nanoseconds || 0;
        processedData.data = new Date((seconds * 1000) + (nanoseconds / 1000000)).toISOString();
        console.log(`🔄 Campo 'data' convertido de Firebase para ISO:`, processedData.data);
      } else if (processedData.data instanceof Date) {
        processedData.data = processedData.data.toISOString();
        console.log(`🔄 Campo 'data' convertido de Date para ISO:`, processedData.data);
      } else if (typeof processedData.data === 'string') {
        // Verificar se é uma string de data válida
        const date = new Date(processedData.data);
        if (!isNaN(date.getTime())) {
          processedData.data = date.toISOString();
          console.log(`🔄 Campo 'data' validado como string ISO:`, processedData.data);
        }
      }
    }
    
    // Processar historicoStatus
    if (processedData.historicoStatus && Array.isArray(processedData.historicoStatus)) {
      processedData.historicoStatus = processedData.historicoStatus
        .filter(item => item && item.status && item.status.trim() !== '')
        .map(item => {
          let timestamp = item.timestamp;
          
          if (timestamp && typeof timestamp === 'object' && (timestamp._seconds !== undefined || timestamp.seconds !== undefined)) {
            // Se for um timestamp do Firebase/Firestore
            const seconds = timestamp._seconds !== undefined ? timestamp._seconds : timestamp.seconds;
            const nanoseconds = timestamp._nanoseconds || timestamp.nanoseconds || 0;
            timestamp = new Date((seconds * 1000) + (nanoseconds / 1000000)).toISOString();
            console.log(`🔄 Timestamp do histórico "${item.status}" convertido de Firebase para ISO:`, timestamp);
          } else if (timestamp instanceof Date) {
            timestamp = timestamp.toISOString();
            console.log(`🔄 Timestamp do histórico "${item.status}" convertido de Date para ISO:`, timestamp);
          } else if (typeof timestamp === 'string') {
            // Verificar se é uma string de data válida
            const date = new Date(timestamp);
            if (!isNaN(date.getTime())) {
              timestamp = date.toISOString();
              console.log(`🔄 Timestamp do histórico "${item.status}" validado como string ISO:`, timestamp);
            } else {
              timestamp = new Date().toISOString();
              console.log(`⚠️ Timestamp inválido para "${item.status}", usando data atual:`, timestamp);
            }
          } else {
            // Se não for Date nem string, usar data atual
            timestamp = new Date().toISOString();
            console.log(`⚠️ Timestamp ausente para "${item.status}", usando data atual:`, timestamp);
          }
          
          return {
            status: String(item.status).trim(),
            timestamp: timestamp
          };
        });
    }
    
    return processedData;
  };
  
  useEffect(() => {
    if (isEditing) {
      fetchClientes();
    }
  }, [isEditing]);

  // Sincronizar currentAgendamento quando o prop agendamento mudar
  useEffect(() => {
    console.log('🔄 useEffect PROP - agendamento prop mudou:', agendamento);
    console.log('🔍 useEffect PROP - agendamento.data:', agendamento?.data);
    
    // Processar timestamps do prop antes de usar
    if (agendamento) {
      const processedAgendamento = processTimestamps(agendamento);
      console.log('📝 useEffect PROP - Agendamento processado:', processedAgendamento);
      console.log('🔍 useEffect PROP - processedAgendamento.data:', processedAgendamento.data);
      setCurrentAgendamento(processedAgendamento);
    }
  }, [agendamento]);

  // Sincronizar editedData quando currentAgendamento mudar (para refletir atualizações)
  useEffect(() => {
    console.log('🔄 useEffect - currentAgendamento mudou:', currentAgendamento);
    console.log('🔍 useEffect - currentAgendamento.data:', currentAgendamento?.data);
    
    const newEditedData = {
      numeroNF: currentAgendamento?.numeroNF || '',
      chaveAcesso: currentAgendamento?.chaveAcesso || '',
      volumes: currentAgendamento?.volumes || 0,
      observacoes: currentAgendamento?.observacoes || '',
      clienteId: currentAgendamento?.clienteId || '',
      data: currentAgendamento?.data || null,
      ePrevisao: currentAgendamento?.ePrevisao || false,
      historicoStatus: currentAgendamento?.historicoStatus || []
    };
    
    console.log('📝 useEffect - Novo editedData ANTES do processamento:', newEditedData);
    console.log('🔍 useEffect - newEditedData.data ANTES:', newEditedData.data);
    
    // 🛠️ PROCESSAR timestamps do editedData também!
    const processedEditedData = processTimestamps(newEditedData);
    console.log('📝 useEffect - Novo editedData DEPOIS do processamento:', processedEditedData);
    console.log('🔍 useEffect - processedEditedData.data DEPOIS:', processedEditedData.data);
    
    setEditedData(processedEditedData);
  }, [currentAgendamento]);

  const fetchClientes = async () => {
    try {
      const clientesList = await getClientes();
      clientesList.sort((a, b) => a.nome.localeCompare(b.nome));
      setClientes(clientesList);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };
  
  if (!agendamento) return null;
  
  // Função para lidar com o evento de clique no overlay
  const handleOverlayClick = (e) => {
    // Verifica se o clique foi diretamente no overlay e não em seus filhos
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Converter volumes para número
    if (name === 'volumes') {
      setEditedData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else if (type === 'checkbox') {
      setEditedData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'data') {
      // Tratar especificamente a data
      setEditedData(prev => ({
        ...prev,
        [name]: value || null
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleHistoricoChange = (index, field, value) => {
    setEditedData(prev => ({
      ...prev,
      historicoStatus: prev.historicoStatus.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addHistoricoItem = () => {
    setEditedData(prev => ({
      ...prev,
      historicoStatus: [...prev.historicoStatus, { status: '', timestamp: new Date().toISOString() }]
    }));
  };

  const removeHistoricoItem = (index) => {
    setEditedData(prev => ({
      ...prev,
      historicoStatus: prev.historicoStatus.filter((_, i) => i !== index)
    }));
  };

  // Função para converter data ISO para formato de input datetime-local
  const formatDateTimeForInput = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Erro ao formatar data/hora:', error);
      return '';
    }
  };

  // Função para converter data ISO para formato de input date
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 10);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };
  
  const handleDateEdit = () => {
    console.log('🗓️ CLICOU NO BOTÃO DA DATA PRINCIPAL! Este botão altera o campo "data" do agendamento.');
    setIsEditingMainDate(true);
    setIsDateModalOpen(true);
  };
  
  const handleConfirmDateChange = (newDateISO) => {
    const newDate = new Date(newDateISO);
    newDate.setUTCSeconds(0);
    newDate.setUTCHours(12); // Correção de fuso
    setEditedData(prev => ({
      ...prev,
      data: newDate.toISOString(),
      ePrevisao: !newDateISO
    }));
    setIsDateModalOpen(false);
  };
  
  const handleConfirmDateTimeChange = (newDateTimeISO) => {
    if (editingHistoryIndex !== null) {
      handleHistoricoChange(editingHistoryIndex, 'timestamp', newDateTimeISO);
    }
    setIsDateTimeModalOpen(false);
    setEditingHistoryIndex(null);
  };
  
  const handleHistoryDateEdit = (index) => {
    console.log(`🕐 CLICOU NO BOTÃO DO HISTÓRICO (índice ${index})! Este botão altera apenas o timestamp do status "${editedData.historicoStatus[index]?.status}".`);
    setEditingHistoryIndex(index); // Define qual item do histórico será editado
    setIsDateTimeModalOpen(true); // Abre o mesmo modal de data
  };
  
  const handleConfirmHistoryDateChange = (newDateISO) => {
    if (editingHistoryIndex !== null) {
      const originalTimestamp = editedData.historicoStatus[editingHistoryIndex].timestamp;
      const originalDate = new Date(originalTimestamp);
      const newDate = new Date(newDateISO);

      // Preserva a hora, minutos e segundos originais
      if (!isNaN(originalDate.getTime())) {
        newDate.setUTCHours(originalDate.getUTCHours());
        newDate.setUTCMinutes(originalDate.getUTCMinutes());
        newDate.setUTCSeconds(originalDate.getUTCSeconds());
      }
      
      handleHistoricoChange(editingHistoryIndex, 'timestamp', newDate.toISOString());
    }
    setIsDateTimeModalOpen(false); // Fecha o modal
    setEditingHistoryIndex(null); // Reseta o índice
  };

  // Função para detectar se apenas o histórico foi alterado
  const detectHistoricoChanges = () => {
    console.log('🔍 INICIANDO detectHistoricoChanges...');
    const originalHistorico = currentAgendamento.historicoStatus || [];
    const editedHistorico = editedData.historicoStatus || [];
    
    console.log('📊 originalHistorico:', originalHistorico);
    console.log('📊 editedHistorico:', editedHistorico);
    
    if (originalHistorico.length !== editedHistorico.length) {
      console.log('❌ Tamanhos diferentes - usando rota geral');
      return null; // Mudança estrutural, usar rota geral
    }
    
    const changedEntries = [];
    
    for (let i = 0; i < editedHistorico.length; i++) {
      const original = originalHistorico[i];
      const edited = editedHistorico[i];
      
      if (!original || !edited) continue;
      
      // Comparar timestamps (convertendo Firebase para ISO se necessário)
      const originalTimestamp = typeof original.timestamp === 'object' && original.timestamp._seconds 
        ? new Date(original.timestamp._seconds * 1000).toISOString()
        : original.timestamp;
        
      const editedTimestamp = edited.timestamp;
      
      console.log(`🔍 Comparando entrada ${i}:`);
      console.log(`   📅 Original: "${originalTimestamp}" vs Editado: "${editedTimestamp}"`);
      console.log(`   📋 Status original: "${original.status}" vs Editado: "${edited.status}"`);
      
      if (originalTimestamp !== editedTimestamp || original.status !== edited.status) {
        console.log(`✅ MUDANÇA DETECTADA na entrada ${i}`);
        changedEntries.push({
          index: i,
          entry: {
            status: edited.status,
            timestamp: editedTimestamp,
            observacao: edited.observacao || original.observacao || ''
          }
        });
      } else {
        console.log(`➖ Sem mudança na entrada ${i}`);
      }
    }
    
    // Verificar se APENAS o histórico mudou
    const dataFields = ['numeroNF', 'volumes', 'observacoes', 'clienteId', 'data', 'ePrevisao'];
    console.log('🔍 Verificando campos de dados:');
    
    const onlyHistoryChanged = dataFields.every(field => {
      let originalValue = currentAgendamento[field];
      let editedValue = editedData[field];
      
      // Converter timestamps do Firebase para comparação
      if (field === 'data' && typeof originalValue === 'object' && originalValue._seconds) {
        originalValue = new Date(originalValue._seconds * 1000).toISOString();
      }
      
      const isEqual = originalValue === editedValue;
      console.log(`   📊 ${field}: "${originalValue}" === "${editedValue}" → ${isEqual}`);
      
      return isEqual;
    });
    
    console.log(`🔍 changedEntries.length: ${changedEntries.length}`);
    console.log(`🔍 onlyHistoryChanged: ${onlyHistoryChanged}`);
    
    const result = onlyHistoryChanged && changedEntries.length > 0 ? changedEntries : null;
    console.log(`🔍 Resultado final:`, result);
    
    return result;
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setMensagem('');
    
    try {
      // Detectar se apenas o histórico foi alterado
      const historicoChanges = detectHistoricoChanges();
      
      if (historicoChanges) {
        console.log('🕐 Detectada alteração APENAS no histórico - usando rota específica');
        console.log('📊 Alterações detectadas:', historicoChanges);
        
        // Usar a rota específica para cada entrada alterada do histórico
        for (const change of historicoChanges) {
          await updateHistoricoEntry(currentAgendamento.id, change.index, change.entry);
        }
        
        console.log('✅ Todas as alterações do histórico foram salvas!');
        setMensagem('Histórico atualizado com sucesso!');
        setIsEditing(false);
        
        // Atualizar dados locais
        if (onRefresh) {
          await onRefresh();
        }
        
        // Fechar o modal após salvar
        onClose();
        
        return;
      }
      
      console.log('📋 Detectadas alterações gerais - usando rota de atualização completa');
      // Lista de campos permitidos (evitar envio de campos problemáticos)
      const allowedFields = [
        'numeroNF', 'volumes', 'status', 'observacoes', 'clienteId', 
        'data', 'ePrevisao', 'historicoStatus'
      ];
      
      // Lista de campos que NUNCA devem ser enviados (campos do backend)
      const forbiddenFields = [
        'id', '_id', 'chaveAcesso', 'createdAt', 'updatedAt', '__v',
        'created_at', 'updated_at', 'timestamp_created', 'timestamp_updated'
      ];
      
      // Validar e limpar os dados antes de enviar
      const basicData = {
        // Campos básicos obrigatórios
        numeroNF: String(editedData.numeroNF || ''),
        volumes: (() => {
          const vol = parseInt(editedData.volumes);
          return isNaN(vol) || vol < 0 ? 0 : vol;
        })(),
        status: editedData.status || 'recebido',
        observacoes: String(editedData.observacoes || ''),
        clienteId: editedData.clienteId && editedData.clienteId !== '' ? String(editedData.clienteId) : null,
        data: editedData.data,
        ePrevisao: Boolean(editedData.ePrevisao),
        historicoStatus: editedData.historicoStatus
      };
      
      // Processar timestamps usando a função auxiliar
      console.log('🔄 Processando timestamps dos dados para envio...');
      const dataToSend = processTimestamps(basicData);
      
      // Remover duplicatas do histórico
      if (dataToSend.historicoStatus && Array.isArray(dataToSend.historicoStatus)) {
        dataToSend.historicoStatus = dataToSend.historicoStatus
          .filter((item, index, arr) => {
            // Remover duplicatas com base no status e timestamp
            return index === arr.findIndex(t => t.status === item.status && t.timestamp === item.timestamp);
          });
      }
      
      // Detectar campos não permitidos nos dados originais
      const originalFields = Object.keys(editedData);
      const extraFields = originalFields.filter(field => !allowedFields.includes(field));
      const forbiddenInData = originalFields.filter(field => forbiddenFields.includes(field));
      
      if (extraFields.length > 0) {
        console.warn('Campos não permitidos detectados:', extraFields);
        console.warn('Valores desses campos:', extraFields.map(field => ({[field]: editedData[field]})));
      }
      
      if (forbiddenInData.length > 0) {
        console.warn('CAMPOS PROIBIDOS detectados (serão removidos):', forbiddenInData);
        console.warn('Valores dos campos proibidos:', forbiddenInData.map(field => ({[field]: editedData[field]})));
      }
      
      // Filtrar dados - apenas campos permitidos e sem campos proibidos
      const safeData = Object.fromEntries(
        Object.entries(dataToSend).filter(([key, value]) => {
          // Excluir campos proibidos
          if (forbiddenFields.includes(key)) {
            console.warn(`Removendo campo proibido: ${key}`);
            return false;
          }
          // Incluir apenas campos permitidos
          if (!allowedFields.includes(key)) {
            console.warn(`Removendo campo não permitido: ${key}`);
            return false;
          }
          // Manter campos null específicos
          if (key === 'clienteId' && value === null) return true;
          if (key === 'data' && value === null) return true;
          // Remover undefined e null geral
          return value !== undefined && value !== null;
        })
      );
      
      // Verificação final: garantir que nenhum campo proibido passou
      const finalCheck = Object.keys(safeData).filter(key => forbiddenFields.includes(key));
      if (finalCheck.length > 0) {
        console.error('ERRO: Campos proibidos ainda presentes:', finalCheck);
        // Remover forçadamente
        finalCheck.forEach(key => delete safeData[key]);
      }
      
      // Verificação extra para chaveAcesso (campo problemático identificado)
      if (safeData.chaveAcesso !== undefined) {
        console.error('REMOVENDO chaveAcesso dos dados:', safeData.chaveAcesso);
        delete safeData.chaveAcesso;
      }
      
      const cleanData = safeData;
      
      console.log('=== DEBUG: Dados sendo enviados para o backend ===');
      console.log('cleanData:', JSON.stringify(cleanData, null, 2));
      console.log('agendamento.id:', currentAgendamento.id);
      console.log('Original editedData:', JSON.stringify(editedData, null, 2));
      
      // Verificação final: garantir que não há objetos Firebase nos dados finais
      const hasFirebaseObjects = JSON.stringify(cleanData).includes('_seconds');
      if (hasFirebaseObjects) {
        console.error('ERRO: Ainda há objetos Firebase nos dados limpos!');
        console.error('Dados problemáticos:', cleanData);
        throw new Error('Dados ainda contêm objetos Firebase não convertidos');
      }
      
      console.log('✅ Dados validados e limpos - sem objetos Firebase');
      console.log('🚀 Enviando PUT com dados limpos...');
      
      const updateResult = await updateAgendamento(currentAgendamento.id, cleanData);
      console.log('✅ PUT executado com sucesso!');
      console.log('📝 Resposta do backend:', updateResult);
      
      // Atualizar o agendamento local com os dados da resposta
      if (updateResult) {
        console.log('🔄 Atualizando dados locais do modal com resposta do backend...');
        
        // Processar timestamps da resposta do backend também
        console.log('🔍 ANTES do processamento - updateResult:', updateResult);
        console.log('🔍 ANTES do processamento - updateResult.data:', updateResult.data);
        
        const processedUpdateResult = processTimestamps(updateResult);
        console.log('🔄 Processando timestamps da resposta do backend...');
        console.log('📊 Dados processados:', processedUpdateResult);
        console.log('🔍 DEPOIS do processamento - processedUpdateResult.data:', processedUpdateResult.data);
        
        setCurrentAgendamento(processedUpdateResult);
        console.log('✅ Dados locais atualizados!');
      }
      
      setMensagem('Informações atualizadas com sucesso!');
      setIsEditing(false);
      
      console.log('🔄 Chamando onRefresh para atualizar a lista...');
      // Notifica o componente pai para atualizar a lista
      if (onRefresh) {
        await onRefresh();
        console.log('✅ onRefresh executado!');
      } else {
        console.warn('⚠️ onRefresh não disponível');
      }
      
      // Fechar o modal após salvar
      onClose();
      
              // Pequeno delay para verificar se a mudança foi persistida
        setTimeout(() => {
          console.log('🔍 Verificando se os dados do modal foram atualizados...');
          console.log('📊 TODOS os dados do currentAgendamento:', currentAgendamento);
          console.log('📊 TODOS os dados do editedData:', editedData);
          console.log('📊 Campo data específico:', {
            currentAgendamento_data: currentAgendamento.data,
            editedData_data: editedData.data
          });
        }, 1000);
      
      console.log('🎉 Processo de atualização concluído com sucesso!');
    } catch (error) {
      console.error('❌ ERRO ao atualizar agendamento:');
      console.error('📋 Tipo do erro:', error.name);
      console.error('💬 Mensagem:', error.message);
      console.error('🔢 Status:', error.response?.status);
      console.error('📄 Dados da resposta:', error.response?.data);
      console.error('🌐 URL da requisição:', error.config?.url);
      console.error('📊 Dados enviados:', error.config?.data);
      console.error('🚨 Erro completo:', error);
      console.error('📝 Dados editados que causaram o erro:', editedData);
      
      // Tentar mostrar uma mensagem mais específica
      let errorMessage = 'Erro ao atualizar informações';
      if (error.response?.status === 404) {
        errorMessage = 'Agendamento não encontrado';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMensagem(errorMessage);
    } finally {
      setSaving(false);
      console.log('🏁 setSaving(false) executado');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      try {
        await deleteAgendamento(currentAgendamento.id);
        onRefresh();
        onClose();
      } catch (error) {
        console.error('Erro ao excluir nota fiscal:', error);
        alert('Erro ao excluir nota fiscal');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    setMensagem('');
    
    try {
      const result = await updateAgendamentoStatus(currentAgendamento.id, newStatus);
      setMensagem(`Status alterado para "${newStatus}" com sucesso!`);
      
      // Atualizar o status local imediatamente
      setCurrentAgendamento(prev => ({
        ...prev,
        status: newStatus
      }));
      
      // Notifica o componente pai para atualizar a lista
      if (onRefresh) {
        onRefresh();
      }
      
      // Fechar o modal após alterar status
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setMensagem('Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    // Garante que o formulário de edição comece com os dados mais recentes do agendamento
    const initialEditedData = {
      numeroNF: agendamento?.numeroNF || '',
      chaveAcesso: agendamento?.chaveAcesso || '',
      volumes: agendamento?.volumes || 0,
      observacoes: agendamento.observacoes || '',
      clienteId: agendamento?.clienteId || '',
      data: agendamento?.data || null,
      ePrevisao: agendamento?.ePrevisao || false,
      historicoStatus: agendamento?.historicoStatus || []
    };
    
    console.log('🔑 handlePasswordConfirm - Dados iniciais:', initialEditedData);
    
    // 🛠️ PROCESSAR timestamps dos dados iniciais também!
    const processedInitialData = processTimestamps(initialEditedData);
    console.log('🔑 handlePasswordConfirm - Dados processados:', processedInitialData);
    
    setEditedData(processedInitialData);
    setIsEditing(true);
    setShowPasswordModal(false);
  };

  return (
    <div className="invoice-modal-overlay" onClick={handleOverlayClick}>
      <div className="invoice-modal-content">
        <div className="invoice-modal-header">
          <h3 className="invoice-modal-title">Detalhes da Nota Fiscal</h3>
          <div className="invoice-modal-actions-header">
            {!isEditing ? (
              <button 
                className="invoice-edit-button" 
                onClick={handleEditClick}
              >
                Editar
              </button>
            ) : (
              <>
                <button 
                  className="invoice-cancel-edit-button" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData({
                      numeroNF: agendamento.numeroNF || '',
                      chaveAcesso: agendamento.chaveAcesso || '',
                      volumes: agendamento.volumes || 0,
                      observacoes: agendamento.observacoes || '',
                      clienteId: agendamento.clienteId || '',
                      data: agendamento.data || null,
                      ePrevisao: agendamento.ePrevisao || false,
                      historicoStatus: agendamento.historicoStatus || []
                    });
                    setMensagem('');
                  }}
                >
                  Cancelar Edição
                </button>
                <button 
                  className="invoice-delete-button" 
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              </>
            )}
            <button className="invoice-close-button" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="invoice-modal-body">
          {isEditing ? (
            <div className="invoice-edit-form">
              <div className="invoice-form-group">
                <label className="invoice-form-label">Número da NF:</label>
                <input
                  type="text"
                  name="numeroNF"
                  value={editedData.numeroNF}
                  onChange={handleInputChange}
                  className="invoice-form-input"
                />
              </div>
              
              <div className="invoice-form-group">
                <label className="invoice-form-label">Chave de Acesso:</label>
                <input
                  type="text"
                  name="chaveAcesso"
                  value={editedData.chaveAcesso}
                  onChange={handleInputChange}
                  placeholder="Informe a chave de acesso"
                  className="invoice-form-input"
                />
              </div>

              <div className="invoice-form-group">
                <label className="invoice-form-label">Cliente:</label>
                <select
                  name="clienteId"
                  value={editedData.clienteId}
                  onChange={handleInputChange}
                  className="invoice-form-select"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="invoice-form-group">
                <label className="invoice-form-label">Volumes:</label>
                <input
                  type="number"
                  name="volumes"
                  value={editedData.volumes}
                  onChange={handleInputChange}
                  min="0"
                  className="invoice-form-input"
                />
              </div>
              
              <div className="invoice-form-group">
                <label className="invoice-form-label">Observações:</label>
                <textarea
                  name="observacoes"
                  value={editedData.observacoes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Observações adicionais"
                  className="invoice-form-textarea"
                />
              </div>

              <div className="invoice-form-group">
                <label className="invoice-form-label">📅 Data Principal do Agendamento:</label>
                <div className="date-display-container">
                  <span className="date-display-value">
                    {editedData.ePrevisao 
                      ? 'Previsão (sem data específica)' 
                      : formatarData(editedData.data)}
                  </span>
                  <button className="date-edit-button main-date-button" onClick={handleDateEdit} title="Alterar data principal do agendamento">
                    📅 Editar Data
                  </button>
                </div>
              </div>
              
              <button 
                className="invoice-save-button" 
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="invoice-loading-spinner"></span>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
              
              {mensagem && (
                <p className={`invoice-message ${mensagem.includes('sucesso') ? 'success' : 'error'}`}>
                  {mensagem}
                </p>
              )}

              {/* Seção de edição do histórico - REATIVADA */}
              <div className="invoice-historico">
                <h4 className="invoice-historico-title">Editar Histórico de Status</h4>
                {editedData.historicoStatus && editedData.historicoStatus.map((item, index) => (
                  <div key={index} className="invoice-historico-edit-item">
                    <div className="invoice-form-group">
                      <label className="invoice-form-label">Status:</label>
                      <div className="status-display-container">
                        {item.status}
                      </div>
                    </div>
                    <div className="invoice-form-group">
                      <label className="invoice-form-label">🕐 Data/Hora do Status:</label>
                      <div className="date-display-container">
                        <span className="date-display-value">
                          {formatarDataHora(item.timestamp)}
                        </span>
                        <button className="date-edit-button history-date-button" onClick={() => handleHistoryDateEdit(index)} title="Alterar quando este status foi definido">
                          🕐 Editar Hora
                        </button>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeHistoricoItem(index)}
                      className="invoice-delete-button"
                      style={{ marginTop: '10px' }}
                    >
                      Remover Item
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addHistoricoItem}
                  className="invoice-edit-button"
                  style={{ marginTop: '15px' }}
                >
                  Adicionar Item ao Histórico
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Número da NF:</span>
                <span className={`invoice-detail-value ${!currentAgendamento.numeroNF ? 'empty' : ''}`}>
                  {currentAgendamento.numeroNF || 'Não informado'}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Chave de Acesso:</span>
                <span className={`invoice-detail-value ${!currentAgendamento.chaveAcesso ? 'empty' : ''}`}>
                  {currentAgendamento.chaveAcesso || 'Não informado'}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Cliente:</span>
                <span className={`invoice-detail-value ${!currentAgendamento.cliente?.nome ? 'empty' : ''}`}>
                  {currentAgendamento.cliente?.nome || 'Não informado'}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">CNPJ:</span>
                <span className={`invoice-detail-value ${!currentAgendamento.cliente?.cnpj ? 'empty' : ''}`}>
                  {currentAgendamento.cliente?.cnpj || 'Não informado'}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Status:</span>
                <span className="invoice-detail-value">{currentAgendamento.status}</span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Volumes:</span>
                <span className="invoice-detail-value">
                  {currentAgendamento.volumes !== undefined ? currentAgendamento.volumes : 'Não informado'}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Data:</span>
                <span className="invoice-detail-value">
                  {currentAgendamento.ePrevisao 
                    ? 'Previsão (sem data específica)' 
                    : formatarData(currentAgendamento.data)}
                </span>
              </div>
              
              <div className="invoice-detail-row">
                <span className="invoice-detail-label">Observações:</span>
                <span className={`invoice-detail-value ${!currentAgendamento.observacoes ? 'empty' : ''}`}>
                  {currentAgendamento.observacoes || 'Nenhuma observação'}
                </span>
              </div>
              
              {showStatusChange && !isEditing && (
                <div className="invoice-status-change-section">
                  <h4 className="invoice-status-title">Alterar Status</h4>
                  <div className="invoice-status-buttons">
                    <button 
                      className="invoice-status-button recebido"
                      onClick={() => handleStatusChange('recebido')}
                      disabled={updatingStatus || currentAgendamento.status === 'recebido'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Atualizando...
                        </>
                      ) : (
                        'Recebido'
                      )}
                    </button>
                    <button 
                      className="invoice-status-button informado"
                      onClick={() => handleStatusChange('informado')}
                      disabled={updatingStatus || currentAgendamento.status === 'informado'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Atualizando...
                        </>
                      ) : (
                        'Informado'
                      )}
                    </button>
                    <button 
                      className="invoice-status-button em-tratativa"
                      onClick={() => handleStatusChange('em tratativa')}
                      disabled={updatingStatus || currentAgendamento.status === 'em tratativa'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Atualizando...
                        </>
                      ) : (
                        'Em Tratativa'
                      )}
                    </button>
                    <button 
                      className="invoice-status-button a-paletizar"
                      onClick={() => handleStatusChange('a paletizar')}
                      disabled={updatingStatus || currentAgendamento.status === 'a paletizar'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Atualizando...
                        </>
                      ) : (
                        'A Paletizar'
                      )}
                    </button>
                    <button 
                      className="invoice-status-button paletizado"
                      onClick={() => handleStatusChange('paletizado')}
                      disabled={updatingStatus || currentAgendamento.status === 'paletizado'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Atualizando...
                        </>
                      ) : (
                        'Paletizado'
                      )}
                    </button>
                    <button 
                      className="invoice-status-button fechado"
                      onClick={() => handleStatusChange('fechado')}
                      disabled={updatingStatus || currentAgendamento.status === 'fechado'}
                    >
                      {updatingStatus ? (
                        <>
                          <span className="invoice-loading-spinner"></span>
                          Finalizando...
                        </>
                      ) : (
                        'Finalizar'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="invoice-historico">
            <h4 className="invoice-historico-title">Histórico de Status</h4>
            {currentAgendamento.historicoStatus && currentAgendamento.historicoStatus.length > 0 ? (
              <ul className="invoice-historico-list">
                {currentAgendamento.historicoStatus.map((item, index) => (
                  <li key={index} className="invoice-historico-item">
                    <span className="invoice-historico-status">{item.status}</span>
                    <span className="invoice-historico-date">{formatarDataHora(item.timestamp)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="invoice-historico-empty">Nenhum histórico disponível</p>
            )}
          </div>
        </div>
      </div>
      
      {showPasswordModal && (
        <PasswordModal
          onConfirm={handlePasswordConfirm}
          onCancel={() => setShowPasswordModal(false)}
          title="Digite a senha para editar"
        />
      )}

      <DateInputModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSubmit={handleConfirmDateChange}
      />

      <DateTimeInputModal
        isOpen={isDateTimeModalOpen}
        onClose={() => {
          setIsDateTimeModalOpen(false);
          setEditingHistoryIndex(null);
        }}
        onSubmit={handleConfirmDateTimeChange}
        initialDateTimeString={
          editingHistoryIndex !== null ? formatarDataHora(editedData.historicoStatus[editingHistoryIndex].timestamp) : ''
        }
      />
    </div>
  );
};

export default InvoiceDetailsModal;