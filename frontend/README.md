# ClipPay Frontend

Aplicación web construida con Next.js para la plataforma ClipPay con sistema de escrow.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **Auth**: JWT + localStorage
- **API Client**: Fetch / Axios
- **Forms**: React Hook Form + Zod
- **Blockchain**: Freighter Wallet integration

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

**Editar `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=CXXXXXXX...
```

---

## 🛠️ Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Lint
npm run lint
```

La app estará disponible en `http://localhost:3001`

---

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                        # Next.js App Router
│   ├── brand/
│   │   ├── create-campaign/
│   │   │   └── page.tsx        # Crear campaña
│   │   └── dashboard/
│   │       └── page.tsx        # Ver campaña
│   ├── influencer/
│   │   └── dashboard/
│   │       └── page.tsx        # Registar a la marketplace y ver campañas
│   ├── globals.css
│   ├── layout.tsx
│   ├── opengraph-image.tsx
│   └── page.tsx
│
├── components
├── hooks
├── lib
├── public
│
├── .npmrc
├── .twblocks.json
├── build-output.txt
├── build-output2.txt
├── components.json
├── eslint.config.mjs
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
├── tsc-output.txt
└── tsconfig.json
```

---

# 🆕 Sistema de Escrow

### Flujo E2E Completo

```
0. PREPARACIÓN
   → Conectar wallet en testnet
   → (Opcional) Reset demo para iniciar limpio

1. FLUJO DEL NEGOCIO (Brand)

   Paso 1 — CREAR CAMPAÑA
   POST /campaigns
   → Completar: título, descripción, CPA, presupuesto, wallet del creador
   → Resultado: campaña creada con contrato de escrow (blockchain_id: 0, budget: 0)

   Paso 2 — FONDEAR ESCROW
   POST /campaigns/:id/deposit-blockchain
   → Business → Smart Contract: XLM depositados
   → Resultado: estado de escrow cambia a "Funded"

2. FLUJO DEL INFLUENCER (Creator)

   Paso 3 — INSCRIBIRSE EN CAMPAÑA
   POST /influencers/register
   → Buscar campaña activa en Marketplace e inscribirse
   → Resultado: campaña aparece en dashboard del influencer

   Paso 4 — OBTENER CÓDIGO DE REFERIDO
   GET /influencers/me
   → Copiar referral_code de la campaña
   → Resultado: código listo para compartir con el negocio/cliente

3. VERIFICACIÓN DE VENTA + RELEASE

   Paso 5 — NEGOCIO VERIFICA CÓDIGO
   POST /conversions
   → Business pega el código del influencer y confirma (2 veces)
   → Resultado:
      · Conversión registrada e incrementada
      · Presupuesto usado incrementa
      · Si se agota el presupuesto → campaña pasa a "Completada"

4. CONFIRMACIÓN DEL LADO INFLUENCER

   Paso 6 — VALIDAR GANANCIA LIBERADA
   GET /influencers/:id/stats  |  POST /influencers/withdraw
   → Resultado:
      · KPI de ganancias liberadas actualizado
      · Smart Contract → Influencer: XLM transferidos a wallet
      · Si campaña terminó, sigue visible como "Completada"

---

RESET DEMO (solo entorno de prueba)
   → Limpia: campañas locales, códigos de tracking, ventas/eventos locales
   → NO limpia: estado real on-chain de contratos/transacciones
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

## 🎨 Estilos y Theming

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        secondary: {
          500: '#8b5cf6',
        }
      }
    }
  }
}
```

### Componentes Base

```tsx
// components/ui/Button.tsx
export function Button({ variant = 'primary', children, ...props }) {
  const styles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }
  
  return (
    <button className={`px-4 py-2 rounded-lg ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Freighter Wallet](https://freighter.app/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

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
