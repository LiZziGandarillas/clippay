# ClipPay Smart Contract

Smart contract en Rust/Soroban con sistema de escrow para gestión descentralizada de campañas de performance marketing.

## 🏗️ Estructura

```
soroban-contract/
├── contracts/
│   └── clippay-core/
│       ├── src/
│       │   ├── lib.rs       # Contrato con escrow
│       │   ├── types.rs     # Estructuras de datos
│       │   └── test.rs      # Tests unitarios (15+)
│       └── Cargo.toml
├── Cargo.toml               # Workspace config
├── Makefile                 # Comandos útiles
└── README.md
```

---

## 📦 Requisitos

- **Rust**: 1.70+
- **Soroban CLI**: Última versión
- **Stellar CLI**: Última versión

### Instalación de Herramientas

```bash
# Instalar Soroban CLI
cargo install --locked soroban-cli --features opt

# Configurar red testnet
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Crear identidad (wallet)
stellar keys generate --global mi-wallet --network testnet

# Fondear cuenta
stellar keys fund mi-wallet --network testnet
```

---

## 🚀 Compilación y Despliegue

### 1. Compilar el Contrato

```bash
make build
```

O manualmente:
```bash
stellar contract build
```

### 2. Desplegar en Testnet

```bash
make deploy
```

**⚠️ Importante:** Guarda dos valores:
1. **CONTRACT_ID**: El ID del contrato desplegado
2. **XLM Token Address**: Para el escrow

### 3. Inicializar el Contrato

El contrato debe inicializarse con el token XLM:

```bash
cd ../backend
node scripts/init-contract.js
```

Esto configura el contrato para manejar XLM nativos.

### 4. Verificar Despliegue

Visita Stellar Expert:
```
https://stellar.expert/explorer/testnet/contract/[TU_CONTRACT_ID]
```

---

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
make test
```

**Resultados esperados:** 15+ tests pasando

O manualmente:
```bash
cargo test -- --nocapture
```

### Tests Específicos

```bash
cargo test test_initialize
cargo test test_create_campaign
cargo test test_deposit_budget
cargo test test_register_influencer
cargo test test_register_conversion
cargo test test_withdraw_earnings
```

---

## 📝 Funciones del Contrato

### Inicialización (Solo una vez)

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  initialize \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

---

### Gestión de Campañas

#### Crear Campaña (Sin Budget Inicial)

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  create_campaign \
  --business_id GBUSINESSADDRESS123... \
  --commission_rate 500
```

**Retorna:** `campaign_id` (u64)

#### 🆕 Depositar Budget (Escrow)

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  deposit_campaign_budget \
  --campaign_id 0 \
  --from GBUSINESSADDRESS123... \
  --amount 5000000000
```

**Esto:**
- Transfiere XLM del negocio AL CONTRATO
- Fondos quedan custodiados (escrow)
- Actualiza `campaign.budget`

#### Consultar Campaña

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  get_campaign \
  --campaign_id 0
```

**Retorna:**
```rust
{
  id: 0,
  business_id: "GBUSINESSADDRESS...",
  budget: 5000000000,
  spent: 0,
  commission_rate: 500,
  is_active: true
}
```

#### Desactivar Campaña

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  deactivate_campaign \
  --campaign_id 0
```

---

### Gestión de Influencers

#### Registrar Influencer

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  register_influencer \
  --campaign_id 0 \
  --influencer_address GINFLUENCERADDRESS123...
```

**Retorna:** `influencer_id` (u64)

#### 🆕 Retirar Ganancias (Withdraw)

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  withdraw_earnings \
  --influencer_id 0 \
  --to GINFLUENCERADDRESS123...
```

**Esto:**
- Transfiere XLM DEL CONTRATO al influencer
- Wallet del influencer recibe XLM real
- Resetea `influencer.total_earned` a 0

#### Consultar Influencer

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  get_influencer \
  --influencer_id 0
```

**Retorna:**
```rust
{
  id: 0,
  address: "GINFLUENCERADDRESS...",
  campaign_id: 0,
  total_conversions: 10,
  total_earned: 50000000  // Listo para withdraw
}
```

---

### Gestión de Conversiones

#### Registrar Conversión

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  register_conversion \
  --campaign_id 0 \
  --influencer_id 0 \
  --purchase_amount 100000000 \
  --timestamp 1707908400
```

**Esto:**
- Calcula comisión automáticamente
- Actualiza `campaign.spent`
- Actualiza `influencer.total_earned`
- ⚠️ **NO transfiere XLM** (eficiencia)

**Retorna:** `conversion_id` (u64)

#### Consultar Conversión

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  get_conversion \
  --conversion_id 0
```

---

### 🆕 Utilidades de Escrow

#### Ver Balance del Contrato

```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  get_contract_balance
```

**Retorna:** Balance en stroops del contrato (cuánto XLM tiene custodiado)

---

## 📊 Estructuras de Datos

### Campaign

```rust
pub struct Campaign {
    pub id: u64,
    pub business_id: Address,
    pub budget: i128,           // XLM custodiados en escrow
    pub spent: i128,            // XLM gastados en comisiones
    pub commission_rate: u32,   // Basis points (500 = 5%)
    pub is_active: bool,
}
```

### Influencer

```rust
pub struct Influencer {
    pub id: u64,
    pub address: Address,       // Wallet del influencer
    pub campaign_id: u64,
    pub total_conversions: u32,
    pub total_earned: i128,     // Acumulado para withdraw
}
```

