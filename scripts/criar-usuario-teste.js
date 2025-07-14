const { executeQuery } = require('../config/database');

// Função para criar usuário de teste
async function criarUsuarioTeste() {
  try {
    console.log('👤 Criando usuário de teste...');
    
    // Dados do usuário de teste
    const usuarioTeste = {
      usuario: 'admin',
      senha: '123456',
      nivel_acesso: 1,
      cnpj: JSON.stringify({
        numero: '12345678000199',
        razao_social: 'EMPRESA TESTE LTDA',
        nome_fantasia: 'TESTE LTDA',
        inscricao_estadual: '123456789',
        endereco: {
          logradouro: 'Rua Teste',
          numero: '123',
          complemento: 'Sala 1',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01234-567'
        }
      })
    };
    
    // Verificar se o usuário já existe
    const checkResult = await executeQuery(
      'SELECT * FROM `usuarios` WHERE `usuario` = ?',
      [usuarioTeste.usuario],
      'dbusuarios'
    );
    
    if (checkResult.success && checkResult.data.length > 0) {
      console.log('⚠️  Usuário já existe. Atualizando dados...');
      
      // Atualizar usuário existente
      const updateResult = await executeQuery(
        'UPDATE `usuarios` SET `senha` = ?, `nivel_acesso` = ?, `cnpj` = ? WHERE `usuario` = ?',
        [usuarioTeste.senha, usuarioTeste.nivel_acesso, usuarioTeste.cnpj, usuarioTeste.usuario],
        'dbusuarios'
      );
      
      if (updateResult.success) {
        console.log('✅ Usuário atualizado com sucesso!');
        console.log('📊 Dados do usuário:');
        console.log(`  - Usuário: ${usuarioTeste.usuario}`);
        console.log(`  - Senha: ${usuarioTeste.senha}`);
        console.log(`  - Nível de Acesso: ${usuarioTeste.nivel_acesso}`);
        console.log(`  - CNPJ: ${usuarioTeste.cnpj}`);
      } else {
        console.log('❌ Erro ao atualizar usuário:', updateResult.error);
      }
    } else {
      console.log('📝 Inserindo novo usuário...');
      
      // Inserir novo usuário
      const insertResult = await executeQuery(
        'INSERT INTO `usuarios` (`usuario`, `senha`, `nivel_acesso`, `cnpj`) VALUES (?, ?, ?, ?)',
        [usuarioTeste.usuario, usuarioTeste.senha, usuarioTeste.nivel_acesso, usuarioTeste.cnpj],
        'dbusuarios'
      );
      
      if (insertResult.success) {
        console.log('✅ Usuário criado com sucesso!');
        console.log('📊 Dados do usuário:');
        console.log(`  - Usuário: ${usuarioTeste.usuario}`);
        console.log(`  - Senha: ${usuarioTeste.senha}`);
        console.log(`  - Nível de Acesso: ${usuarioTeste.nivel_acesso}`);
        console.log(`  - CNPJ: ${usuarioTeste.cnpj}`);
      } else {
        console.log('❌ Erro ao criar usuário:', insertResult.error);
      }
    }
    
    // Verificar usuário criado
    console.log('\n🔍 Verificando usuário criado...');
    const verifyResult = await executeQuery(
      'SELECT * FROM `usuarios` WHERE `usuario` = ?',
      [usuarioTeste.usuario],
      'dbusuarios'
    );
    
    if (verifyResult.success && verifyResult.data.length > 0) {
      console.log('✅ Usuário verificado com sucesso!');
      console.log('📋 Dados completos:');
      console.log(JSON.stringify(verifyResult.data[0], null, 2));
    } else {
      console.log('❌ Erro ao verificar usuário');
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error.message);
  }
}

// Função para listar todos os usuários
async function listarUsuarios() {
  try {
    console.log('\n👥 Listando todos os usuários...');
    
    const result = await executeQuery('SELECT * FROM `usuarios`', [], 'dbusuarios');
    
    if (result.success) {
      console.log(`📊 Total de usuários: ${result.data.length}`);
      
      if (result.data.length > 0) {
        console.log('📋 Usuários encontrados:');
        result.data.forEach((usuario, index) => {
          console.log(`\n  ${index + 1}. Usuário: ${usuario.usuario}`);
          console.log(`     Senha: ${usuario.senha}`);
          console.log(`     Nível: ${usuario.nivel_acesso}`);
          console.log(`     CNPJ: ${usuario.cnpj}`);
        });
      } else {
        console.log('📝 Nenhum usuário encontrado');
      }
    } else {
      console.log('❌ Erro ao listar usuários:', result.error);
    }
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error.message);
  }
}

// Função para limpar usuários de teste
async function limparUsuariosTeste() {
  try {
    console.log('\n🧹 Limpando usuários de teste...');
    
    const result = await executeQuery(
      'DELETE FROM `usuarios` WHERE `usuario` LIKE "%teste%" OR `usuario` = "admin"',
      [],
      'dbusuarios'
    );
    
    if (result.success) {
      console.log(`✅ ${result.data.affectedRows} usuário(s) removido(s)`);
    } else {
      console.log('❌ Erro ao limpar usuários:', result.error);
    }
  } catch (error) {
    console.error('❌ Erro ao limpar usuários:', error.message);
  }
}

// Função principal
async function main() {
  try {
    console.log('👤 SCRIPT DE CRIAÇÃO DE USUÁRIO DE TESTE');
    console.log('='.repeat(50));
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    const comando = args[0];
    
    switch (comando) {
      case 'criar':
        await criarUsuarioTeste();
        break;
      case 'listar':
        await listarUsuarios();
        break;
      case 'limpar':
        await limparUsuariosTeste();
        break;
      case 'tudo':
        await criarUsuarioTeste();
        await listarUsuarios();
        break;
      default:
        console.log('📋 Comandos disponíveis:');
        console.log('  node scripts/criar-usuario-teste.js criar  - Criar usuário de teste');
        console.log('  node scripts/criar-usuario-teste.js listar - Listar todos os usuários');
        console.log('  node scripts/criar-usuario-teste.js limpar - Limpar usuários de teste');
        console.log('  node scripts/criar-usuario-teste.js tudo   - Criar usuário e listar');
        break;
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  criarUsuarioTeste,
  listarUsuarios,
  limparUsuariosTeste
}; 