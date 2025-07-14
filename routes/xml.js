const express = require('express');
const router = express.Router();
const XMLController = require('../controllers/xmlController');

// Middleware para validar XML
const validateXML = (req, res, next) => {
  const { xml } = req.body;
  
  if (!xml) {
    return res.status(400).json({
      success: false,
      message: 'XML é obrigatório',
      errors: ['Campo xml não pode estar vazio']
    });
  }
  
  if (typeof xml !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'XML deve ser uma string',
      errors: ['Campo xml deve ser do tipo string']
    });
  }
  
  // Verificar se tem conteúdo XML básico
  if (!xml.trim().startsWith('<')) {
    return res.status(400).json({
      success: false,
      message: 'XML inválido',
      errors: ['Conteúdo deve ser um XML válido']
    });
  }
  
  next();
};

// Rotas para XML de NF-e
router.post('/xml-to-json', validateXML, XMLController.parseXMLToJSON);
router.post('/extract-info', validateXML, XMLController.extractNFeInfo);
router.post('/validate-nfe', validateXML, XMLController.validateNFe);

module.exports = router; 