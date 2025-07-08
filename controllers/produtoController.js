const ProdutoModel = require('../models/produto');

class ProdutoController {
  
  // Listar produtos
  static async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit,
        offset: req.query.offset,
        cnpj_int: req.query.cnpj_int,
        cnpj_forn: req.query.cnpj_forn,
        cod_forn: req.query.cod_forn
      };
      
      const result = await ProdutoModel.getAll(filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.data.length,
          filters: filters
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produtos',
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
  }
  
  // Obter produto por código interno
  static async getById(req, res) {
    try {
      const { cod_int } = req.params;
      
      const result = await ProdutoModel.getById(cod_int);
      
      if (result.success) {
        if (result.data.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }
        
        res.json({
          success: true,
          data: result.data[0]
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produto',
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
  }
  
  // Criar produto
  static async create(req, res) {
    try {
      const data = req.body;
      
      // Verificar se código interno já existe
      const exists = await ProdutoModel.exists(data.cod_int);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Código interno já existe'
        });
      }
      
      const result = await ProdutoModel.create(data);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Produto criado com sucesso',
          data: { insertId: result.data.insertId }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao criar produto',
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
  }
  
  // Atualizar produto
  static async update(req, res) {
    try {
      const { cod_int } = req.params;
      const data = req.body;
      
      // Verificar se produto existe
      const exists = await ProdutoModel.exists(cod_int);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      const result = await ProdutoModel.update(cod_int, data);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Produto atualizado com sucesso',
          data: { affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao atualizar produto',
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
  }
  
  // Deletar produto
  static async delete(req, res) {
    try {
      const { cod_int } = req.params;
      
      // Verificar se produto existe
      const exists = await ProdutoModel.exists(cod_int);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      const result = await ProdutoModel.delete(cod_int);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Produto deletado com sucesso',
          data: { affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao deletar produto',
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
  }
  
  // Obter estrutura da tabela
  static async getStructure(req, res) {
    try {
      const result = await ProdutoModel.getStructure();
      
      if (result.success) {
        res.json({
          success: true,
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
  }
  
  // Buscar por CNPJ interno
  static async getByCNPJInterno(req, res) {
    try {
      const { cnpj_int } = req.params;
      
      const result = await ProdutoModel.getByCNPJInterno(cnpj_int);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produtos por CNPJ interno',
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
  }
  
  // Buscar por CNPJ fornecedor
  static async getByCNPJFornecedor(req, res) {
    try {
      const { cnpj_forn } = req.params;
      
      const result = await ProdutoModel.getByCNPJFornecedor(cnpj_forn);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produtos por CNPJ fornecedor',
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
  }
  
  // Buscar por código fornecedor
  static async getByCodigoFornecedor(req, res) {
    try {
      const { cod_forn } = req.params;
      
      const result = await ProdutoModel.getByCodigoFornecedor(cod_forn);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produtos por código fornecedor',
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
  }
  
  // Pesquisar produtos
  static async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório'
        });
      }
      
      const result = await ProdutoModel.search(q.trim());
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          query: q
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao pesquisar produtos',
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
  }
  
  // Obter estatísticas
  static async getStats(req, res) {
    try {
      const result = await ProdutoModel.getStats();
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data[0]
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao obter estatísticas',
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
  }
}

module.exports = ProdutoController; 