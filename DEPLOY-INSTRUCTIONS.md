# 🚀 Instruções de Deploy - Railway

## 📋 **Repositório GitHub**
✅ **Código disponível em**: https://github.com/alertseapt/agenda-mercocamp-att

## 🚂 **Deploy Automático no Railway**

### 1. **Conectar Repositório**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha: `alertseapt/agenda-mercocamp-att`

### 2. **Configurar Variáveis de Ambiente**
No painel Railway, adicione estas variáveis:

```env
DB_HOST=mercocamp.ip.odhserver.com
DB_PORT=33101
DB_USER=projetos
DB_PASSWORD=masterkey
DB_NAME=dbrecebimento
NODE_ENV=production
API_RATE_LIMIT=100
LOG_LEVEL=info
JWT_SECRET=MercoCamp2024SecretKeyForJWTTokensVerySecureAndLong
```

### 3. **Deploy Será Automático**
- Railway detectará Node.js automaticamente
- Usará `npm start` como comando de inicialização
- Health check configurado em `/health`
- Auto-restart em falhas

### 4. **Verificar Deploy**
Após deploy, sua API estará disponível em:
- **URL**: `https://seu-app.railway.app`
- **Health Check**: `https://seu-app.railway.app/health`
- **Documentação**: `https://seu-app.railway.app/`

### 5. **Endpoints Principais**
```
GET  /health                    - Status da API
GET  /                         - Documentação
GET  /table/agendamento        - Listar agendamentos
POST /table/agendamento        - Criar agendamento
GET  /table/produtos           - Listar produtos
POST /table/produtos           - Criar produto
```

## 🔄 **Atualizações Futuras**

Para atualizar o código:
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

Railway fará redeploy automático a cada push.

## 📊 **Monitoramento**

Railway fornece:
- 📈 Métricas em tempo real
- 📋 Logs da aplicação
- 🔄 Auto-restart
- 📱 Notificações

---

## ✅ **Checklist de Deploy**

- [x] ✅ Código no GitHub
- [ ] 🚂 Conectar ao Railway
- [ ] ⚙️ Configurar variáveis
- [ ] 🧪 Testar endpoints
- [ ] 📊 Verificar logs

**🎉 Seu backend está pronto para produção!** 