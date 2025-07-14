const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');
const { 
  validateAgendamento, 
  validateUserId, 
  validateParams, 
  validateQuery 
} = require('../middlewares/validation');

// Rotas para agendamento
router.get('/', validateQuery, AgendamentoController.getAll);
router.get('/structure', AgendamentoController.getStructure);
router.get('/stats', AgendamentoController.getStats);
router.get('/chnfe/:chnfe', validateParams, AgendamentoController.getByCHNFE);
router.get('/cliente/:cli', validateParams, AgendamentoController.getByCliente);
router.get('/:id', validateParams, AgendamentoController.getById);

router.post('/', validateAgendamento, validateUserId, AgendamentoController.create);

router.put('/:id', validateParams, validateAgendamento, validateUserId, AgendamentoController.update);

router.delete('/:id', validateParams, AgendamentoController.delete);

module.exports = router; 