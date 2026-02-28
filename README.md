
# ClipPay 🚀

> Plataforma descentralizada de performance marketing con sistema de escrow que conecta negocios locales con micro-influencers mediante arquitectura híbrida (Blockchain + PostgreSQL)

## 🌟 Características Principales

- ✅ **Atribución verificable** de conversiones on-chain
- 💰 **Sistema de escrow** con pagos automáticos
- 🔒 **Fondos custodiados** en smart contract
- 📊 **Transparencia total** en comisiones y pagos
- 🔗 **Códigos únicos** por campaña-influencer

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Apps)                      │
│     [Business App]  [Influencer App]  [Buyer App]       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (JWT Auth)
                     ▼
┌─────────────────────────────────────────────────────────┐
│          BACKEND (Node.js + Express + Prisma)           │
│   ┌─────────────────────────────────────────────────┐   │
│   │  Services:                                      │   │
│   │  • Authentication (JWT + bcrypt)                │   │
│   │  • Campaign (Hybrid: DB + Blockchain)           │   │
│   │  • Transaction (Escrow Management)              │   │
│   │  • Influencer (Códigos únicos)                  │   │
│   │  • Conversion (Registro eficiente)              │   │
│   └─────────────────────────────────────────────────┘   │
│            │                           │                │
│            ▼ (Metadata)                ▼ (Critical)     │
│     ┌──────────────┐            ┌──────────────┐        │
│     │  PostgreSQL  │            │   Stellar    │        │
│     │  • Usuarios  │            │  • Escrow    │        │
│     │  • Códigos   │            │  • Pagos     │        │
│     │  • Cache     │            │  • Balance   │        │
│     └──────────────┘            └──────────────┘        │
└─────────────────────────────────────────────────────────┘

FLUJO DE ESCROW:
1. Negocio deposita XLM → Smart Contract (custodia)
2. Conversiones actualizan contadores (0 fees)
3. Influencer retira acumulado → Recibe XLM real
```

---

## 📂 Estructura del Proyecto

```
clippay/
├── docs/                               # 📚 Documentación técnica
├── soroban-contract/                   # 🦀 Smart Contract (Rust/Soroban)
│   ├── contracts/
│   │   └── clippay-core/
│   │       ├── src/
│   │       │   ├── lib.rs              # Implementación del contrato
│   │       │   ├── types.rs            # Estructuras de datos
│   │       │   └── test.rs             # Tests unitarios
│   │       └── Cargo.toml
│   ├── Cargo.toml
│   ├── Makefile
│   └── README.md
│
├── backend/                            # 🚀 Backend API (Node.js/Express)
│   ├── prisma/
│   │    ├── schema.prisma              # Schema híbrido
│   │    └── seed.js                    # Datos de prueba
│   ├── src/
│   │   ├── config/
│   │   │   ├── stellar.js              # Stellar SDK + init
│   │   │   └── database.js             # Prisma client
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT authentication
│   │   │   ├── errorHandler.js         # Error handling
│   │   │   ├── rateLimiter.js          # Rate limiting
│   │   │   └── validation.js           # Validación de datos
│   │   ├── routes/
│   │   │   ├── auth.js                 # Auth endpoints
│   │   │   ├── campaigns.js            # Campaign + deposit
│   │   │   ├── conversions.js          # Conversiones
│   │   │   └── influencers.js          # Influencer + withdraw
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── CampaignService.js      # Con deposit escrow
│   │   │   ├── ConversionService.js
│   │   │   ├── InfluencerService.js    # Con withdraw
│   │   │   └── TransactionService.js   # 🆕 Escrow management
│   │   ├── utils/
│   │   │   └─ helpers.js
│   │   └── index.js
│   ├─── package.json
│   ├─── .env.example
│   └─── README.md
│
└── frontend/                           # 💻 Apps (Next.js)
    ├── app/
    ├── components/
    ├── public/
    └── README.md
```

---

## 🚀 Quick Start

### Requisitos Previos

- **Rust** y **Soroban CLI** (para smart contracts)
- **Node.js v18+** (para backend y frontend)
- **PostgreSQL 14+** (para backend)
- **Stellar CLI**
- **Git**

### 1️⃣ Smart Contract

```bash
cd soroban-contract

# Compilar
make build

# Ejecutar tests
make test

