const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
require('dotenv').config();
const { testConnection } = require('./config/database');

// Configurar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Importar rotas
const agendamentoRoutes = require('./routes/agendamento');
const produtoRoutes = require('./routes/produto');
const xmlRoutes = require('./routes/xml');
const usuariosRoutes = require('./routes/usuarios');
const mercocampRoutes = require('./routes/mercocamp');
const databaseRoutes = require('./routes/database');
const validacaoRoutes = require('./routes/validacao');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.API_RATE_LIMIT || 100,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.RAILWAY_PUBLIC_DOMAIN, /\.railway\.app$/]
    : true,
  credentials: true
}));
app.use(limiter);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Middleware de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    version: '3.1.0'
  });
});

// Middleware para informações da API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API CRUD Mercocamp v3.2.0',
    endpoints: {
      agendamento: '/table/agendamento',
      produtos: '/table/produtos',
      xml: '/parse',
      usuarios: '/usuarios',
      mercocamp: '/mercocamp',
      database: '/database',
      health: '/health',
      debug: '/debug'
    },
    documentation: {
      agendamento: {
        'GET /table/agendamento': 'Listar agendamentos',
        'GET /table/agendamento/:id': 'Buscar agendamento por ID',
        'POST /table/agendamento': 'Criar novo agendamento',
        'PUT /table/agendamento/:id': 'Atualizar agendamento',
        'DELETE /table/agendamento/:id': 'Deletar agendamento'
      },
      produtos: {
        'GET /table/produtos': 'Listar produtos',
        'GET /table/produtos/:cod_int': 'Buscar produto por código',
        'POST /table/produtos': 'Criar novo produto',
        'PUT /table/produtos/:cod_int': 'Atualizar produto',
        'DELETE /table/produtos/:cod_int': 'Deletar produto'
      },
      xml: {
        'POST /parse/xml-to-json': 'Converter XML de NF-e para JSON',
        'POST /parse/extract-info': 'Extrair informações específicas da NF-e',
        'POST /parse/validate-nfe': 'Validar se XML é uma NF-e válida'
      },
      usuarios: {
        'POST /usuarios/login': 'Login de usuário (usuario, senha)',
        'GET /usuarios': 'Listar usuários (dbusuarios)',
        'GET /usuarios/:id': 'Buscar usuário por ID',
        'POST /usuarios': 'Criar novo usuário',
        'PUT /usuarios/:id': 'Atualizar usuário',
        'DELETE /usuarios/:id': 'Deletar usuário',
        'GET /usuarios/tipo/:tipo': 'Buscar usuários por tipo',
        'GET /usuarios/status/:status': 'Buscar usuários por status'
      },
      mercocamp: {
        'GET /mercocamp/tabelas': 'Listar tabelas do dbmercocamp',
        'GET /mercocamp/tabela/:nome': 'Listar dados de uma tabela',
        'GET /mercocamp/tabela/:nome/:id': 'Buscar registro por ID',
        'POST /mercocamp/tabela/:nome': 'Inserir dados em uma tabela',
        'PUT /mercocamp/tabela/:nome/:id': 'Atualizar dados em uma tabela',
        'DELETE /mercocamp/tabela/:nome/:id': 'Deletar registro de uma tabela',
        'GET /mercocamp/query': 'Executar query personalizada (SELECT)',
        'GET /mercocamp/tabela/:nome/estrutura': 'Estrutura de uma tabela',
        'GET /mercocamp/tabela/:nome/contar': 'Contar registros de uma tabela'
      },
      database: {
        'GET /database/test-all': 'Testar todas as conexões',
        'GET /database/test/:banco': 'Testar conexão específica',
        'GET /database/info': 'Informações dos bancos',
        'GET /database/query/:banco': 'Executar query em banco específico',
        'GET /database/tabelas/:banco': 'Listar tabelas de um banco',
        'GET /database/estrutura/:banco/:tabela': 'Estrutura de uma tabela'
      }
    },
    databases: {
      dbrecebimento: 'Banco principal para recebimentos',
      dbusuarios: 'Banco para gerenciamento de usuários',
      dbmercocamp: 'Banco geral do sistema Mercocamp'
    }
  });
});

// Rotas principais
app.use('/table/agendamento', agendamentoRoutes);
app.use('/table/produtos', produtoRoutes);
app.use('/parse', xmlRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/mercocamp', mercocampRoutes);
app.use('/database', databaseRoutes);
app.use('/validar', validacaoRoutes);

// Endpoint de debug
app.get('/debug', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Debug não disponível em produção'
    });
  }
  
  res.json({
    success: true,
    environment: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME
    },
    railway: {
      public_domain: process.env.RAILWAY_PUBLIC_DOMAIN,
      static_url: process.env.RAILWAY_STATIC_URL,
      service_id: process.env.RAILWAY_SERVICE_ID
    },
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Middleware para capturar rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'production' ? 'Contate o administrador' : err.message
  });
});

// Função para iniciar o servidor
async function startServer() {
  try {
    // Testar conexão com banco de dados
    console.log('🔄 Testando conexões com bancos de dados...');
    const { testAllConnections } = require('./config/database');
    const dbResults = await testAllConnections();
    
    const allConnected = Object.values(dbResults).every(result => result === true);
    
    if (!allConnected) {
      console.error('❌ Falha ao conectar com alguns bancos de dados:', dbResults);
      process.exit(1);
    }
    
    console.log('✅ Todas as conexões com bancos de dados estabelecidas!');
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        console.log(`🌐 URL Pública: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
        console.log(`📚 Documentação: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/`);
        console.log(`❤️  Health Check: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/health`);
      } else {
        console.log(`📚 Documentação: http://localhost:${PORT}/`);
        console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
      }
      
      logger.info(`Servidor iniciado na porta ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

// Tratar erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar o servidor
startServer();

module.exports = app; 