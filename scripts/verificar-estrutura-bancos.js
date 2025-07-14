const mysql = require('mysql2/promise');

// Configuração dos bancos de dados
const config = {
  host: 'mercocamp.ip.odhserver.com',
  port: 33101,
  user: 'projetos',
  password: 'masterkey'
};

async function testConnection(database) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    await connection.ping();
    await connection.end();
    return true;
  } catch (error) {
    console.error(`Erro ao conectar com ${database}:`, error.message);
    return false;
  }
}

async function getTables(database) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    
    const [rows] = await connection.execute('SHOW TABLES');
    await connection.end();
    
    return rows.map(row => Object.values(row)[0]);
  } catch (error) {
    console.error(`Erro ao listar tabelas de ${database}:`, error.message);
    return [];
  }
}

async function getTableStructure(database, table) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    
    const [rows] = await connection.execute(`DESCRIBE \`${table}\``);
    await connection.end();
    
    return rows;
  } catch (error) {
    console.error(`Erro ao obter estrutura da tabela ${table} em ${database}:`, error.message);
    return [];
  }
}

async function getTableData(database, table, limit = 5) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    
    const [rows] = await connection.execute(`SELECT * FROM \`${table}\` LIMIT ${limit}`);
    await connection.end();
    
    return rows;
  } catch (error) {
    console.error(`Erro ao obter dados da tabela ${table} em ${database}:`, error.message);
    return [];
  }
}

async function verificarEstruturaCompleta() {
  console.log('🔍 Verificando estrutura dos bancos de dados...\n');
  
  const resultado = {};
  const databases = ['dbrecebimento', 'dbusuarios', 'dbmercocamp'];
  
  for (const database of databases) {
    console.log(`📊 Verificando banco: ${database}`);
    
    // Testar conexão
    const conectado = await testConnection(database);
    if (!conectado) {
      console.log(`❌ Falha na conexão com ${database}`);
      resultado[database] = { conectado: false, tabelas: [] };
      continue;
    }
    
    console.log(`✅ Conexão com ${database} OK`);
    
    // Listar tabelas
    const tabelas = await getTables(database);
    console.log(`📋 Tabelas encontradas: ${tabelas.length}`);
    
    resultado[database] = {
      conectado: true,
      tabelas: []
    };
    
    // Verificar estrutura de cada tabela
    for (const tabela of tabelas) {
      console.log(`  📝 Verificando tabela: ${tabela}`);
      
      const estrutura = await getTableStructure(database, tabela);
      const dados = await getTableData(database, tabela, 3);
      
      resultado[database].tabelas.push({
        nome: tabela,
        estrutura: estrutura,
        dados_exemplo: dados,
        total_campos: estrutura.length
      });
    }
    
    console.log(`✅ Banco ${database} verificado com ${tabelas.length} tabelas\n`);
  }
  
  return resultado;
}

