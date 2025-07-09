const express = require('express');
const router = express.Router();
const { testConnection, testAllConnections, executeQuery } = require('../config/database');

// ====================================================================
// ROTAS PARA GERENCIAMENTO DE BANCOS DE DADOS
// ====================================================================

// GET - Testar conexão com todos os bancos
router.get('/test-all', async (req, res) => {
  try {
    const results = await testAllConnections();
    
    const allConnected = Object.values(results).every(result => result === true);
    
    res.json({
      success: allConnected,
      message: allConnected ? 'Todas as conexões OK' : 'Algumas conexões falharam',
      data: results,
      summary: {
        total: Object.keys(results).length,
        connected: Object.values(results).filter(result => result === true).length,
        failed: Object.values(results).filter(result => result === false).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao testar conexões',
      error: error.message
    });
  }
});

// GET - Testar conexão com banco específico
router.get('/test/:banco', async (req, res) => {
  try {
    const { banco } = req.params;
    const bancosValidos = ['dbrecebimento', 'dbusuarios', 'dbmercocamp'];
    
    if (!bancosValidos.includes(banco)) {
      return res.status(400).json({
        success: false,
        message: 'Banco de dados inválido',
        validDatabases: bancosValidos
      });
    }
    
    const result = await testConnection(banco);
    
    res.json({
      success: result,
      message: result ? `Conexão com ${banco} OK` : `Falha na conexão com ${banco}`,
      database: banco,
      connected: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao testar conexão',
      error: error.message
    });
  }
});

// GET - Informações dos bancos de dados
router.get('/info', async (req, res) => {
  try {
    const bancos = [
      { nome: 'dbrecebimento', descricao: 'Banco principal para recebimentos' },
      { nome: 'dbusuarios', descricao: 'Banco para gerenciamento de usuários' },
      { nome: 'dbmercocamp', descricao: 'Banco geral do sistema Mercocamp' }
    ];
    
    const infoBancos = [];
    
    for (const banco of bancos) {
      const connected = await testConnection(banco.nome);
      infoBancos.push({
        ...banco,
        connected,
        status: connected ? 'online' : 'offline'
      });
    }
    
    res.json({
      success: true,
      message: 'Informações dos bancos de dados',
      data: infoBancos,
      summary: {
        total: infoBancos.length,
        online: infoBancos.filter(b => b.connected).length,
        offline: infoBancos.filter(b => !b.connected).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter informações dos bancos',
      error: error.message
    });
  }
});

// GET - Executar query em banco específico
router.get('/query/:banco', async (req, res) => {
  try {
    const { banco } = req.params;
    const { sql } = req.query;
    const bancosValidos = ['dbrecebimento', 'dbusuarios', 'dbmercocamp'];
    
    if (!bancosValidos.includes(banco)) {
      return res.status(400).json({
        success: false,
        message: 'Banco de dados inválido',
        validDatabases: bancosValidos
      });
    }
    
    if (!sql) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro SQL é obrigatório'
      });
    }
    
    // Validar se é uma query SELECT
    const sqlUpper = sql.trim().toUpperCase();
    if (!sqlUpper.startsWith('SELECT')) {
      return res.status(400).json({
        success: false,
        message: 'Apenas queries SELECT são permitidas'
      });
    }
    
    const result = await executeQuery(sql, [], banco);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Query executada com sucesso',
        database: banco,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao executar query',
        database: banco,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Listar tabelas de um banco específico
router.get('/tabelas/:banco', async (req, res) => {
  try {
    const { banco } = req.params;
    const bancosValidos = ['dbrecebimento', 'dbusuarios', 'dbmercocamp'];
    
    if (!bancosValidos.includes(banco)) {
      return res.status(400).json({
        success: false,
        message: 'Banco de dados inválido',
        validDatabases: bancosValidos
      });
    }
    
    const result = await executeQuery('SHOW TABLES', [], banco);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Tabelas do banco ${banco}`,
        database: banco,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar tabelas',
        database: banco,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Estrutura de uma tabela específica
router.get('/estrutura/:banco/:tabela', async (req, res) => {
  try {
    const { banco, tabela } = req.params;
    const bancosValidos = ['dbrecebimento', 'dbusuarios', 'dbmercocamp'];
    
    if (!bancosValidos.includes(banco)) {
      return res.status(400).json({
        success: false,
        message: 'Banco de dados inválido',
        validDatabases: bancosValidos
      });
    }
    
    const result = await executeQuery(`DESCRIBE \`${tabela}\``, [], banco);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Estrutura da tabela ${tabela}`,
        database: banco,
        table: tabela,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter estrutura da tabela',
        database: banco,
        table: tabela,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router; 