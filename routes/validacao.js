const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { cleanCNPJ } = require('../utils/validators');

// Rota para validar CNPJ em múltiplos bancos
router.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    
    if (!cnpj) {
      return res.status(400).json({
        success: false,
        message: 'O parâmetro cnpj é obrigatório'
      });
    }

    const cnpjLimpo = cleanCNPJ(cnpj);
    let response = {
      cnpj_consultado: cnpj,
      cliente_encontrado: false,
      usuario_associado: false,
      dados_cliente: null,
      dados_usuario: null
    };

    // 1. Verificar na tabela de clientes (wcl)
    const clienteResult = await executeQuery(
      `SELECT * FROM \`wcl\` WHERE REPLACE(REPLACE(REPLACE(\`cnpj_cpf\`, '.', ''), '-', ''), '/', '') = ?`,
      [cnpjLimpo],
      'dbmercocamp'
    );

    if (clienteResult.success && clienteResult.data.length > 0) {
      response.cliente_encontrado = true;
      response.dados_cliente = clienteResult.data;
    }

    // 2. Verificar na tabela de usuários (usuarios)
    // Usamos JSON_EXTRACT para buscar dentro do campo JSON
    const usuarioResult = await executeQuery(
      "SELECT * FROM `usuarios` WHERE JSON_EXTRACT(cnpj, '$.numero') = ?",
      [cnpjLimpo],
      'dbusuarios'
    );
    
    if (usuarioResult.success && usuarioResult.data.length > 0) {
      response.usuario_associado = true;
      response.dados_usuario = usuarioResult.data;
    }

    if (response.cliente_encontrado || response.usuario_associado) {
      res.json({
        success: true,
        message: 'Validação de CNPJ concluída.',
        data: response
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'CNPJ não encontrado em nenhuma das bases de dados.',
        data: response
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor durante a validação.',
      error: error.message
    });
  }
});

module.exports = router; 