const express = require('express');
const router = express.Router();
const { executeQuery, executeTransaction } = require('../config/database');

// ====================================================================
// ROTAS PARA BANCO BDUSUARIOS
// ====================================================================

// POST - Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    
    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: usuario, senha'
      });
    }
    
    // Buscar usuário por usuário e senha
    const result = await executeQuery(
      'SELECT * FROM `usuarios` WHERE `usuario` = ? AND `senha` = ?',
      [usuario, senha],
      'dbusuarios'
    );
    
    if (result.success) {
      if (result.data.length > 0) {
        const userData = result.data[0];
        
        res.json({
          success: true,
          message: 'Login realizado com sucesso',
          data: {
            usuario: userData.usuario,
            nivel_acesso: userData.nivel_acesso,
            cnpj: userData.cnpj,
            // Incluindo todos os campos disponíveis
            ...userData
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Usuário ou senha incorretos'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao realizar login',
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

// GET - Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM `usuarios`', [], 'dbusuarios');
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Usuários listados com sucesso',
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários',
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

// GET - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await executeQuery('SELECT * FROM `usuarios` WHERE `id` = ?', [id], 'dbusuarios');
    
    if (result.success) {
      if (result.data.length > 0) {
        res.json({
          success: true,
          message: 'Usuário encontrado',
          data: result.data[0]
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
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

// POST - Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo, status = 'ativo' } = req.body;
    
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email, senha, tipo'
      });
    }
    
    const result = await executeQuery(
      'INSERT INTO `usuarios` (`nome`, `email`, `senha`, `tipo`, `status`, `data_criacao`) VALUES (?, ?, ?, ?, ?, NOW())',
      [nome, email, senha, tipo, status],
      'dbusuarios'
    );
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: { id: result.data.insertId, nome, email, tipo, status }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar usuário',
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

// PUT - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, tipo, status } = req.body;
    
    const updateFields = [];
    const updateValues = [];
    
    if (nome !== undefined) {
      updateFields.push('`nome` = ?');
      updateValues.push(nome);
    }
    if (email !== undefined) {
      updateFields.push('`email` = ?');
      updateValues.push(email);
    }
    if (senha !== undefined) {
      updateFields.push('`senha` = ?');
      updateValues.push(senha);
    }
    if (tipo !== undefined) {
      updateFields.push('`tipo` = ?');
      updateValues.push(tipo);
    }
    if (status !== undefined) {
      updateFields.push('`status` = ?');
      updateValues.push(status);
    }
    
    updateFields.push('`data_atualizacao` = NOW()');
    updateValues.push(id);
    
    const result = await executeQuery(
      `UPDATE \`usuarios\` SET ${updateFields.join(', ')} WHERE \`id\` = ?`,
      updateValues,
      'dbusuarios'
    );
    
    if (result.success) {
      if (result.data.affectedRows > 0) {
        res.json({
          success: true,
          message: 'Usuário atualizado com sucesso',
          data: { id, affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
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

// DELETE - Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await executeQuery('DELETE FROM `usuarios` WHERE `id` = ?', [id], 'dbusuarios');
    
    if (result.success) {
      if (result.data.affectedRows > 0) {
        res.json({
          success: true,
          message: 'Usuário deletado com sucesso',
          data: { id, affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar usuário',
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

// GET - Buscar usuários por tipo
router.get('/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    const result = await executeQuery('SELECT * FROM `usuarios` WHERE `tipo` = ?', [tipo], 'dbusuarios');
    
    if (result.success) {
      res.json({
        success: true,
        message: `Usuários do tipo '${tipo}' listados com sucesso`,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários por tipo',
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

// GET - Buscar usuários por status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const result = await executeQuery('SELECT * FROM `usuarios` WHERE `status` = ?', [status], 'dbusuarios');
    
    if (result.success) {
      res.json({
        success: true,
        message: `Usuários com status '${status}' listados com sucesso`,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários por status',
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