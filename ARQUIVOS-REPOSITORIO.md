# 📁 Guia de Arquivos do Repositório

## ✅ **Arquivos que DEVEM estar no repositório**

### 📋 **Configuração Base**
- `package.json` - Dependências e scripts
- `railway.json` - Configuração do Railway
- `Procfile` - Comando de inicialização
- `env.production` - Template de variáveis de ambiente

### 🔧 **Código da Aplicação**
- `server.js` - Servidor principal
- `config/database.js` - Configuração do banco
- `models/` - Modelos de dados
- `controllers/` - Controladores
- `routes/` - Rotas da API
- `middlewares/` - Middlewares de validação
- `utils/` - Utilitários e validadores
- `scripts/` - Scripts de configuração

### 📚 **Documentação**
- `README.md` - Documentação principal
- `RAILWAY.md` - Guia de deploy
- `railway-vars.txt` - Lista de variáveis
- `estrutura_banco_dados.txt` - Estrutura do banco

### 🗂️ **Estrutura**
- `.gitignore` - Arquivos a ignorar
- `logs/` - Pasta vazia para logs

---

## ❌ **Arquivos que NÃO devem estar no repositório**

### 🔐 **Arquivos Sensíveis**
- `.env` - Variáveis de ambiente locais
- `.env.local` - Configuração local
- `.env.development` - Config desenvolvimento
- `.env.staging` - Config staging

### 🔑 **Certificados e Chaves**
- `*.pem`, `*.key`, `*.cert` - Certificados SSL
- `*.p12`, `*.pfx` - Certificados
- `config/credentials.json` - Credenciais privadas

### 📊 **Logs e Dados**
- `logs/*.log` - Arquivos de log
- `error.log`, `combined.log` - Logs específicos
- `*.db`, `*.sqlite` - Bancos locais

### 🧪 **Arquivos Temporários**
- `test-*.js` - Scripts de teste temporários
- `temp-*.js` - Arquivos temporários
- `debug/`, `dumps/` - Arquivos de debug

### 🚂 **Railway CLI**
- `.railway/` - Configuração local Railway
- `railway-*.log` - Logs do Railway
- `.railway-*` - Artifacts de deploy

### 🛠️ **Build e Cache**
- `node_modules/` - Dependências instaladas
- `build/`, `dist/`, `out/` - Outputs de build
- `.cache/`, `.parcel-cache/` - Cache

---

## 🔍 **Como Verificar**

### Listar arquivos ignorados:
```bash
git status --ignored
```

### Ver o que está sendo trackado:
```bash
git ls-files
```

### Verificar se arquivo específico está ignorado:
```bash
git check-ignore arquivo.txt
```

---

## 📋 **Checklist antes do Commit**

- [ ] ✅ Não há arquivos `.env*` (exceto `env.production`)
- [ ] ✅ Não há logs `*.log` 
- [ ] ✅ Não há `node_modules/`
- [ ] ✅ Não há certificados `*.pem`, `*.key`
- [ ] ✅ Não há arquivos temporários `test-*.js`
- [ ] ✅ `.gitignore` está atualizado

---

## 🚨 **Se Você Commitou Algo por Engano**

### Remover arquivo do histórico:
```bash
git rm --cached arquivo-sensivel.env
git commit -m "Remove arquivo sensível"
```

### Limpar histórico (cuidado!):
```bash
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch arquivo-sensivel.env' \
--prune-empty --tag-name-filter cat -- --all
```

---

## 💡 **Dicas**

1. **Sempre revisar** `git diff` antes do commit
2. **Usar aliases** para verificações rápidas:
   ```bash
   git config --global alias.ignored "status --ignored"
   ```
3. **Template do commit**:
   ```
   feat: adicionar endpoint de produtos
   
   - Implementar CRUD completo
   - Adicionar validações
   - Atualizar documentação
   ```

---

**🔐 Lembre-se: Segurança primeiro! Nunca commite credenciais.** 