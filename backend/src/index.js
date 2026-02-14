import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        network: process.env.STELLAR_NETWORK || "testnet",
        contract: process.env.CONTRACT_ID ? "configured" : "not configured",
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "ClipPay API",
        version: "0.1.0",
        docs: "/api/v1/docs",
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        path: req.path,
    });
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 ClipPay Backend Server`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Network: ${process.env.STELLAR_NETWORK || "testnet"}`);
    console.log(`✓ Contract: ${process.env.CONTRACT_ID ? process.env.CONTRACT_ID.substring(0, 10) + "..." : "NOT CONFIGURED"}`);
    console.log(`\n📡 Available endpoints:`);
    console.log(`  GET  /health  - Health check`);
    console.log(`  GET  /        - API info`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
