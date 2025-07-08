const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtoController');
const { 
  validateProduto, 
  validateParams, 
  validateQuery 
} = require('../middlewares/validation');

// Rotas para produtos
router.get('/', validateQuery, ProdutoController.getAll);
router.get('/structure', ProdutoController.getStructure);
router.get('/stats', ProdutoController.getStats);
router.get('/search', ProdutoController.search);
router.get('/cnpj-interno/:cnpj_int', validateParams, ProdutoController.getByCNPJInterno);
router.get('/cnpj-fornecedor/:cnpj_forn', validateParams, ProdutoController.getByCNPJFornecedor);
router.get('/codigo-fornecedor/:cod_forn', validateParams, ProdutoController.getByCodigoFornecedor);
router.get('/:cod_int', validateParams, ProdutoController.getById);

router.post('/', validateProduto, ProdutoController.create);

router.put('/:cod_int', validateParams, validateProduto, ProdutoController.update);

router.delete('/:cod_int', validateParams, ProdutoController.delete);

module.exports = router; 