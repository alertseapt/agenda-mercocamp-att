const { executeQuery } = require('../config/database');

class ProdutoModel {
  
  // Obter todos os produtos com filtros opcionais
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM produtos';
    let params = [];
    let conditions = [];
    
    // Aplicar filtros
    if (filters.cnpj_int) {
      conditions.push('cnpj_int = ?');
      params.push(filters.cnpj_int);
    }
    
    if (filters.cnpj_forn) {
      conditions.push('cnpj_forn = ?');
      params.push(filters.cnpj_forn);
    }
    
    if (filters.cod_forn) {
      conditions.push('cod_forn = ?');
      params.push(filters.cod_forn);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY cod_int';
    
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
  
  // Obter produto por código interno
  static async getById(cod_int) {
    const query = 'SELECT * FROM produtos WHERE cod_int = ?';
    return await executeQuery(query, [cod_int]);
  }
  
  // Criar novo produto
  static async create(data) {
    const { cod_int, cnpj_int, cod_forn, cnpj_forn } = data;
    
    const query = `
      INSERT INTO produtos (cod_int, cnpj_int, cod_forn, cnpj_forn)
      VALUES (?, ?, ?, ?)
    `;
    
    const params = [cod_int, cnpj_int, cod_forn, cnpj_forn];
    
    return await executeQuery(query, params);
  }
  
  // Atualizar produto
  static async update(cod_int, data) {
    const { cnpj_int, cod_forn, cnpj_forn } = data;
    
    // Construir query dinâmica
    const fields = [];
    const params = [];
    
    if (cnpj_int !== undefined) { fields.push('cnpj_int = ?'); params.push(cnpj_int); }
    if (cod_forn !== undefined) { fields.push('cod_forn = ?'); params.push(cod_forn); }
    if (cnpj_forn !== undefined) { fields.push('cnpj_forn = ?'); params.push(cnpj_forn); }
    
    if (fields.length === 0) {
      return { success: false, error: 'Nenhum campo para atualizar' };
    }
    
    params.push(cod_int); // Para o WHERE
    
    const query = `UPDATE produtos SET ${fields.join(', ')} WHERE cod_int = ?`;
    
    return await executeQuery(query, params);
  }
  
  // Deletar produto
  static async delete(cod_int) {
    const query = 'DELETE FROM produtos WHERE cod_int = ?';
    return await executeQuery(query, [cod_int]);
  }
  
  // Obter estrutura da tabela
  static async getStructure() {
    const query = 'DESCRIBE produtos';
    return await executeQuery(query);
  }
  
  // Verificar se produto existe
  static async exists(cod_int) {
    const result = await this.getById(cod_int);
    return result.success && result.data.length > 0;
  }
  
  // Buscar por CNPJ interno
  static async getByCNPJInterno(cnpj_int) {
    const query = 'SELECT * FROM produtos WHERE cnpj_int = ? ORDER BY cod_int';
    return await executeQuery(query, [cnpj_int]);
  }
  
  // Buscar por CNPJ fornecedor
  static async getByCNPJFornecedor(cnpj_forn) {
    const query = 'SELECT * FROM produtos WHERE cnpj_forn = ? ORDER BY cod_int';
    return await executeQuery(query, [cnpj_forn]);
  }
  
  // Buscar por código fornecedor
  static async getByCodigoFornecedor(cod_forn) {
    const query = 'SELECT * FROM produtos WHERE cod_forn = ? ORDER BY cod_int';
    return await executeQuery(query, [cod_forn]);
  }
  
  // Obter estatísticas
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_produtos,
        COUNT(DISTINCT cnpj_int) as total_empresas_internas,
        COUNT(DISTINCT cnpj_forn) as total_fornecedores,
        COUNT(DISTINCT cod_forn) as total_codigos_fornecedor
      FROM produtos
    `;
    return await executeQuery(query);
  }
  
  // Buscar produtos por múltiplos critérios
  static async search(searchTerm) {
    const query = `
      SELECT * FROM produtos 
      WHERE cod_int LIKE ? 
         OR cnpj_int LIKE ? 
         OR cod_forn LIKE ? 
         OR cnpj_forn LIKE ?
      ORDER BY cod_int
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await executeQuery(query, [searchPattern, searchPattern, searchPattern, searchPattern]);
  }
  
  // Verificar duplicatas
  static async checkDuplicate(cod_int, excludeCurrent = false) {
    let query = 'SELECT COUNT(*) as count FROM produtos WHERE cod_int = ?';
    let params = [cod_int];
    
    if (excludeCurrent) {
      query += ' AND cod_int != ?';
      params.push(cod_int);
    }
    
    const result = await executeQuery(query, params);
    
    if (result.success && result.data.length > 0) {
      return result.data[0].count > 0;
    }
    
    return false;
  }
}

module.exports = ProdutoModel; 