async function gerarDocumentacao() {
  const estrutura = await verificarEstruturaCompleta();
  
  let documentacao = `# DOCUMENTAÇÃO DOS BANCOS DE DADOS
# ====================================================================
# ESTRUTURA DAS TABELAS E EXEMPLOS DE REQUISIÇÕES
# ====================================================================

Data da verificação: ${new Date().toLocaleString('pt-BR')}
Servidor: ${config.host}:${config.port}
Usuário: ${config.user}

`;

  for (const [database, info] of Object.entries(estrutura)) {
    documentacao += `\n## 📊 BANCO: ${database.toUpperCase()}
Status: ${info.conectado ? '✅ Conectado' : '❌ Desconectado'}

`;
    
    if (!info.conectado) {
      documentacao += `**Erro:** Não foi possível conectar ao banco ${database}\n\n`;
      continue;
    }
    
    documentacao += `**Total de tabelas:** ${info.tabelas.length}\n\n`;
    
    if (info.tabelas.length === 0) {
      documentacao += `**Observação:** Nenhuma tabela encontrada neste banco.\n\n`;
      continue;
    }
    
    for (const tabela of info.tabelas) {
      documentacao += `### 📋 TABELA: ${tabela.nome}
**Campos:** ${tabela.total_campos}

#### Estrutura da Tabela:
\`\`\`
`;
      
      for (const campo of tabela.estrutura) {
        const nullStr = campo.Null === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultStr = campo.Default !== null ? `DEFAULT ${campo.Default}` : '';
        documentacao += `${campo.Field.padEnd(20)} ${campo.Type.padEnd(20)} ${nullStr.padEnd(10)} ${defaultStr}\n`;
      }
      
      documentacao += `\`\`\`

#### Requisições Disponíveis:

**1. Listar todos os registros:**
\`\`\`http
GET /api/database/query/${database}?sql=SELECT * FROM \`${tabela.nome}\`
\`\`\`

**2. Contar total de registros:**
\`\`\`http
GET /api/database/query/${database}?sql=SELECT COUNT(*) as total FROM \`${tabela.nome}\`
\`\`\`

**3. Buscar por ID (se existir campo id):**
\`\`\`http
GET /api/database/query/${database}?sql=SELECT * FROM \`${tabela.nome}\` WHERE id = 1
\`\`\`

**4. Limitar resultados:**
\`\`\`http
GET /api/database/query/${database}?sql=SELECT * FROM \`${tabela.nome}\` LIMIT 10
\`\`\`

**5. Ordenar resultados:**
\`\`\`http
GET /api/database/query/${database}?sql=SELECT * FROM \`${tabela.nome}\` ORDER BY id DESC LIMIT 10
\`\`\`

#### Exemplo de Resposta:
\`\`\`json
{
  "success": true,
  "message": "Query executada com sucesso",
  "database": "${database}",
  "data": [
    ${JSON.stringify(tabela.dados_exemplo[0] || {}, null, 2).replace(/\n/g, '\n    ')}
  ],
  "count": ${tabela.dados_exemplo.length}
}
\`\`\`

#### Dados de Exemplo:
\`\`\`json
${JSON.stringify(tabela.dados_exemplo, null, 2)}
\`\`\`

---
`;
    }
  }
  
  // Adicionar informações gerais sobre as rotas
  documentacao += `\n## 🌐 ROTAS DISPONÍVEIS

### Teste de Conexões
\`\`\`http
GET /api/database/test-all
\`\`\`

### Informações dos Bancos
\`\`\`http
GET /api/database/info
\`\`\`

### Teste de Banco Específico
\`\`\`http
GET /api/database/test/dbrecebimento
GET /api/database/test/dbusuarios
GET /api/database/test/dbmercocamp
\`\`\`

### Listar Tabelas de um Banco
\`\`\`http
GET /api/database/tabelas/dbrecebimento
GET /api/database/tabelas/dbusuarios
GET /api/database/tabelas/dbmercocamp
\`\`\`

### Estrutura de uma Tabela
\`\`\`http
GET /api/database/estrutura/dbrecebimento/nome_da_tabela
GET /api/database/estrutura/dbusuarios/nome_da_tabela
GET /api/database/estrutura/dbmercocamp/nome_da_tabela
\`\`\`

### Executar Query Personalizada
\`\`\`http
GET /api/database/query/dbrecebimento?sql=SELECT * FROM tabela WHERE campo = 'valor'
\`\`\`

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Segurança:** Apenas queries SELECT são permitidas via API
2. **Limite:** Recomenda-se usar LIMIT nas consultas para evitar sobrecarga
3. **Performance:** Use índices apropriados para consultas frequentes
4. **Backup:** Sempre faça backup antes de alterações estruturais
5. **Monitoramento:** Monitore o uso das APIs para otimização

## 🔧 CONFIGURAÇÃO

**Host:** ${config.host}
**Porta:** ${config.port}
**Usuário:** ${config.user}
**Bancos:** dbrecebimento, dbusuarios, dbmercocamp

## 📊 RESUMO DOS BANCOS

`;

  for (const [database, info] of Object.entries(estrutura)) {
    const status = info.conectado ? '✅' : '❌';
    const tabelas = info.tabelas.length;
    documentacao += `- **${database}:** ${status} ${tabelas} tabelas\n`;
  }
  
  return documentacao;
}

// Executar verificação
async function main() {
  try {
    console.log('🚀 Iniciando verificação da estrutura dos bancos...\n');
    
    const documentacao = await gerarDocumentacao();
    
    // Salvar documentação em arquivo
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, '..', 'ESTRUTURA_BANCOS_DADOS.md');
    fs.writeFileSync(outputPath, documentacao, 'utf8');
    
    console.log(`\n✅ Documentação gerada com sucesso!`);
    console.log(`📄 Arquivo salvo em: ${outputPath}`);
    console.log(`\n📊 Resumo da verificação:`);
    
    for (const [database, info] of Object.entries(await verificarEstruturaCompleta())) {
      const status = info.conectado ? '✅' : '❌';
      console.log(`${status} ${database}: ${info.tabelas.length} tabelas`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  verificarEstruturaCompleta,
  gerarDocumentacao
}; 