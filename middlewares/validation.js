const { 
  validateCNPJ, 
  validateDate, 
  validateStatus, 
  validateHistorico, 
  validateCHNFE, 
  validateAgendamentoID, 
  validateProdutoCode,
  sanitizeInput,
  cleanCNPJ
} = require('../utils/validators');

// Middleware para validar dados de agendamento
const validateAgendamento = (req, res, next) => {
  const { ID, NUM, CHNFE, CLI, VOL, DATA, STATUS, HIST } = req.body;
  const errors = [];

  // Validar ID (obrigatório na criação)
  if (req.method === 'POST' && ID) {
    if (!validateAgendamentoID(ID)) {
      errors.push('ID deve conter apenas letras, números, _ ou - e ter no máximo 50 caracteres');
    }
  }

  // Validar NUM (obrigatório)
  if (NUM !== undefined) {
    if (!Number.isInteger(NUM) || NUM < 0 || NUM > 255) {
      errors.push('NUM deve ser um número inteiro entre 0 e 255');
    }
  } else if (req.method === 'POST') {
    errors.push('NUM é obrigatório');
  }

  // Validar CHNFE (obrigatório)
  if (CHNFE !== undefined) {
    if (!validateCHNFE(CHNFE)) {
      errors.push('CHNFE deve conter exatamente 44 dígitos');
    }
  } else if (req.method === 'POST') {
    errors.push('CHNFE é obrigatório');
  }

  // Validar CLI (obrigatório)
  if (CLI !== undefined) {
    if (!Number.isInteger(CLI) || CLI < 0) {
      errors.push('CLI deve ser um número inteiro positivo');
    }
  } else if (req.method === 'POST') {
    errors.push('CLI é obrigatório');
  }

  // Validar VOL (obrigatório)
  if (VOL !== undefined) {
    if (!Number.isInteger(VOL) || VOL < 0) {
      errors.push('VOL deve ser um número inteiro positivo');
    }
  } else if (req.method === 'POST') {
    errors.push('VOL é obrigatório');
  }

  // Validar DATA (obrigatório)
  if (DATA !== undefined) {
    if (!validateDate(DATA)) {
      errors.push('DATA deve estar no formato YYYY-MM-DD');
    }
  } else if (req.method === 'POST') {
    errors.push('DATA é obrigatório');
  }

  // Validar STATUS (obrigatório)
  if (STATUS !== undefined) {
    if (!validateStatus(STATUS)) {
      errors.push('STATUS deve ser ATIVO, INATIVO, CONCLUIDO, PENDENTE ou CANCELADO');
    }
  } else if (req.method === 'POST') {
    errors.push('STATUS é obrigatório');
  }

  // Validar HIST (obrigatório)
  if (HIST !== undefined) {
    if (!validateHistorico(HIST)) {
      errors.push('HIST deve ser um JSON válido com a estrutura correta');
    }
  } else if (req.method === 'POST') {
    errors.push('HIST é obrigatório');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors
    });
  }

  // Sanitizar dados
  if (req.body.ID) req.body.ID = sanitizeInput(req.body.ID);
  if (req.body.STATUS) req.body.STATUS = req.body.STATUS.toUpperCase();

  next();
};

// Middleware para validar dados de produto
const validateProduto = (req, res, next) => {
  const { cod_int, cnpj_int, cod_forn, cnpj_forn } = req.body;
  const errors = [];

  // Validar cod_int (obrigatório)
  if (cod_int !== undefined) {
    if (!validateProdutoCode(cod_int)) {
      errors.push('cod_int deve conter apenas letras, números, _ ou - e ter no máximo 50 caracteres');
    }
  } else if (req.method === 'POST') {
    errors.push('cod_int é obrigatório');
  }

  // Validar cnpj_int (obrigatório)
  if (cnpj_int !== undefined) {
    const cleanedCNPJ = cleanCNPJ(cnpj_int);
    if (!validateCNPJ(cleanedCNPJ)) {
      errors.push('cnpj_int deve ser um CNPJ válido com 14 dígitos');
    }
  } else if (req.method === 'POST') {
    errors.push('cnpj_int é obrigatório');
  }

  // Validar cod_forn (obrigatório)
  if (cod_forn !== undefined) {
    if (!validateProdutoCode(cod_forn)) {
      errors.push('cod_forn deve conter apenas letras, números, _ ou - e ter no máximo 50 caracteres');
    }
  } else if (req.method === 'POST') {
    errors.push('cod_forn é obrigatório');
  }

  // Validar cnpj_forn (obrigatório)
  if (cnpj_forn !== undefined) {
    const cleanedCNPJ = cleanCNPJ(cnpj_forn);
    if (!validateCNPJ(cleanedCNPJ)) {
      errors.push('cnpj_forn deve ser um CNPJ válido com 14 dígitos');
    }
  } else if (req.method === 'POST') {
    errors.push('cnpj_forn é obrigatório');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors
    });
  }

  // Limpar e sanitizar CNPJs
  if (req.body.cnpj_int) req.body.cnpj_int = cleanCNPJ(req.body.cnpj_int);
  if (req.body.cnpj_forn) req.body.cnpj_forn = cleanCNPJ(req.body.cnpj_forn);
  if (req.body.cod_int) req.body.cod_int = sanitizeInput(req.body.cod_int);
  if (req.body.cod_forn) req.body.cod_forn = sanitizeInput(req.body.cod_forn);

  next();
};

// Middleware para validar user_id (necessário para histórico)
const validateUserId = (req, res, next) => {
  const { user_id } = req.body;
  
  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'user_id é obrigatório para operações de agendamento'
    });
  }

  req.body.user_id = sanitizeInput(user_id);
  next();
};

// Middleware para validar parâmetros da URL
const validateParams = (req, res, next) => {
  const { id, cod_int } = req.params;
  
  if (id) {
    if (!validateAgendamentoID(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID do agendamento inválido'
      });
    }
  }
  
  if (cod_int) {
    if (!validateProdutoCode(cod_int)) {
      return res.status(400).json({
        success: false,
        message: 'Código do produto inválido'
      });
    }
  }
  
  next();
};

// Middleware para validar query parameters
const validateQuery = (req, res, next) => {
  const { limit, offset, status, data_inicio, data_fim } = req.query;
  
  // Validar limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Limit deve ser um número entre 1 e 1000'
      });
    }
    req.query.limit = limitNum;
  } else {
    req.query.limit = 100; // Default
  }
  
  // Validar offset
  if (offset !== undefined) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Offset deve ser um número maior ou igual a 0'
      });
    }
    req.query.offset = offsetNum;
  } else {
    req.query.offset = 0; // Default
  }
  
  // Validar status
  if (status !== undefined) {
    if (!validateStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }
    req.query.status = status.toUpperCase();
  }
  
  // Validar datas
  if (data_inicio !== undefined && !validateDate(data_inicio)) {
    return res.status(400).json({
      success: false,
      message: 'data_inicio deve estar no formato YYYY-MM-DD'
    });
  }
  
  if (data_fim !== undefined && !validateDate(data_fim)) {
    return res.status(400).json({
      success: false,
      message: 'data_fim deve estar no formato YYYY-MM-DD'
    });
  }
  
  next();
};

module.exports = {
  validateAgendamento,
  validateProduto,
  validateUserId,
  validateParams,
  validateQuery
}; 