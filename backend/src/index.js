import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import campaignsRoutes from "./routes/campaigns.js";
import influencersRoutes from "./routes/influencers.js";
import conversionsRoutes from "./routes/conversions.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        architecture: "hybrid",
        components: {
            database: "supabase-postgresql",
            blockchain: "stellar-soroban",
            auth: "supabase-auth",
            storage: "supabase-storage",
        },
    });
});

app.get("/", (req, res) => {
    res.json({
        name: "ClipPay API",
        version: "1.0.0",
        description: "Performance marketing platform with hybrid blockchain architecture",
        architecture: {
            type: "hybrid",
            blockchain: "Stellar Soroban (financial data)",
            database: "Supabase PostgreSQL (metadata & cache)",
            auth: "Supabase Auth",
            storage: "Supabase Storage",
        },
        endpoints: {
            auth: "/api/v1/auth",
            campaigns: "/api/v1/campaigns",
            influencers: "/api/v1/influencers",
            conversions: "/api/v1/conversions",
            health: "/health",
        },
        documentation: "See README.md for full API documentation",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/campaigns", campaignsRoutes);
app.use("/api/v1/influencers", influencersRoutes);
app.use("/api/v1/conversions", conversionsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🚀 ClipPay API Server Started 🚀              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

  📍 Server:        http://localhost:${PORT}
  🌍 Environment:   ${process.env.NODE_ENV || "development"}
  🗄️  Database:      Supabase PostgreSQL (${process.env.DATABASE_URL ? "✓ Connected" : "⚠ Not configured"})
  🔐 Auth:          Supabase Auth (${process.env.SUPABASE_URL ? "✓ Configured" : "⚠ Not configured"})
  📦 Storage:       Supabase Storage (${process.env.SUPABASE_URL ? "✓ Configured" : "⚠ Not configured"})
  ⛓️  Blockchain:    Stellar Testnet
  📝 Contract:      ${process.env.CONTRACT_ID ? process.env.CONTRACT_ID.substring(0, 10) + "..." : "⚠ Not configured"}

📡 API Endpoints:
  ├─ POST   /api/v1/auth/register
  ├─ POST   /api/v1/auth/login
  ├─ POST   /api/v1/auth/refresh
  ├─ GET    /api/v1/auth/me
  │
  ├─ POST   /api/v1/campaigns
  ├─ GET    /api/v1/campaigns
  ├─ GET    /api/v1/campaigns/:id
  ├─ PATCH  /api/v1/campaigns/:id
  ├─ POST   /api/v1/campaigns/:id/image
  ├─ POST   /api/v1/campaigns/:id/deactivate
  ├─ POST   /api/v1/campaigns/:id/deposit-blockchain
  ├─ GET    /api/v1/campaigns/:id/escrow-balance
  │
  ├─ POST   /api/v1/influencers/register
  ├─ POST   /api/v1/influencers/withdraw
  ├─ GET    /api/v1/influencers/me
  ├─ GET    /api/v1/influencers/:id
  ├─ GET    /api/v1/influencers/:id/stats
  ├─ GET    /api/v1/influencers/by-code/:code
  │
  ├─ POST   /api/v1/conversions
  ├─ POST   /api/v1/conversions/simulate
  ├─ GET    /api/v1/conversions
  ├─ GET    /api/v1/conversions/:id
  └─ GET    /api/v1/conversions/stats

🔧 Health Check:  http://localhost:${PORT}/health

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

    const missing = [];
    if (!process.env.CONTRACT_ID) missing.push("CONTRACT_ID");
    if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
    if (!process.env.SUPABASE_URL) missing.push("SUPABASE_URL");
    if (!process.env.SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");

    if (missing.length > 0) {
        console.warn("\n⚠️  WARNING: Missing environment variables:");
        missing.forEach(v => console.warn(`   - ${v}`));
        console.warn("   Some features may not work correctly.\n");
    }
});

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
});

process.on("SIGTERM", () => {
    console.log("\n👋 SIGTERM received, shutting down gracefully...");
    process.exit(0);
});
