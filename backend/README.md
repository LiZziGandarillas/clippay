# ClipPay Backend API

API REST para la plataforma ClipPay con sistema de escrow construida con Node.js, Express, Prisma y Stellar SDK.

## 🚀 Quick Start

### Requisitos

- Node.js v18+
- PostgreSQL 14+
- npm o yarn
- Cuenta Stellar Testnet con fondos
- Contrato ClipPay desplegado e inicializado

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (ver sección de configuración)

# Generar Prisma client
npx prisma generate

# Crear schema en base de datos
npx prisma db push

# Poblar con datos de prueba (opcional)
npm run db:seed

# Iniciar servidor
npm start
```

---

## ⚙️ Configuración del .env

```env
# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://usuario:password@localhost:5432/clippay

# Authentication
JWT_SECRET=tu_secret_aleatorio_minimo_32_caracteres_muy_seguro
JWT_EXPIRES_IN=7d
```

### Obtener Credenciales

**STELLAR_SECRET_KEY:**
```bash
cd ../soroban-contract
stellar keys show mi-wallet
# Copia la "Secret key"
```

**CONTRACT_ID:**
```bash
cd ../soroban-contract
make deploy
# Copia el Contract ID que aparece
```

**Inicializar el contrato:**
```bash
node scripts/init-contract.js
```

---

## 📡 Endpoints de API

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-02-14T10:30:00.000Z",
  "network": "testnet",
  "contract": "configured"
}
```

---

### 🔐 Autenticación

#### Registrar Usuario

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "business@example.com",
  "password": "SecurePass123",
  "type": "BUSINESS",  // o "INFLUENCER"
  "stellar_address": "GBUSINESSADDRESS123..."
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "business@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "business@example.com",
    "type": "BUSINESS",
    "stellar_address": "GABC..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Usuario Actual

```bash
GET /api/v1/auth/me
Authorization: Bearer {token}
```

---

### 💼 Campañas

#### Crear Campaña (Sin Budget Inicial)

```bash
POST /api/v1/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Promo Verano 2025",
  "description": "20% descuento",
  "commission_rate": 500,  // 5% en basis points
  "category": "retail"
}
```

**Response:**
```json
{
  "message": "Campaign created successfully",
  "campaign": {
    "id": "uuid",
    "blockchain_id": 0,
    "budget": 0,  // Inicia en 0
    "spent": 0,
    "commission_rate": 500,
    "is_active": true
  },
  "next_step": {
    "endpoint": "/api/v1/campaigns/:id/deposit-blockchain",
    "method": "POST",
    "body": { "amount": "5000000000" }
  }
}
```

#### 🆕 Depositar Budget en Escrow

```bash
POST /api/v1/campaigns/:id/deposit-blockchain
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": "5000000000"  // 500 XLM en stroops
}
```

**Response:**
```json
{
  "message": "Budget deposited to blockchain escrow successfully",
  "campaign": {
    "id": "uuid",
    "budget": 5000000000
  },
  "transaction": {
    "deposited_xlm": 500,
    "transaction_hash": "abc123...",
    "new_budget_xlm": 500
  }
}
```

#### 🆕 Ver Balance del Escrow

```bash
GET /api/v1/campaigns/:id/escrow-balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "campaign_id": "uuid",
  "blockchain_id": 0,
  "budget_total_xlm": 500,
  "spent_xlm": 5,
  "available_xlm": 495,
  "commission_rate": 5,
  "info": "Balance held in smart contract"
}
```

#### Listar Campañas

```bash
GET /api/v1/campaigns?page=1&limit=10
Authorization: Bearer {token} (opcional)
```

#### Obtener Campaña

```bash
GET /api/v1/campaigns/:id
```

#### Actualizar Metadata

```bash
PATCH /api/v1/campaigns/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "description": "Nueva descripción"
}
```

#### Desactivar Campaña

```bash
POST /api/v1/campaigns/:id/deactivate
Authorization: Bearer {token}
```

---

### 👥 Influencers

#### Unirse a Campaña

```bash
POST /api/v1/influencers/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "campaign_id": "uuid-de-la-campana"
}
```

**Response:**
```json
{
  "message": "Successfully joined campaign",
  "influencer": {
    "id": "uuid",
    "blockchain_id": 0,
    "referral_code": "CAMP0-INF0-ABC123",  // Código único
    "total_conversions": 0,
    "total_earned": 0
  }
}
```

