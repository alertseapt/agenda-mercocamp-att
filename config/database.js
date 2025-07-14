const mysql = require('mysql2/promise');
require('dotenv').config();

// Configurações dos bancos de dados
const dbConfigs = {
  dbrecebimento: {
    host: process.env.DB_HOST || 'mercocamp.ip.odhserver.com',
    port: process.env.DB_PORT || 33101,
    user: process.env.DB_USER || 'projetos',
    password: process.env.DB_PASSWORD || 'masterkey',
    database: process.env.DB_NAME || 'dbrecebimento',
    charset: 'utf8mb4',
    timezone: 'Z'
  },
  dbusuarios: {
    host: process.env.DB_HOST || 'mercocamp.ip.odhserver.com',
    port: process.env.DB_PORT || 33101,
    user: process.env.DB_USER || 'projetos',
    password: process.env.DB_PASSWORD || 'masterkey',
    database: 'dbusuarios',
    charset: 'utf8mb4',
    timezone: 'Z'
  },
  dbmercocamp: {
    host: process.env.DB_HOST || 'mercocamp.ip.odhserver.com',
    port: process.env.DB_PORT || 33101,
    user: process.env.DB_USER || 'projetos',
    password: process.env.DB_PASSWORD || 'masterkey',
    database: 'dbmercocamp',
    charset: 'utf8mb4',
    timezone: 'Z'
  }
};

// Pools de conexões para cada banco
const pools = {};

// Criar pools para cada banco de dados
Object.keys(dbConfigs).forEach(dbName => {
  pools[dbName] = mysql.createPool({
    ...dbConfigs[dbName],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
  });
});

// Função para testar conexão com um banco específico
async function testConnection(dbName = 'dbrecebimento') {
  try {
    const pool = pools[dbName];
    if (!pool) {
      throw new Error(`Banco de dados '${dbName}' não configurado`);
    }
    
    const connection = await pool.getConnection();
    console.log(`✅ Conexão com banco de dados '${dbName}' estabelecida com sucesso!`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`❌ Erro ao conectar com o banco de dados '${dbName}':`, error.message);
    return false;
  }
}

// Função para testar todas as conexões
async function testAllConnections() {
  const results = {};
  for (const dbName of Object.keys(dbConfigs)) {
    results[dbName] = await testConnection(dbName);
  }
  return results;
}

// Função para executar queries em um banco específico
async function executeQuery(query, params = [], dbName = 'dbrecebimento') {
  try {
    const pool = pools[dbName];
    if (!pool) {
      throw new Error(`Banco de dados '${dbName}' não configurado`);
    }
    
    const [rows] = await pool.execute(query, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error(`Erro na query no banco '${dbName}':`, error.message);
    return { success: false, error: error.message };
  }
}

// Função para executar transações em um banco específico
async function executeTransaction(queries, dbName = 'dbrecebimento') {
  const pool = pools[dbName];
  if (!pool) {
    throw new Error(`Banco de dados '${dbName}' não configurado`);
  }
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows);
    }
    
    await connection.commit();
    return { success: true, data: results };
  } catch (error) {
    await connection.rollback();
    console.error(`Erro na transação no banco '${dbName}':`, error.message);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}

// Função para obter pool de um banco específico
function getPool(dbName = 'dbrecebimento') {
  return pools[dbName];
}

module.exports = {
  pools,
  testConnection,
  testAllConnections,
  executeQuery,
  executeTransaction,
  getPool,
  dbConfigs
}; 