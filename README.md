# ClipPay 🎯

> Plataforma descentralizada de performance marketing que conecta negocios locales con micro-influencers mediante blockchain.

## 🌟 Características Principales

- ✅ Atribución verificable de conversiones
- 💰 Pagos automáticos mediante smart contracts
- 🔒 Escrow seguro de fondos
- 📊 Transparencia total en comisiones
- 🔗 Sistema de códigos únicos de referido

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Negocio   │────▶│  ClipPay    │◀────│ Influencer  │
│   (App)     │     │  Platform   │     │   (App)     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   Stellar   │
                    │  Blockchain │
                    └─────────────┘
```

## 📂 Estructura del Proyecto

```
clippay/
├── docs/                    # Documentación técnica
├── soroban-contract/        # Smart contracts (Rust/Soroban)
├── backend/                 # API REST (Node.js/Express)
└── frontend/                # Aplicaciones cliente
```

## 🚀 Quick Start

### Requisitos Previos

- **Rust** y **Soroban CLI** (para smart contracts)
- **Node.js v18+** (para backend y frontend)
- **PostgreSQL** (para backend)
- **Git**

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/LiZziGandarillas/clippay.git
cd clippay

# Smart Contract
cd soroban-contract
make build
make deploy

# Backend
cd ../backend
npm install
cp .env.example .env
# Configurar .env con tus credenciales
npm start

# Frontend
cd ../frontend
npm install
npm start
```

## 📖 Documentación

- [Arquitectura del Sistema](./docs/architecture.md)
- [Especificación de la API](./docs/api-spec.md)
- [Smart Contract Spec](./docs/smart-contract-spec.md)

Cada carpeta tiene su propio README con instrucciones detalladas:
- [Smart Contract README](./soroban-contract/README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 👥 Equipo de Desarrollo

- Jorge Calderon
- Ivan Martinez
- Lizeth Gandarillas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feat/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `build`: Cambios en build/dependencias
- `ci`: Cambios en CI/CD
- `chore`: Tareas menores

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles.

## 🔗 Enlaces

- [Stellar Blockchain](https://stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