# Desplegar a Stellar Testnet
make deploy

# 📋 IMPORTANTE: Guardar CONTRACT_ID y XLM_TOKEN_ADDRESS
```

**Inicializar el contrato:**
```bash
cd ../backend
node scripts/init-contract.js
```

### 2️⃣ 2️⃣ Backend API

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

**Editar `.env`:**
```env
# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_SECRET_KEY=SXXXXX...    # De: stellar keys show mi-wallet
CONTRACT_ID=CXXXXX...           # Del paso anterior

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/clippay

# JWT Configuration
JWT_SECRET=tu_secret_aleatorio_minimo_32_caracteres
JWT_EXPIRES_IN=7d
```

**Setup de base de datos:**
```bash
# Generar Prisma client
npx prisma generate

# Crear schema en DB
npx prisma db push

# Poblar datos de prueba
npm run db:seed

# Iniciar servidor
npm start
```

## 🧪 Testing

### Test del Smart Contract

```bash
cd soroban-contract
cargo test

# Resultados esperados: 15 tests passing
```

### Test del Backend

#### 1. Registrar Usuario (Business)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@example.com",
    "password": "password123",
    "type": "business",
    "stellar_address": {{clipPay_business_stellar_address}}
  }'
```

**Respuesta esperada:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. Autenticación

```bash
# Login como Business
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@test.com",
    "password": "password123"
  }'

# Guardar el token
clipPay_business_token="token_del_business"
```

#### 3. Crear Campaña (requiere clipPay_business_token)

```bash
curl -X POST http://localhost:3000/api/v1/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{clipPay_business_token}}" \
  -d '{
    "name": "Promo Verano 2025",
    "description": "20% descuento en toda la tienda",
    "commission_rate": 500,
    "category": "retail"
  }'

# Guardar campaign_id
clipPay_campaign_id="uuid-de-la-campana"
```

**Respuesta:**
```json
{
  "campaign": {
    "blockchain_id": 0,
    "budget": 0,  // ← Inicia en 0
    ...
  },
  "next_step": {
    "endpoint": "/api/v1/campaigns/:id/deposit-blockchain"
  }
}
```
### 4. Depositar Budget en Escrow

```bash
curl -X POST http://localhost:3000/api/v1/campaigns/{{clipPay_campaign_id}}/deposit-blockchain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{clipPay_business_token}}" \
  -d '{
    "amount": "5000000000"
  }'
```

**Respuesta:**
```json
{
  "message": "Budget deposited to blockchain escrow successfully",
  "transaction": {
    "deposited_xlm": 500,
    "transaction_hash": "abc123...",
    "new_budget_xlm": 500
  }
}
```

**✅ Verificar en Freighter:**
- Wallet Business: **-500 XLM** (depositados en escrow)

#### 5. Influencer se Une a Campaña

```bash
# Primero registrar usuario influencer
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer1@test.com",
    "password": "password123",
    "type": "influencer",
    "stellar_address": "{{clipPay_influencer1_stellar_address}}"
  }'

# Login como influencer
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer1@test.com",
    "password": "password123"
  }'

# Guardar el token
clipPay_influencer_token="token_del_influencer"

# Unirse a campaña
curl -X POST http://localhost:3000/api/v1/influencers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{clipPay_influencer_token}}" \
  -d '{
    "campaign_id": "{{clipPay_campaign_id}}"
  }'

# Guardar codigo de referido
clipPay_referral_code="CAMP0-INF0-ABC123"
```

#### 5. Simular Conversión

```bash
curl -X POST http://localhost:3000/api/v1/conversions/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code": "{{clipPay_referral_code}}",
    "purchase_amount": "100000000"
  }'
```

#### 6. Registrar Conversión Real

```bash
curl -X POST http://localhost:3000/api/v1/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code": "{{clipPay_referral_code}}",
    "purchase_amount": "100000000",
    "buyer_confirmation": true
  }'
```
**Después de 10 conversiones:**
- Influencer `total_earned`: 50,000,000 stroops (5 XLM acumulados)
- Campaign `spent`: 50,000,000 stroops
- ❌ **Wallet influencer**: Sin cambios (aún no retiró)

### 7. Influencer Retira Ganancias (WITHDRAW)

```bash
curl -X POST http://localhost:3000/api/v1/influencers/withdraw \
  -H "Authorization: Bearer {{clipPay_influencer_token}}"
```

