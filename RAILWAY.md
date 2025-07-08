# 🚂 Deploy no Railway - Mercocamp Backend

## 🎯 Guia Completo de Deploy

### 1. **Preparação**

O projeto já está configurado para Railway com:
- ✅ **railway.json**: Configuração de deploy
- ✅ **Procfile**: Comando de inicialização
- ✅ **Variáveis de ambiente**: Configuração flexível
- ✅ **Health check**: Endpoint `/health`

### 2. **Deploy Automático via GitHub**

1. **Conecte seu repositório ao Railway**:
   - Acesse [railway.app](https://railway.app)
   - Faça login e clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha este repositório

2. **Railway detectará automaticamente**:
   - Node.js como tecnologia
   - `package.json` para dependências
   - `npm start` como comando de inicialização

### 3. **Configurar Variáveis de Ambiente**

No painel do Railway, adicione estas variáveis:

```bash
# Banco de Dados
DB_HOST=mercocamp.ip.odhserver.com
DB_PORT=33101
DB_USER=projetos
DB_PASSWORD=masterkey
DB_NAME=dbrecebimento

# Aplicação
NODE_ENV=production
API_RATE_LIMIT=100
LOG_LEVEL=info

# Segurança
JWT_SECRET=MercoCamp2024SecretKeyForJWTTokensVerySecureAndLong
```

### 4. **Deploy Manual via CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Deploy
railway up
```

### 5. **Verificar Deploy**

Após o deploy, teste:

```bash
# Health check
curl https://your-app.railway.app/health

# Documentação da API
curl https://your-app.railway.app/

# Teste de endpoint
curl https://your-app.railway.app/table/agendamento
```

### 6. **Monitoramento**

Railway fornece:
- 📊 **Logs em tempo real**
- 📈 **Métricas de performance**
- 🔄 **Auto-restart em falhas**
- 📱 **Notificações de deploy**

### 7. **URLs Importantes**

Após o deploy:
- **API**: `https://your-app.railway.app`
- **Health**: `https://your-app.railway.app/health`
- **Docs**: `https://your-app.railway.app/`
- **Stats Agendamento**: `https://your-app.railway.app/table/agendamento/stats`
- **Stats Produtos**: `https://your-app.railway.app/table/produtos/stats`

### 8. **Configurações Otimizadas**

O projeto inclui:

#### **Segurança**:
- CORS configurado para Railway
- Headers de segurança com Helmet
- Rate limiting habilitado
- Logs detalhados

#### **Performance**:
- Pool de conexões MySQL
- Timeouts configurados
- Graceful shutdown
- Health checks

#### **Monitoramento**:
- Winston para logs estruturados
- Endpoint de health check
- Métricas de sistema

### 9. **Troubleshooting**

#### **Deploy falhando?**
```bash
# Ver logs
railway logs

# Verificar variáveis
railway variables

# Redeployar
railway up --detach
```

#### **Banco não conecta?**
- Verifique as variáveis `DB_*`
- Confirme se o MySQL aceita conexões externas
- Teste conectividade da Railway para o MySQL

#### **App não responde?**
- Verifique se a `PORT` está configurada
- Confirme se o health check está passando
- Veja os logs para erros

### 10. **Comandos Úteis**

```bash
# Ver status
railway status

# Conectar ao shell
railway shell

# Ver domínio
railway domain

# Adicionar domínio customizado
railway domain add meudominio.com

# Ver logs
railway logs --tail

# Redeploy
railway up
```

### 11. **Arquivo de Configuração Local**

Para desenvolvimento local, copie `env.production` para `.env`:

```bash
cp env.production .env
# Edite .env se necessário para desenvolvimento
```

### 12. **CI/CD Automático**

Railway irá:
1. **Auto-deploy** em push para main/master
2. **Executar** health checks
3. **Reverter** se falhar
4. **Notificar** status do deploy

---

## 🎉 Sucesso!

Após seguir estes passos, sua API estará:
- ✅ **Deployada** no Railway
- ✅ **Conectada** ao banco MySQL
- ✅ **Monitorada** com health checks
- ✅ **Escalável** automaticamente
- ✅ **Segura** com middlewares

### 📞 Suporte

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **API Docs**: `GET /` na sua aplicação
- **Health Check**: `GET /health` 