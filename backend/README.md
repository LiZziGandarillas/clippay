# ClipPay Backend

API REST para la plataforma ClipPay construida con Node.js, Express y Stellar SDK.

## 🚀 Quick Start

### Requisitos

- Node.js v18+
- npm o yarn
- Cuenta Stellar en Testnet con fondos
- Contrato ClipPay desplegado

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### Configuración del .env

Necesitas configurar las siguientes variables:

```env
# Red de Stellar
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Tu clave secreta
STELLAR_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ID del contrato desplegado
CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Puerto del servidor
PORT=3000
```

**Obtener tu SECRET_KEY:**
```bash
cd ../soroban-contract
stellar keys show mi-wallet
```

**Obtener CONTRACT_ID:**
```bash
# Después de desplegar el contrato
cd ../soroban-contract
make deploy
# Copia el Contract ID que aparece
```

### Ejecutar el Servidor

```bash
# Modo producción
npm start

# Modo desarrollo (con auto-reload)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints Disponibles

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

### API Info

```bash
GET /
```

**Response:**
```json
{
  "message": "ClipPay API",
  "version": "0.1.0",
  "docs": "/api/v1/docs"
}
```

## 🔧 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── stellar.js       # Configuración Stellar SDK
│   ├── routes/              # Endpoints REST (próximamente)
│   ├── models/              # Modelos de datos (próximamente)
│   ├── middleware/          # Middleware Express (próximamente)
│   ├── services/            # Lógica de negocio (próximamente)
│   └── index.js             # Servidor principal
├── .env.example             # Template de configuración
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test
```

## 🔐 Seguridad

⚠️ **IMPORTANTE:**

- **NUNCA** subas tu archivo `.env` a GitHub
- **NUNCA** compartas tu `STELLAR_SECRET_KEY`
- El archivo `.env` ya está en `.gitignore`
- Usa claves diferentes para development/production

## 📚 Próximos Endpoints (Roadmap)

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Campañas
- `POST /api/v1/campaigns` - Crear campaña
- `GET /api/v1/campaigns` - Listar campañas
- `GET /api/v1/campaigns/:id` - Obtener campaña
- `PATCH /api/v1/campaigns/:id` - Actualizar campaña

### Influencers
- `POST /api/v1/campaigns/:id/join` - Unirse a campaña
- `GET /api/v1/influencers/me/campaigns` - Mis campañas

### Conversiones
- `POST /api/v1/conversions` - Registrar conversión
- `GET /api/v1/conversions` - Listar conversiones
- `GET /api/v1/conversions/:id` - Obtener conversión

### Códigos de Referido
- `GET /api/v1/referral-codes/:code` - Validar código

## 🐛 Troubleshooting

### Error: "STELLAR_SECRET_KEY not configured"

Asegúrate de que tu archivo `.env` existe y tiene la clave configurada:

```bash
# Ver si existe el archivo
ls -la .env

# Ver el contenido (sin mostrar la clave completa)
cat .env | grep STELLAR_SECRET_KEY
```

### Error: "CONTRACT_ID not configured"

Necesitas desplegar el contrato primero:

```bash
cd ../soroban-contract
make deploy
# Copia el Contract ID al .env
```

### Error: "Connection refused"

Verifica que el RPC URL sea correcto:

```bash
curl https://soroban-testnet.stellar.org/health
```

### El servidor no inicia

```bash
# Verificar versión de Node.js
node --version  # Debe ser v18+

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📖 Recursos

- [Express.js Documentation](https://expressjs.com/)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [API Specification](../docs/api-spec.md)

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

MIT License