**Respuesta:**
```json
{
  "message": "Earnings withdrawn successfully",
  "withdrawn_xlm": 5.0,
  "transaction_hash": "xyz789...",
  "info": "XLM has been transferred to your wallet"
}
```

**✅ Verificar en Freighter:**
- Wallet Influencer: **+5 XLM** (recibidos del escrow)
- ✅ **¡Se movió XLM real!**

### Test 7: Ver Balance del Escrow

```bash
curl http://localhost:3000/api/v1/campaigns/{{clipPay_campaign_id}}/escrow-balance \
  -H "Authorization: Bearer {{clipPay_business_token}}"
```

**Respuesta:**
```json
{
  "budget_total_xlm": 500,
  "spent_xlm": 5,
  "available_xlm": 495,
  "info": "Balance held in smart contract"
}
```

---

## 📊 Arquitectura de Datos: On-Chain vs Off-Chain

### ⛓️ Smart Contract (Soroban) - Solo datos críticos financieros

```rust
// Estructuras en blockchain
Campaign {
    id: u64,
    business_id: Address,
    budget: i128,           // XLM custodiados
    spent: i128,
    commission_rate: u32,
    is_active: bool,
}

Influencer {
    id: u64,
    address: Address,       // Wallet del influencer
    campaign_id: u64,
    total_conversions: u32,
    total_earned: i128,     // Acumulado para withdraw
}

Conversion {
    id: u64,
    campaign_id: u64,
    influencer_id: u64,
    purchase_amount: i128,
    commission: i128,
    timestamp: u64,
}
```

### 🗄️ PostgreSQL - Metadata, códigos, cache

```sql
-- Usuarios y autenticación
users {
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    type ENUM('BUSINESS', 'INFLUENCER'),
    stellar_address VARCHAR UNIQUE,  -- Wallet
    created_at TIMESTAMP
}

-- Campañas (hybrid)
campaigns {
    id UUID PRIMARY KEY,
    blockchain_id BIGINT UNIQUE,     -- Vínculo con smart contract
    user_id UUID REFERENCES users,
    name VARCHAR,
    description TEXT,
    image_url VARCHAR,
    category VARCHAR,
    -- Cache de blockchain (sincronizado)
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
    referral_code VARCHAR UNIQUE,    -- 🔑 Lookup ultra-rápido
    -- Cache de blockchain
    total_conversions INTEGER,
    total_earned BIGINT
}

-- Conversiones (hybrid)
conversions {
    id UUID PRIMARY KEY,
    blockchain_id BIGINT UNIQUE,
    tracking_id VARCHAR UNIQUE,
    campaign_id UUID REFERENCES campaigns,
    influencer_id UUID REFERENCES influencers,
    purchase_amount BIGINT,
    commission BIGINT,
    buyer_confirmation BOOLEAN,
    status ENUM('PENDING', 'PAID', 'FAILED'),
    blockchain_tx_hash VARCHAR,
    timestamp BIGINT
}

-- Auditoría
audit_logs {
    id UUID PRIMARY KEY,
    user_id UUID,
    action VARCHAR,              -- DEPOSIT_BUDGET, WITHDRAW_EARNINGS
    resource VARCHAR,
    resource_id UUID,
    details JSONB,               -- tx_hash, amounts, etc.
    created_at TIMESTAMP
}
```

---

## 🔐 Seguridad

### Variables Sensibles (NUNCA subir a Git)

```env
# ⚠️ Mantener en .env (ya está en .gitignore)
STELLAR_SECRET_KEY=SXXXXX...     # Clave privada - CRÍTICO
DATABASE_URL=postgresql://...    # Conexión DB
JWT_SECRET=xxxxx...              # Secret para tokens (min 32 chars)
```

### Medidas Implementadas

- ✅ Passwords hasheados con **bcrypt** (10 rounds)
- ✅ JWT tokens con expiración configurable
- ✅ **Helmet.js** para headers HTTP seguros
- ✅ **CORS** configurado
- ✅ Validación exhaustiva de inputs
- ✅ **Rate limiting** en endpoints críticos
- ✅ Require auth en transacciones blockchain
- ✅ Auditoría de transacciones financieras

---

## 📡 API Endpoints