### Conversion

```rust
pub struct Conversion {
    pub id: u64,
    pub campaign_id: u64,
    pub influencer_id: u64,
    pub purchase_amount: i128,
    pub commission: i128,
    pub timestamp: u64,
}
```

### DataKey (Storage)

```rust
pub enum DataKey {
    Campaign(u64),
    Influencer(u64),
    Conversion(u64),
    CampaignCounter,
    InfluencerCounter,
    ConversionCounter,
    TokenAddress,           // 🆕 Para escrow XLM
}
```

---

## 🆕 Sistema de Escrow

### Flujo de Fondos

```
1. INICIALIZAR (una vez)
   initialize(token: XLM_ADDRESS)
   → Configura el contrato para manejar XLM

2. DEPOSITAR
   deposit_campaign_budget(campaign_id, from, amount)
   → from (Business) transfiere XLM al contrato
   → Contrato custodia los fondos

3. CONVERSIONES (×N)
   register_conversion(...)
   → Solo actualiza contadores (campaign.spent, influencer.total_earned)
   → NO transfiere XLM (eficiente)

4. WITHDRAW
   withdraw_earnings(influencer_id, to)
   → Contrato transfiere XLM acumulado al influencer
   → Resetea total_earned a 0
```

### Validaciones de Seguridad

```rust
// En deposit_campaign_budget:
✅ from.require_auth()  // Solo el owner puede depositar
✅ assert_eq!(campaign.business_id, from)  // Verificar ownership

// En withdraw_earnings:
✅ to.require_auth()  // Solo el owner puede retirar
✅ assert_eq!(influencer.address, to)  // Verificar ownership
✅ assert!(amount > 0)  // No retirar si no hay fondos

// En register_conversion:
✅ assert!(commission <= available)  // Verificar fondos suficientes
```

---

## 🔧 Desarrollo

### Agregar Nueva Función

1. Edita `contracts/clippay-core/src/lib.rs`
2. Agrega la función en `#[contractimpl]`
3. Compila: `make build`
4. Prueba localmente: `cargo test`
5. Despliega: `make deploy`

### Modificar Estructuras

1. Edita `contracts/clippay-core/src/types.rs`
2. Actualiza funciones que usen esas estructuras
3. Actualiza tests en `test.rs`
4. Re-compila y re-despliega

### Best Practices

- ✅ Siempre usar `checked_add`, `checked_sub`, `checked_mul`
- ✅ Validar todos los inputs con `assert!`
- ✅ Usar `require_auth()` para operaciones sensibles
- ✅ Documentar funciones públicas
- ✅ Escribir tests para cada función
- ✅ Mantener funciones pequeñas y enfocadas
- ✅ Usar eventos para tracking

---

## 🧪 Ejemplo de Test

```rust
#[test]
fn test_escrow_flow() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract = ClipPayContractClient::new(&env, &contract_id);
    let business = Address::generate(&env);
    let influencer = Address::generate(&env);
    
    // 1. Crear campaña
    let campaign_id = contract.create_campaign(&business, &500);
    
    // 2. Depositar en escrow
    contract.deposit_campaign_budget(&campaign_id, &business, &5_000_000_000);
    
    // 3. Registrar influencer
    let inf_id = contract.register_influencer(&campaign_id, &influencer);
    
    // 4. Registrar conversión
    contract.register_conversion(&campaign_id, &inf_id, &100_000_000, &1234567890);
    
    // 5. Verificar que influencer tiene ganancias
    let inf = contract.get_influencer(&inf_id);
    assert_eq!(inf.total_earned, 5_000_000);
    
    // 6. Withdraw
    let withdrawn = contract.withdraw_earnings(&inf_id, &influencer);
    assert_eq!(withdrawn, 5_000_000);
    
    // 7. Verificar que se resetea
    let inf_after = contract.get_influencer(&inf_id);
    assert_eq!(inf_after.total_earned, 0);
}
```

---

## 🐛 Troubleshooting

### Error: "Contract not initialized"

```bash
node backend/scripts/init-contract.js
```

### Error: "Account not found"

```bash
stellar keys fund mi-wallet --network testnet
```

### Error: "Transaction simulation failed"

Verifica:
1. Contrato inicializado
2. Wallet tiene fondos
3. Parámetros correctos

### Error de compilación

```bash
make clean
make build
```

### Ver logs detallados

```bash
cargo test -- --nocapture
```

---

## 📚 Recursos

- [Soroban Docs](https://soroban.stellar.org)
- [Stellar Docs](https://developers.stellar.org)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Token Interface](https://soroban.stellar.org/docs/reference/interfaces/token-interface)

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**:
- Este contrato está en fase MVP
- Solo usar en Testnet por ahora
- Auditoría de seguridad pendiente antes de Mainnet
- Nunca uses claves privadas de Mainnet en desarrollo
- El sistema de escrow maneja fondos reales - probar exhaustivamente

### Puntos de Atención

1. **Overflow protection**: Usamos `checked_add`, `checked_mul`, etc.
2. **Authorization**: Todas las operaciones críticas requieren auth
3. **Ownership verification**: Solo el owner puede depositar/retirar
4. **Balance checks**: Siempre verificamos fondos suficientes
5. **Event logging**: Para tracking y auditoría

---

## 📄 Licencia

MIT License
