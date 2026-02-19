import { Keypair, contract, Networks, rpc, Asset, Address, StrKey } from "@stellar/stellar-sdk";

const { basicNodeSigner } = contract;

function getConfig() {
    const required = ["CONTRACT_ID", "STELLAR_SECRET_KEY"];
    const missing = required.filter((k) => !process.env[k]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
    }

    return {
        contractId: process.env.CONTRACT_ID,
        secretKey: process.env.STELLAR_SECRET_KEY,
        rpcUrl:
            process.env.STELLAR_RPC_URL ||
            "https://soroban-testnet.stellar.org",
        networkPassphrase:
            process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET,
        network: process.env.STELLAR_NETWORK || "testnet",
    };
}

export function getXlmTokenAddress() {
    const { network } = getConfig();
    const networkPassphrase =
        network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
    const xlmContractId = Asset.native().contractId(networkPassphrase);
    return Address.contract(StrKey.decodeContract(xlmContractId));
}

let _keypair = null;

export function getKeypair() {
    if (!_keypair) {
        const { secretKey } = getConfig();
        _keypair = Keypair.fromSecret(secretKey);
    }
    return _keypair;
}

export function getPublicKey() {
    return getKeypair().publicKey();
}

let _client = null;
let _clientCreatedAt = null;
const CLIENT_TTL_MS = 30 * 60 * 1000;

export async function getContractClient() {
    const now = Date.now();
    const isExpired =
        !_clientCreatedAt || now - _clientCreatedAt >= CLIENT_TTL_MS;

    if (_client && !isExpired) {
        return _client;
    }

    const config = getConfig();
    const keypair = getKeypair();
    const signer = basicNodeSigner(keypair, config.networkPassphrase);

    _client = await contract.Client.from({
        publicKey: keypair.publicKey(),
        contractId: config.contractId,
        networkPassphrase: config.networkPassphrase,
        rpcUrl: config.rpcUrl,
        allowHttp: false,
        ...signer,
    });

    _clientCreatedAt = now;
    return _client;
}

export { getConfig };