### 🔐 Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Login (retorna JWT)
- `GET /api/v1/auth/me` - Usuario autenticado
- `PUT /api/v1/auth/me` - Actualizar perfil
- `POST /api/v1/auth/change-password` - Cambiar password
- `POST /api/v1/auth/logout` - Logout

### 💼 Campañas
- `POST /api/v1/campaigns` - Crear campaña (sin budget)
- `POST /api/v1/campaigns/:id/deposit-blockchain` - 🆕 Depositar en escrow
- `GET /api/v1/campaigns/:id/escrow-balance` - 🆕 Ver balance escrow
- `GET /api/v1/campaigns` - Listar campañas
- `GET /api/v1/campaigns/:id` - Obtener campaña
- `PATCH /api/v1/campaigns/:id` - Actualizar metadata
- `POST /api/v1/campaigns/:id/deactivate` - Desactivar
- `POST /api/v1/campaigns/:id/sync` - Sincronizar con blockchain

### 👥 Influencers
- `POST /api/v1/influencers/register` - Unirse a campaña
- `POST /api/v1/influencers/withdraw` - 🆕 Retirar ganancias
- `GET /api/v1/influencers/me` - Mis campañas
- `GET /api/v1/influencers/:id` - Obtener influencer
- `GET /api/v1/influencers/:id/stats` - Estadísticas
- `GET /api/v1/influencers/by-code/:code` - Buscar por código

### 🔄 Conversiones
- `POST /api/v1/conversions` - Registrar conversión
- `POST /api/v1/conversions/simulate` - Simular conversión
- `GET /api/v1/conversions` - Listar conversiones
- `GET /api/v1/conversions/:id` - Obtener conversión
- `GET /api/v1/conversions/tracking/:trackingId` - Por tracking ID
- `GET /api/v1/conversions/stats` - Estadísticas

---

### 3️⃣ Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🛠️ Comandos Útiles

### Smart Contract
```bash
make build          # Compilar optimizado
make test           # Ejecutar tests
make deploy         # Desplegar a testnet
make clean          # Limpiar build
```

### Backend
```bash
npm run dev              # Desarrollo con auto-reload
npm start                # Producción
npm run db:generate      # Generar Prisma client
npm run db:push          # Aplicar schema a DB
npm run db:seed          # Poblar datos de prueba
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Resetear DB
```

### Frontend
```bash
npm run dev              # Desarrollo
npm run build            # Build para producción
npm start                # Servir build
npm run lint             # Linter
```

---

## 📚 Documentación Adicional

- 🦀 [Smart Contract README](./soroban-contract/README.md)
- 🖥️ [Backend README](./backend/README.md)
- 💻 [Frontend README](./frontend/README.md)

---

## 🐛 Troubleshooting

### Error: "Transaction simulation failed"
```bash
# Verificar que el contrato esté inicializado
node backend/scripts/init-contract.js
```

### Error: "Insufficient campaign budget"
```bash
# Depositar más fondos en el escrow
curl -X POST http://localhost:3000/api/v1/campaigns/:id/deposit-blockchain \
  -H "Authorization: Bearer {{clipPay_influencer_token}}" \
  -d '{"amount": "1000000000"}'
```

### Error: "No earnings to withdraw"
```bash
# Verificar stats del influencer
curl http://localhost:3000/api/v1/influencers/me \
  -H "Authorization: Bearer {{clipPay_influencer_token}}"
```

### No veo cambios en Freighter
1. Verifica que estés en **Testnet**
2. Refresca la wallet
3. Verifica el `transaction_hash` en [Stellar Expert](https://stellar.expert/explorer/testnet)

---

## 👥 Equipo de Desarrollo

- Jorge Calderon
- Ivan Martinez
- Lizeth Gandarillas

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feat/nueva-funcionalidad`)
3. Commit con [Conventional Commits](https://www.conventionalcommits.org/)
4. Push (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `build`: Cambios en build/dependencias
- `ci`: Cambios en CI/CD
- `chore`: Tareas menores

---

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles.

---

## 🔗 Enlaces Útiles

- [Stellar Blockchain](https://stellar.org)
- [Soroban Smart Contracts](https://soroban.stellar.org)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- [Prisma ORM](https://prisma.io)
- [Next.js](https://nextjs.org)

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

🚀 **¿Listo para revolucionar el performance marketing?**