#### 🆕 Retirar Ganancias

```bash
POST /api/v1/influencers/withdraw
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Earnings withdrawn successfully",
  "withdrawn_xlm": 5.0,
  "transaction_hash": "xyz789...",
  "info": "XLM has been transferred to your wallet"
}
```

#### Mis Campañas

```bash
GET /api/v1/influencers/me
Authorization: Bearer {token}
```

#### Estadísticas

```bash
GET /api/v1/influencers/:id/stats
```

**Response:**
```json
{
  "influencer_id": "uuid",
  "referral_code": "CAMP0-INF0-ABC123",
  "total_conversions": 10,
  "total_earned": 50000000,
  "total_earned_xlm": 5.0,
  "can_withdraw": true
}
```

#### Buscar por Código

```bash
GET /api/v1/influencers/by-code/:code
```

---

### 🔄 Conversiones

#### Simular Conversión

```bash
POST /api/v1/conversions/simulate
Content-Type: application/json

{
  "referral_code": "CAMP0-INF0-ABC123",
  "purchase_amount": "100000000"  // 10 XLM
}
```

**Response:**
```json
{
  "simulation": true,
  "referral_code": "CAMP0-INF0-ABC123",
  "purchase_amount": 100000000,
  "expected_commission": 5000000,  // 0.5 XLM
  "commission_percentage": 5,
  "campaign": {
    "name": "Promo Verano",
    "available_budget": 495000000
  },
  "can_process": true,
  "warning": null
}
```

#### Registrar Conversión

```bash
POST /api/v1/conversions
Content-Type: application/json

{
  "referral_code": "CAMP0-INF0-ABC123",
  "purchase_amount": "100000000",
  "buyer_confirmation": true
}
```

**Response:**
```json
{
  "message": "Conversion registered and payment released successfully",
  "conversion": {
    "id": "uuid",
    "blockchain_id": 0,
    "tracking_id": "CONV-1771433xxx-ABC123",
    "purchase_amount": 100000000,
    "commission": 5000000,
    "status": "PAID"
  }
}
```

#### Listar Conversiones

```bash
GET /api/v1/conversions?page=1&limit=10
```

#### Estadísticas

```bash
GET /api/v1/conversions/stats?campaign_id=uuid
Authorization: Bearer {token}
```

---

## 🏗️ Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema híbrido
│   └── seed.js                 # Datos de prueba
│
├── scripts/
│   └── init-contract.js        # Inicializar contrato
│
├── src/
│   ├── config/
│   │   ├── database.js         # Prisma client
│   │   └── stellar.js          # Stellar SDK config
│   │
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── validation.js       # Input validation
│   │   ├── errorHandler.js     # Error handling
│   │   └── rateLimiter.js      # Rate limiting
│   │
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   ├── campaigns.js        # Campaign endpoints (con deposit)
│   │   ├── influencers.js      # Influencer endpoints (con withdraw)
│   │   └── conversions.js      # Conversion endpoints
│   │
│   ├── services/
│   │   ├── AuthService.js          # Authentication logic
│   │   ├── CampaignService.js      # Campaign logic (con escrow)
│   │   ├── TransactionService.js   # 🆕 Escrow management
│   │   ├── InfluencerService.js    # Influencer logic (con withdraw)
│   │   └── ConversionService.js    # Conversion logic
│   │
│   ├── utils/
│   │   ├── helpers.js          # Utility functions
│   │   └── codeGenerator.js    # Referral code generation
│   │
│   └── index.js                # Express server
│
├── .env.example                # Environment template
├── package.json
└── README.md
```

---

## 🆕 Sistema de Escrow

### Flujo Completo

```
1. CREAR CAMPAÑA
   POST /campaigns
   → blockchain_id: 0, budget: 0

2. DEPOSITAR EN ESCROW
   POST /campaigns/:id/deposit-blockchain
   → Business → Smart Contract: 500 XLM
   → Fondos custodiados on-chain

3. CONVERSIONES (×100)
   POST /conversions
   → Solo actualiza contadores (0 fees)
   → Influencer total_earned: 50 XLM (acumulado)

