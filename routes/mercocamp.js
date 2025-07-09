const express = require('express');
const router = express.Router();
const { executeQuery, executeTransaction } = require('../config/database');

// ====================================================================
// ROTAS PARA BANCO DBMERCOCAMP
// ====================================================================

// GET - Listar todas as tabelas do banco dbmercocamp
router.get('/tabelas', async (req, res) => {
  try {
    const result = await executeQuery('SHOW TABLES', [], 'dbmercocamp');
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Tabelas listadas com sucesso',
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar tabelas',
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

// GET - Listar dados de uma tabela específica
router.get('/tabela/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await executeQuery(
      `SELECT * FROM \`${nome}\` LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)],
      'dbmercocamp'
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: `Dados da tabela '${nome}' listados com sucesso`,
        data: result.data,
        count: result.data.length,
        pagination: { limit: parseInt(limit), offset: parseInt(offset) }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar dados da tabela',
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

// GET - Buscar registro por ID em uma tabela específica
router.get('/tabela/:nome/:id', async (req, res) => {
  try {
    const { nome, id } = req.params;
    const result = await executeQuery(
      `SELECT * FROM \`${nome}\` WHERE \`id\` = ?`,
      [id],
      'dbmercocamp'
    );
    
    if (result.success) {
      if (result.data.length > 0) {
        res.json({
          success: true,
          message: 'Registro encontrado',
          data: result.data[0]
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Registro não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar registro',
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

// POST - Inserir dados em uma tabela específica
router.post('/tabela/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const dados = req.body;
    
    if (!dados || Object.keys(dados).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados são obrigatórios'
      });
    }
    
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = campos.map(() => '?').join(', ');
    
    const result = await executeQuery(
      `INSERT INTO \`${nome}\` (\`${campos.join('`, `')}\`) VALUES (${placeholders})`,
      valores,
      'dbmercocamp'
    );
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Dados inseridos com sucesso',
        data: { id: result.data.insertId, ...dados }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao inserir dados',
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

// PUT - Atualizar dados em uma tabela específica
router.put('/tabela/:nome/:id', async (req, res) => {
  try {
    const { nome, id } = req.params;
    const dados = req.body;
    
    if (!dados || Object.keys(dados).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados são obrigatórios'
      });
    }
    
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const setClause = campos.map(campo => `\`${campo}\` = ?`).join(', ');
    valores.push(id);
    
    const result = await executeQuery(
      `UPDATE \`${nome}\` SET ${setClause} WHERE \`id\` = ?`,
      valores,
      'dbmercocamp'
    );
    
    if (result.success) {
      if (result.data.affectedRows > 0) {
        res.json({
          success: true,
          message: 'Dados atualizados com sucesso',
          data: { id, affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Registro não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar dados',
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

// DELETE - Deletar registro de uma tabela específica
router.delete('/tabela/:nome/:id', async (req, res) => {
  try {
    const { nome, id } = req.params;
    const result = await executeQuery(
      `DELETE FROM \`${nome}\` WHERE \`id\` = ?`,
      [id],
      'dbmercocamp'
    );
    
    if (result.success) {
      if (result.data.affectedRows > 0) {
        res.json({
          success: true,
          message: 'Registro deletado com sucesso',
          data: { id, affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Registro não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar registro',
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

// GET - Executar query personalizada (apenas SELECT)
router.get('/query', async (req, res) => {
  try {
    const { sql } = req.query;
    
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
    
    const result = await executeQuery(sql, [], 'dbmercocamp');
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Query executada com sucesso',
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao executar query',
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

// GET - Informações da estrutura de uma tabela
router.get('/tabela/:nome/estrutura', async (req, res) => {
  try {
    const { nome } = req.params;
    const result = await executeQuery(
      `DESCRIBE \`${nome}\``,
      [],
      'dbmercocamp'
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: `Estrutura da tabela '${nome}'`,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter estrutura da tabela',
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

// GET - Contar registros de uma tabela
router.get('/tabela/:nome/contar', async (req, res) => {
  try {
    const { nome } = req.params;
    const result = await executeQuery(
      `SELECT COUNT(*) as total FROM \`${nome}\``,
      [],
      'dbmercocamp'
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: `Contagem de registros da tabela '${nome}'`,
        data: { total: result.data[0].total }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao contar registros',
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