import "dotenv/config";
import { Asset, Networks, Address, StrKey } from "@stellar/stellar-sdk";
import { getContractClient } from "../src/config/stellar.js";

async function initContract() {
    console.log("🚀 Initializing ClipPay contract...");

    const network = process.env.STELLAR_NETWORK === "mainnet"
        ? Networks.PUBLIC
        : Networks.TESTNET;

    const xlmContractId = Asset.native().contractId(network);
    const tokenAddress = Address.contract(StrKey.decodeContract(xlmContractId));

    console.log(`   Network : ${process.env.STELLAR_NETWORK || "testnet"}`);
    console.log(`   Contract: ${process.env.CONTRACT_ID}`);
    console.log(`   XLM SAC : ${xlmContractId}`);

    const client = await getContractClient();

    const tx = await client.initialize({ token: tokenAddress });
    const result = await tx.signAndSend();

    console.log("✅ Contract initialized successfully!");
    console.log(`   TX Hash: ${result.hash || "confirmed"}`);
    console.log("   You can now create campaigns and deposit budgets.");
}

initContract().catch((err) => {
    console.error("❌ Initialization failed:", err.message);
    console.error(err);
    process.exit(1);
});