4. WITHDRAW
   POST /influencers/withdraw
   → Smart Contract → Influencer: 50 XLM
   → Transferencia real de XLM
```

### TransactionService

Nuevo servicio para manejar transacciones blockchain:

```javascript
// Depositar en escrow
TransactionService.depositToContract(campaignBlockchainId, amount)

// Retirar ganancias
TransactionService.withdrawEarnings(influencerBlockchainId, influencerAddress)

// Ver balance del contrato
TransactionService.getContractBalance()

// Ver estado blockchain de campaña
TransactionService.getCampaignBlockchainState(campaignBlockchainId)

// Ver estado blockchain de influencer
TransactionService.getInfluencerBlockchainState(influencerBlockchainId)
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

### Postman Collection

Importa `postman_collection.json` para probar todos los endpoints.

---

## 🗄️ Base de Datos

### Schema Principal

```sql
-- Usuarios
users {
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    type ENUM('BUSINESS', 'INFLUENCER'),
    stellar_address VARCHAR UNIQUE,
    created_at TIMESTAMP
}

-- Campañas (hybrid)
campaigns {
    id UUID PRIMARY KEY,
    blockchain_id BIGINT UNIQUE,  -- Vincula con smart contract
    user_id UUID REFERENCES users,
    name VARCHAR,
    description TEXT,
    -- Cache de blockchain
    budget BIGINT,
    spent BIGINT,
    commission_rate INTEGER,
    is_active BOOLEAN
}

-- Influencers (hybrid)
influencers {
    id UUID PRIMARY KEY,
    blockchain_id BIGINT UNIQUE,
    user_id UUID REFERENCES users,
    campaign_id UUID REFERENCES campaigns,
    referral_code VARCHAR UNIQUE,  -- 🔑 Lookup rápido
    total_conversions INTEGER,
    total_earned BIGINT
}

-- Conversiones (hybrid)
conversions {
    id UUID PRIMARY KEY,
    blockchain_id BIGINT UNIQUE,
    tracking_id VARCHAR UNIQUE,
    campaign_id UUID,
    influencer_id UUID,
    purchase_amount BIGINT,
    commission BIGINT,
    status VARCHAR,
    blockchain_tx_hash VARCHAR,
    timestamp BIGINT
}

-- Auditoría de transacciones
audit_logs {
    id UUID PRIMARY KEY,
    user_id UUID,
    action VARCHAR,  -- DEPOSIT_BUDGET, WITHDRAW_EARNINGS
    resource VARCHAR,
    resource_id UUID,
    details JSONB,  -- tx_hash, amounts, etc.
    created_at TIMESTAMP
}
```

### Comandos Prisma

```bash
# Generar client
npx prisma generate

# Aplicar schema
npx prisma db push

# Ver DB en navegador
npx prisma studio

# Resetear DB
npx prisma db reset

# Crear migración
npx prisma migrate dev --name nombre-migracion
```

---

## 🔐 Seguridad

### Implementado

- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Helmet.js para headers HTTP
- ✅ CORS configurado
- ✅ Validación exhaustiva de inputs
- ✅ Rate limiting en endpoints críticos
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ Auditoría de transacciones financieras

### Variables Sensibles

```env
# NUNCA subir a Git:
STELLAR_SECRET_KEY=...  # Clave privada
DATABASE_URL=...        # Conexión DB
JWT_SECRET=...          # Secret para tokens
```

---

## 🐛 Troubleshooting

### Error: "Contract not initialized"

```bash
node scripts/init-contract.js
```

### Error: "Transaction simulation failed"

Verifica que:
1. El contrato esté inicializado
2. La wallet tenga fondos
3. El `CONTRACT_ID` sea correcto

### Error: "Database connection failed"

```bash
# Verificar PostgreSQL
psql -U postgres -d clippay -c "SELECT 1;"

# Verificar .env
cat .env | grep DATABASE_URL
```

### Error: "Insufficient campaign budget"

```bash
# Depositar más fondos
curl -X POST http://localhost:3000/api/v1/campaigns/:id/deposit-blockchain \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": "1000000000"}'
```

---

## 📚 Recursos

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://prisma.io/docs)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Docs](https://soroban.stellar.org/)
- [JWT Docs](https://jwt.io/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feat/nueva-funcionalidad`)
3. Commit con Conventional Commits
4. Push (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License
