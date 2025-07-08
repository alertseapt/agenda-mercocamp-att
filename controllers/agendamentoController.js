const AgendamentoModel = require('../models/agendamento');

class AgendamentoController {
  
  // Listar agendamentos
  static async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit,
        offset: req.query.offset,
        status: req.query.status,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim,
        cli: req.query.cli ? parseInt(req.query.cli) : undefined
      };
      
      const result = await AgendamentoModel.getAll(filters);
      
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
          message: 'Erro ao buscar agendamentos',
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
  
  // Obter agendamento por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await AgendamentoModel.getById(id);
      
      if (result.success) {
        if (result.data.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Agendamento não encontrado'
          });
        }
        
        res.json({
          success: true,
          data: result.data[0]
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar agendamento',
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
  
  // Criar agendamento
  static async create(req, res) {
    try {
      const data = req.body;
      
      // Verificar se ID já existe
      if (data.ID) {
        const exists = await AgendamentoModel.exists(data.ID);
        if (exists) {
          return res.status(400).json({
            success: false,
            message: 'ID já existe'
          });
        }
      }
      
      // Se NUM não foi fornecido, gerar automaticamente
      if (!data.NUM) {
        data.NUM = await AgendamentoModel.getNextNum();
      }
      
      const result = await AgendamentoModel.create(data);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Agendamento criado com sucesso',
          data: { insertId: result.data.insertId }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao criar agendamento',
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
  
  // Atualizar agendamento
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      
      // Verificar se agendamento existe
      const exists = await AgendamentoModel.exists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        });
      }
      
      const result = await AgendamentoModel.update(id, data);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Agendamento atualizado com sucesso',
          data: { affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao atualizar agendamento',
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
  
  // Deletar agendamento
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se agendamento existe
      const exists = await AgendamentoModel.exists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        });
      }
      
      const result = await AgendamentoModel.delete(id);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Agendamento deletado com sucesso',
          data: { affectedRows: result.data.affectedRows }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao deletar agendamento',
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
      const result = await AgendamentoModel.getStructure();
      
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
  
  // Buscar por CHNFE
  static async getByCHNFE(req, res) {
    try {
      const { chnfe } = req.params;
      
      const result = await AgendamentoModel.getByCHNFE(chnfe);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar agendamento por CHNFE',
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
  
  // Buscar por cliente
  static async getByCliente(req, res) {
    try {
      const { cli } = req.params;
      
      const result = await AgendamentoModel.getByCliente(parseInt(cli));
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar agendamentos por cliente',
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
      const result = await AgendamentoModel.getStats();
      
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

module.exports = AgendamentoController; 