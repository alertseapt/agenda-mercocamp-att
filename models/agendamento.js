const { executeQuery } = require('../config/database');
const { generateHistorico } = require('../utils/validators');

class AgendamentoModel {
  
  // Obter todos os agendamentos com filtros opcionais
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM agendamento';
    let params = [];
    let conditions = [];
    
    // Aplicar filtros
    if (filters.status) {
      conditions.push('STATUS = ?');
      params.push(filters.status);
    }
    
    if (filters.data_inicio) {
      conditions.push('DATA >= ?');
      params.push(filters.data_inicio);
    }
    
    if (filters.data_fim) {
      conditions.push('DATA <= ?');
      params.push(filters.data_fim);
    }
    
    if (filters.cli) {
      conditions.push('CLI = ?');
      params.push(filters.cli);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY DATA DESC, NUM DESC';
    
    // Aplicar paginação
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    
    return await executeQuery(query, params);
  }
  
  // Obter agendamento por ID
  static async getById(id) {
    const query = 'SELECT * FROM agendamento WHERE ID = ?';
    return await executeQuery(query, [id]);
  }
  
  // Criar novo agendamento
  static async create(data) {
    const { ID, NUM, CHNFE, CLI, VOL, DATA, STATUS, user_id } = data;
    
    // Gerar histórico de criação
    const historico = generateHistorico('CRIACAO', {
      ID, NUM, CHNFE, CLI, VOL, DATA, STATUS
    }, user_id);
    
    const query = `
      INSERT INTO agendamento (ID, NUM, CHNFE, CLI, VOL, DATA, STATUS, HIST)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      ID, NUM, CHNFE, CLI, VOL, DATA, STATUS, 
      JSON.stringify(historico)
    ];
    
    return await executeQuery(query, params);
  }
  
  // Atualizar agendamento
  static async update(id, data) {
    const { NUM, CHNFE, CLI, VOL, DATA, STATUS, user_id } = data;
    
    // Primeiro, obter dados atuais para comparação
    const currentResult = await this.getById(id);
    if (!currentResult.success || currentResult.data.length === 0) {
      return { success: false, error: 'Agendamento não encontrado' };
    }
    
    const currentData = currentResult.data[0];
    
    // Identificar mudanças
    const changes = {};
    if (NUM !== undefined && NUM !== currentData.NUM) changes.NUM = { de: currentData.NUM, para: NUM };
    if (CHNFE !== undefined && CHNFE !== currentData.CHNFE) changes.CHNFE = { de: currentData.CHNFE, para: CHNFE };
    if (CLI !== undefined && CLI !== currentData.CLI) changes.CLI = { de: currentData.CLI, para: CLI };
    if (VOL !== undefined && VOL !== currentData.VOL) changes.VOL = { de: currentData.VOL, para: VOL };
    if (DATA !== undefined && DATA !== currentData.DATA) changes.DATA = { de: currentData.DATA, para: DATA };
    if (STATUS !== undefined && STATUS !== currentData.STATUS) changes.STATUS = { de: currentData.STATUS, para: STATUS };
    
    // Gerar novo histórico
    const novoHistorico = generateHistorico('ALTERACAO', {
      mudancas: changes
    }, user_id);
    
    // Construir query dinâmica
    const fields = [];
    const params = [];
    
    if (NUM !== undefined) { fields.push('NUM = ?'); params.push(NUM); }
    if (CHNFE !== undefined) { fields.push('CHNFE = ?'); params.push(CHNFE); }
    if (CLI !== undefined) { fields.push('CLI = ?'); params.push(CLI); }
    if (VOL !== undefined) { fields.push('VOL = ?'); params.push(VOL); }
    if (DATA !== undefined) { fields.push('DATA = ?'); params.push(DATA); }
    if (STATUS !== undefined) { fields.push('STATUS = ?'); params.push(STATUS); }
    
    // Sempre atualizar o histórico
    fields.push('HIST = ?');
    params.push(JSON.stringify(novoHistorico));
    
    if (fields.length === 1) { // Apenas HIST
      return { success: false, error: 'Nenhum campo para atualizar' };
    }
    
    params.push(id); // Para o WHERE
    
    const query = `UPDATE agendamento SET ${fields.join(', ')} WHERE ID = ?`;
    
    return await executeQuery(query, params);
  }
  
  // Deletar agendamento
  static async delete(id) {
    const query = 'DELETE FROM agendamento WHERE ID = ?';
    return await executeQuery(query, [id]);
  }
  
  // Obter estrutura da tabela
  static async getStructure() {
    const query = 'DESCRIBE agendamento';
    return await executeQuery(query);
  }
  
  // Verificar se agendamento existe
  static async exists(id) {
    const result = await this.getById(id);
    return result.success && result.data.length > 0;
  }
  
  // Obter próximo número disponível
  static async getNextNum() {
    const query = 'SELECT MAX(NUM) as max_num FROM agendamento';
    const result = await executeQuery(query);
    
    if (result.success && result.data.length > 0) {
      const maxNum = result.data[0].max_num;
      return maxNum ? maxNum + 1 : 1;
    }
    
    return 1;
  }
  
  // Buscar por CHNFE
  static async getByCHNFE(chnfe) {
    const query = 'SELECT * FROM agendamento WHERE CHNFE = ?';
    return await executeQuery(query, [chnfe]);
  }
  
  // Buscar por cliente
  static async getByCliente(cli) {
    const query = 'SELECT * FROM agendamento WHERE CLI = ? ORDER BY DATA DESC';
    return await executeQuery(query, [cli]);
  }
  
  // Obter estatísticas
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN STATUS = 'ATIVO' THEN 1 END) as ativo,
        COUNT(CASE WHEN STATUS = 'CONCLUIDO' THEN 1 END) as concluido,
        COUNT(CASE WHEN STATUS = 'INATIVO' THEN 1 END) as inativo,
        COUNT(CASE WHEN STATUS = 'PENDENTE' THEN 1 END) as pendente,
        COUNT(CASE WHEN STATUS = 'CANCELADO' THEN 1 END) as cancelado
      FROM agendamento
    `;
    return await executeQuery(query);
  }
}

module.exports = AgendamentoModel; 