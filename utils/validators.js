const moment = require('moment');

// Função para limpar CNPJ (remover caracteres especiais)
function cleanCNPJ(cnpj) {
  if (!cnpj) return '';
  return cnpj.replace(/[^0-9]/g, '');
}

// Função para validar CNPJ
function validateCNPJ(cnpj) {
  const cleanedCNPJ = cleanCNPJ(cnpj);
  
  if (cleanedCNPJ.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanedCNPJ)) {
    return false;
  }
  
  // Algoritmo de validação do CNPJ
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum1 = 0;
  let sum2 = 0;
  
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(cleanedCNPJ[i]) * weights1[i];
    sum2 += parseInt(cleanedCNPJ[i]) * weights2[i];
  }
  
  const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);
  const digit2 = (sum2 + digit1 * 2) % 11 < 2 ? 0 : 11 - ((sum2 + digit1 * 2) % 11);
  
  return parseInt(cleanedCNPJ[12]) === digit1 && parseInt(cleanedCNPJ[13]) === digit2;
}

// Função para validar data
function validateDate(date) {
  if (!date) return false;
  
  // Verifica formato YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  
  // Verifica se é uma data válida
  const momentDate = moment(date, 'YYYY-MM-DD', true);
  return momentDate.isValid();
}

// Função para validar status
function validateStatus(status) {
  const validStatuses = ['ATIVO', 'INATIVO', 'CONCLUIDO', 'PENDENTE', 'CANCELADO'];
  return validStatuses.includes(status.toUpperCase());
}

// Função para gerar histórico
function generateHistorico(acao, camposAfetados, usuario = 'system') {
  return {
    data: moment().format('YYYY-MM-DD HH:mm:ss'),
    usuario: usuario,
    alteracao: {
      acao: acao.toUpperCase(),
      campos_afetados: camposAfetados
    }
  };
}

// Função para validar e formatar histórico
function validateHistorico(hist) {
  if (!hist) return false;
  
  try {
    // Se for string, tenta fazer parse
    let histObj = typeof hist === 'string' ? JSON.parse(hist) : hist;
    
    // Verifica estrutura básica
    if (!histObj.data || !histObj.usuario || !histObj.alteracao) {
      return false;
    }
    
    // Verifica se a data é válida
    const dataValida = moment(histObj.data, 'YYYY-MM-DD HH:mm:ss', true).isValid();
    
    return dataValida;
  } catch (error) {
    return false;
  }
}

// Função para validar chave NFe (44 dígitos)
function validateCHNFE(chnfe) {
  if (!chnfe) return false;
  
  // Converte para string se for número
  const chnfeStr = chnfe.toString();
  
  // Verifica se tem exatamente 44 dígitos
  return /^\d{44}$/.test(chnfeStr);
}

// Função para validar ID do agendamento
function validateAgendamentoID(id) {
  if (!id || typeof id !== 'string') return false;
  
  // Máximo 50 caracteres
  if (id.length > 50) return false;
  
  // Aceita letras, números e alguns caracteres especiais
  return /^[A-Za-z0-9_-]+$/.test(id);
}

// Função para validar código de produto
function validateProdutoCode(code) {
  if (!code || typeof code !== 'string') return false;
  
  // Máximo 50 caracteres
  if (code.length > 50) return false;
  
  // Aceita letras, números e alguns caracteres especiais
  return /^[A-Za-z0-9_-]+$/.test(code);
}

// Função para sanitizar entrada
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove caracteres perigosos
  return input.trim()
    .replace(/[<>]/g, '')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

module.exports = {
  cleanCNPJ,
  validateCNPJ,
  validateDate,
  validateStatus,
  generateHistorico,
  validateHistorico,
  validateCHNFE,
  validateAgendamentoID,
  validateProdutoCode,
  sanitizeInput
}; 