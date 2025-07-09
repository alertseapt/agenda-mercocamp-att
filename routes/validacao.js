const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { cleanCNPJ } = require('../utils/validators');

// Rota para validar CNPJ em múltiplos bancos e associado a um usuário
router.post('/cnpj', async (req, res) => {
  try {
    const { cnpj, usuario } = req.body;
    
    if (!cnpj || !usuario) {
      return res.status(400).json({
        success: false,
        message: 'Os parâmetros `cnpj` e `usuario` são obrigatórios'
      });
    }

    const cnpjLimpo = cleanCNPJ(cnpj);
    let response = {
      cnpj_consultado: cnpj,
      usuario_consultado: usuario,
      cliente_encontrado: false,
      usuario_encontrado: false,
      cnpj_associado_ao_usuario: false,
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
    const usuarioResult = await executeQuery(
      "SELECT * FROM `usuarios` WHERE `usuario` = ?",
      [usuario],
      'dbusuarios'
    );
    
    if (usuarioResult.success && usuarioResult.data.length > 0) {
      response.usuario_encontrado = true;
      response.dados_usuario = usuarioResult.data[0]; // Pegar o primeiro usuário encontrado
      
      // Verificar se o CNPJ está associado ao usuário
      try {
        const cnpjsDoUsuario = JSON.parse(response.dados_usuario.cnpj);
        // Verifica se o CNPJ limpo existe como uma CHAVE no objeto JSON
        if (cnpjsDoUsuario && cnpjsDoUsuario.hasOwnProperty(cnpjLimpo)) {
            response.cnpj_associado_ao_usuario = true;
        }
      } catch (e) {
        // O campo cnpj pode não ser um JSON válido ou pode ser nulo.
        // Apenas ignoramos o erro e mantemos cnpj_associado_ao_usuario como false.
        console.error('Erro ao fazer parse do JSON de CNPJ:', e.message);
      }
    }

    if (response.cliente_encontrado || response.usuario_encontrado) {
      res.json({
        success: true,
        message: 'Validação de CNPJ e usuário concluída.',
        data: response
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'CNPJ ou usuário não encontrados.',
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