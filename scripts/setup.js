#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando setup do projeto Mercocamp Backend...\n');

// Função para criar diretório se não existir
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Diretório criado: ${dirPath}`);
  } else {
    console.log(`✅ Diretório já existe: ${dirPath}`);
  }
}

// Função para copiar arquivo se não existir
function copyFileIfNotExists(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.copyFileSync(source, destination);
    console.log(`📄 Arquivo copiado: ${destination}`);
  } else {
    console.log(`✅ Arquivo já existe: ${destination}`);
  }
}

try {
  // 1. Criar diretório de logs
  console.log('📋 Etapa 1: Criando diretórios necessários...');
  createDirIfNotExists('./logs');
  
  // 2. Configuração automática
  console.log('\n📋 Etapa 2: Configuração automática (credenciais já inseridas)...');
  console.log('✅ Credenciais do banco de dados configuradas diretamente no código');
  
  // 3. Verificar se package.json existe
  console.log('\n📋 Etapa 3: Verificando dependências...');
  if (!fs.existsSync('./package.json')) {
    console.log('❌ package.json não encontrado!');
    process.exit(1);
  }
  
  // 4. Instalar dependências
  console.log('\n📋 Etapa 4: Instalando dependências do Node.js...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com sucesso!');
  } catch (error) {
    console.log('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
  }
  
  // 5. Verificar estrutura do projeto
  console.log('\n📋 Etapa 5: Verificando estrutura do projeto...');
  const requiredDirs = ['config', 'controllers', 'middlewares', 'models', 'routes', 'utils'];
  let allDirsExist = true;
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - FALTANDO`);
      allDirsExist = false;
    }
  });
  
  if (!allDirsExist) {
    console.log('\n❌ Estrutura do projeto incompleta!');
    process.exit(1);
  }
  
  // 6. Informações finais
  console.log('\n🎉 Setup concluído com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Execute: npm run dev (para desenvolvimento)');
  console.log('   2. Execute: npm start (para produção)');
  console.log('   3. Acesse: http://localhost:3000');
  
  console.log('\n🔧 Configurações:');
  console.log('   • ✅ Credenciais do banco já configuradas');
  console.log('   • ✅ Porta: 3000');
  console.log('   • ✅ Logs habilitados');
  
  console.log('\n📚 Documentação:');
  console.log('   • README.md - Instruções completas');
  console.log('   • GET / - Documentação da API');
  console.log('   • GET /health - Status da aplicação');
  
  console.log('\n✨ Projeto Mercocamp Backend v3.1.0 pronto para uso!');
  
} catch (error) {
  console.error('❌ Erro durante o setup:', error.message);
  process.exit(1);
} 