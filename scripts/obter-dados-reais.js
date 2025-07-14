const mysql = require('mysql2/promise');

// Configuração dos bancos de dados
const config = {
  host: 'mercocamp.ip.odhserver.com',
  port: 33101,
  user: 'projetos',
  password: 'masterkey'
};

async function getRealData(database, table, limit = 5) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    
    const [rows] = await connection.execute(`SELECT * FROM \`${table}\` LIMIT ${limit}`);
    await connection.end();
    
    return rows;
  } catch (error) {
    console.error(`Erro ao obter dados de ${table} em ${database}:`, error.message);
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

async function getTableCount(database, table) {
  try {
    const connection = await mysql.createConnection({
      ...config,
      database: database
    });
    
    const [rows] = await connection.execute(`SELECT COUNT(*) as total FROM \`${table}\``);
    await connection.end();
    
    return rows[0].total;
  } catch (error) {
    console.error(`Erro ao contar registros de ${table} em ${database}:`, error.message);
    return 0;
  }
}

async function obterDadosCompletos() {
  console.log('🔍 Obtendo dados reais das tabelas...\n');
  
  const bancos = [
    { nome: 'dbrecebimento', tabelas: ['agendamento', 'produtos'] },
    { nome: 'dbusuarios', tabelas: ['usuarios'] },
    { nome: 'dbmercocamp', tabelas: ['wbx', 'wcl', 'wdq', 'wf1', 'wgu', 'whp', 'wjs', 'wkl', 'wkx', 'wua'] }
  ];
  
  const resultado = {};
  
  for (const banco of bancos) {
    console.log(`📊 Verificando banco: ${banco.nome}`);
    resultado[banco.nome] = { tabelas: [] };
    
    for (const tabela of banco.tabelas) {
      console.log(`  📝 Verificando tabela: ${tabela}`);
      
      const estrutura = await getTableStructure(banco.nome, tabela);
      const dados = await getRealData(banco.nome, tabela, 3);
      const total = await getTableCount(banco.nome, tabela);
      
      resultado[banco.nome].tabelas.push({
        nome: tabela,
        estrutura: estrutura,
        dados_reais: dados,
        total_registros: total,
        tem_dados: dados.length > 0
      });
      
      console.log(`    ✅ ${tabela}: ${total} registros, ${dados.length} exemplos obtidos`);
    }
    
    console.log(`✅ Banco ${banco.nome} verificado\n`);
  }
  
  return resultado;
}

async function atualizarDocumentacao() {
  try {
    console.log('🚀 Atualizando documentação com dados reais...\n');
    
    const dados = await obterDadosCompletos();
    
    let documentacao = `# DOCUMENTAÇÃO ATUALIZADA DOS BANCOS DE DADOS
# ====================================================================
# ESTRUTURA DAS TABELAS E EXEMPLOS DE REQUISIÇÕES COM DADOS REAIS
# ====================================================================

Data da atualização: ${new Date().toLocaleString('pt-BR')}
Servidor: ${config.host}:${config.port}
Usuário: ${config.user}

## 📊 RESUMO GERAL DOS BANCOS

| Banco | Tabelas | Total de Registros | Status |
|-------|---------|-------------------|--------|
`;

    // Calcular totais
    for (const [banco, info] of Object.entries(dados)) {
      const totalRegistros = info.tabelas.reduce((sum, tabela) => sum + tabela.total_registros, 0);
      const tabelasComDados = info.tabelas.filter(t => t.tem_dados).length;
      
      documentacao += `| **${banco}** | ${info.tabelas.length} | ${totalRegistros} | ✅ Conectado |\n`;
    }
    
    documentacao += `\n**Total:** ${Object.keys(dados).length} bancos, ${Object.values(dados).reduce((sum, info) => sum + info.tabelas.length, 0)} tabelas\n\n`;
    
    // Detalhar cada banco
    for (const [banco, info] of Object.entries(dados)) {
      documentacao += `## 📊 BANCO: ${banco.toUpperCase()}\n`;
      documentacao += `Status: ✅ Conectado\n\n`;
      documentacao += `**Total de tabelas:** ${info.tabelas.length}\n\n`;
      
      for (const tabela of info.tabelas) {
        documentacao += `### 📋 TABELA: ${tabela.nome}\n`;
        documentacao += `**Campos:** ${tabela.estrutura.length}\n`;
        documentacao += `**Total de registros:** ${tabela.total_registros}\n`;
        documentacao += `**Tem dados:** ${tabela.tem_dados ? '✅ Sim' : '❌ Não'}\n\n`;
        
        documentacao += `#### Estrutura da Tabela:\n\`\`\`\n`;
        for (const campo of tabela.estrutura) {
          const nullStr = campo.Null === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultStr = campo.Default !== null ? `DEFAULT ${campo.Default}` : '';
          documentacao += `${campo.Field.padEnd(20)} ${campo.Type.padEnd(20)} ${nullStr.padEnd(10)} ${defaultStr}\n`;
        }
        documentacao += `\`\`\`\n\n`;
        
        documentacao += `#### Requisições Disponíveis:\n\n`;
        documentacao += `**1. Listar todos os registros:**\n`;
        documentacao += `\`\`\`http\n`;
        documentacao += `GET /api/database/query/${banco}?sql=SELECT * FROM \`${tabela.nome}\`\n`;
        documentacao += `\`\`\`\n\n`;
        
        documentacao += `**2. Contar total de registros:**\n`;
        documentacao += `\`\`\`http\n`;
        documentacao += `GET /api/database/query/${banco}?sql=SELECT COUNT(*) as total FROM \`${tabela.nome}\`\n`;
        documentacao += `\`\`\`\n\n`;
        
        documentacao += `**3. Limitar resultados:**\n`;
        documentacao += `\`\`\`http\n`;
        documentacao += `GET /api/database/query/${banco}?sql=SELECT * FROM \`${tabela.nome}\` LIMIT 10\n`;
        documentacao += `\`\`\`\n\n`;
        
        if (tabela.tem_dados) {
          documentacao += `#### Exemplo de Resposta com Dados Reais:\n`;
          documentacao += `\`\`\`json\n`;
          documentacao += `{\n`;
          documentacao += `  "success": true,\n`;
          documentacao += `  "message": "Query executada com sucesso",\n`;
          documentacao += `  "database": "${banco}",\n`;
          documentacao += `  "data": ${JSON.stringify(tabela.dados_reais, null, 2)},\n`;
          documentacao += `  "count": ${tabela.dados_reais.length}\n`;
          documentacao += `}\n`;
          documentacao += `\`\`\`\n\n`;
          
          documentacao += `#### Dados Reais da Tabela:\n`;
          documentacao += `\`\`\`json\n`;
          documentacao += `${JSON.stringify(tabela.dados_reais, null, 2)}\n`;
          documentacao += `\`\`\`\n\n`;
        } else {
          documentacao += `#### Exemplo de Resposta (Tabela vazia):\n`;
          documentacao += `\`\`\`json\n`;
          documentacao += `{\n`;
          documentacao += `  "success": true,\n`;
          documentacao += `  "message": "Query executada com sucesso",\n`;
          documentacao += `  "database": "${banco}",\n`;
          documentacao += `  "data": [],\n`;
          documentacao += `  "count": 0\n`;
          documentacao += `}\n`;
          documentacao += `\`\`\`\n\n`;
          
          documentacao += `#### Observação:\n`;
          documentacao += `Esta tabela não possui dados no momento.\n\n`;
        }
        
        documentacao += `---\n\n`;
      }
    }
    
    // Adicionar informações sobre as rotas
    documentacao += `## 🌐 ROTAS DISPONÍVEIS\n\n`;
    documentacao += `### Teste de Conexões\n`;
    documentacao += `\`\`\`http\n`;
    documentacao += `GET /api/database/test-all\n`;
    documentacao += `\`\`\`\n\n`;
    
    documentacao += `### Informações dos Bancos\n`;
    documentacao += `\`\`\`http\n`;
    documentacao += `GET /api/database/info\n`;
    documentacao += `\`\`\`\n\n`;
    
    documentacao += `### Listar Tabelas de um Banco\n`;
    documentacao += `\`\`\`http\n`;
    documentacao += `GET /api/database/tabelas/dbrecebimento\n`;
    documentacao += `GET /api/database/tabelas/dbusuarios\n`;
    documentacao += `GET /api/database/tabelas/dbmercocamp\n`;
    documentacao += `\`\`\`\n\n`;
    
    documentacao += `### Estrutura de uma Tabela\n`;
    documentacao += `\`\`\`http\n`;
    documentacao += `GET /api/database/estrutura/dbrecebimento/agendamento\n`;
    documentacao += `GET /api/database/estrutura/dbusuarios/usuarios\n`;
    documentacao += `GET /api/database/estrutura/dbmercocamp/wbx\n`;
    documentacao += `\`\`\`\n\n`;
    
    documentacao += `### Executar Query Personalizada\n`;
    documentacao += `\`\`\`http\n`;
    documentacao += `GET /api/database/query/dbrecebimento?sql=SELECT * FROM agendamento WHERE STATUS = 'SOLICITADO'\n`;
    documentacao += `GET /api/database/query/dbusuarios?sql=SELECT * FROM usuarios WHERE nivel_acesso = 1\n`;
    documentacao += `GET /api/database/query/dbmercocamp?sql=SELECT * FROM wbx WHERE tipo = 'Entrada' LIMIT 10\n`;
    documentacao += `\`\`\`\n\n`;
    
    documentacao += `## 📊 ESTATÍSTICAS DETALHADAS\n\n`;
    
    for (const [banco, info] of Object.entries(dados)) {
      const totalRegistros = info.tabelas.reduce((sum, tabela) => sum + tabela.total_registros, 0);
      const tabelasComDados = info.tabelas.filter(t => t.tem_dados).length;
      
      documentacao += `### ${banco.toUpperCase()}\n`;
      documentacao += `- **Tabelas:** ${info.tabelas.length}\n`;
      documentacao += `- **Tabelas com dados:** ${tabelasComDados}\n`;
      documentacao += `- **Total de registros:** ${totalRegistros}\n`;
      documentacao += `- **Campos totais:** ${info.tabelas.reduce((sum, tabela) => sum + tabela.estrutura.length, 0)}\n\n`;
      
      for (const tabela of info.tabelas) {
        documentacao += `  - **${tabela.nome}:** ${tabela.total_registros} registros, ${tabela.estrutura.length} campos\n`;
      }
      documentacao += `\n`;
    }
    
    documentacao += `## 📝 OBSERVAÇÕES IMPORTANTES\n\n`;
    documentacao += `1. **Segurança:** Apenas queries SELECT são permitidas via API\n`;
    documentacao += `2. **Limite:** Recomenda-se usar LIMIT nas consultas para evitar sobrecarga\n`;
    documentacao += `3. **Performance:** Use índices apropriados para consultas frequentes\n`;
    documentacao += `4. **Backup:** Sempre faça backup antes de alterações estruturais\n`;
    documentacao += `5. **Monitoramento:** Monitore o uso das APIs para otimização\n`;
    documentacao += `6. **Dados:** Algumas tabelas podem estar vazias ou com poucos dados\n\n`;
    
    documentacao += `## 🔧 CONFIGURAÇÃO\n\n`;
    documentacao += `- **Host:** ${config.host}\n`;
    documentacao += `- **Porta:** ${config.port}\n`;
    documentacao += `- **Usuário:** ${config.user}\n`;
    documentacao += `- **Bancos:** dbrecebimento, dbusuarios, dbmercocamp\n\n`;
    
    // Salvar documentação atualizada
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, '..', 'ESTRUTURA_BANCOS_DADOS_ATUALIZADA.md');
    fs.writeFileSync(outputPath, documentacao, 'utf8');
    
    console.log(`\n✅ Documentação atualizada com dados reais!`);
    console.log(`📄 Arquivo salvo em: ${outputPath}`);
    
    // Resumo final
    console.log(`\n📊 Resumo da atualização:`);
    for (const [banco, info] of Object.entries(dados)) {
      const totalRegistros = info.tabelas.reduce((sum, tabela) => sum + tabela.total_registros, 0);
      const tabelasComDados = info.tabelas.filter(t => t.tem_dados).length;
      console.log(`✅ ${banco}: ${info.tabelas.length} tabelas, ${totalRegistros} registros, ${tabelasComDados} com dados`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante a atualização:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  atualizarDocumentacao();
}

module.exports = {
  obterDadosCompletos,
  atualizarDocumentacao
}; 