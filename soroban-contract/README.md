# ClipPay Smart Contract

Smart contract en Rust/Soroban para gestión de campañas de performance marketing descentralizado.

## 🏗️ Estructura

```
soroban-contract/
├── contracts/
│   └── clippay-core/
│       ├── src/
│       │   ├── lib.rs       # Implementación principal (en progreso)
│       │   ├── types.rs     # Estructuras de datos (próximamente)
│       │   └── test.rs      # Tests unitarios (próximamente)
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
