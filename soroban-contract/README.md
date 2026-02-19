# ClipPay Smart Contract

Smart contract en Rust/Soroban para gestión de campañas de performance marketing descentralizado.

## 🏗️ Estructura

```
soroban-contract/
├── contracts/
│   └── clippay-core/
│       ├── src/
│       │   ├── lib.rs       # Implementación principal
│       │   ├── types.rs     # Estructuras de datos
│       │   └── test.rs      # Tests unitarios
│       └── Cargo.toml
├── Cargo.toml               # Workspace config
├── Makefile                 # Comandos útiles
└── README.md
```

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

Esto desplegará el contrato y lo guardará con el alias `clippay-core`.

**Importante:** Guarda el Contract ID que se muestra, lo necesitarás para el backend.

### 3. Verificar Despliegue

Visita Stellar Expert:
```
https://stellar.expert/explorer/testnet/contract/[TU_CONTRACT_ID]
```

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
make test
```

O manualmente:
```bash
cargo test
```

### Tests Específicos

```bash
cargo test test_create_campaign
cargo test test_register_influencer
cargo test test_conversion_flow
```

## 📝 Funciones del Contrato

### Gestión de Campañas

**Crear Campaña:**
```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  create_campaign \
  --business_id GXXXXXXX... \
  --name "Mi Campaña" \
  --budget 1000000000 \
  --commission_rate 500
```

**Consultar Campaña:**
```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  get_campaign \
  --campaign_id 0
```

### Gestión de Influencers

**Registrar Influencer:**
```bash
stellar contract invoke \
  --id clippay-core \
  --source-account mi-wallet \
  --network testnet \
  -- \
  register_influencer \
  --campaign_id 0 \
  --influencer_address GYYYYYYY... \
  --referral_code "CAMP0-INF0-ABC123"
```

### Gestión de Conversiones

**Registrar Conversión:**
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

## 📊 Estructuras de Datos

### Campaign
```rust
{
    id: u64,
    business_id: Address,
    name: String,
    budget: i128,
    spent: i128,
    commission_rate: u32,
    is_active: bool,
}
```

### Influencer
```rust
{
    id: u64,
    address: Address,
    campaign_id: u64,
    referral_code: String,
    total_conversions: u32,
    total_earned: i128,
}
```

### Conversion
```rust
{
    id: u64,
    campaign_id: u64,
    influencer_id: u64,
    purchase_amount: i128,
    commission: i128,
    timestamp: u64,
    is_verified: bool,
}
```

## 🔧 Desarrollo

### Agregar Nueva Función

1. Edita `contracts/clippay-core/src/lib.rs`
2. Agrega la función con `#[contractimpl]`
3. Compila: `make build`
4. Prueba localmente: `cargo test`
5. Despliega: `make deploy`

### Modificar Estructuras

1. Edita `contracts/clippay-core/src/types.rs`
2. Actualiza las funciones que usen esas estructuras
3. Actualiza los tests
4. Re-compila y re-despliega

### Best Practices

- ✅ Siempre escribe tests para nuevas funciones
- ✅ Usa `checked_add`, `checked_sub` para operaciones aritméticas
- ✅ Valida todos los inputs
- ✅ Documenta funciones públicas
- ✅ Mantén las funciones pequeñas y enfocadas

## 🐛 Troubleshooting

### Error: "Account not found"
```bash
stellar keys fund mi-wallet --network testnet
```

### Error: "Contract not found"
Verifica que el Contract ID sea correcto:
```bash
stellar contract id asset --asset native --source-account mi-wallet
```

### Error de compilación
```bash
make clean
make build
```

## 📚 Recursos

- [Soroban Docs](https://soroban.stellar.org)
- [Stellar Docs](https://developers.stellar.org)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Especificación del Contrato](../docs/smart-contract-spec.md)

## 🔐 Seguridad

⚠️ **IMPORTANTE**:
- Este contrato está en fase MVP
- Solo usar en Testnet por ahora
- Auditoría de seguridad pendiente antes de Mainnet
- Nunca uses claves privadas de Mainnet en desarrollo

## 📄 Licencia

MIT License
