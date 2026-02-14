import { Keypair, contract, Networks, rpc } from "@stellar/stellar-sdk";

const { basicNodeSigner } = contract;

const CONTRACT_ID = process.env.CONTRACT_ID;
const RPC_URL = process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;

let clientInstance = null;
let keypairInstance = null;

export async function getKeypair() {
    if (!keypairInstance) {
        const secretKey = process.env.STELLAR_SECRET_KEY;
        
        if (!secretKey) {
            throw new Error("STELLAR_SECRET_KEY no está configurada en las variables de entorno");
        }
        
        keypairInstance = Keypair.fromSecret(secretKey);
    }
    
    return keypairInstance;
}

export async function getContractClient() {
    if (!clientInstance) {
        if (!CONTRACT_ID) {
            throw new Error(
                "CONTRACT_ID no está configurado en las variables de entorno"
            );
        }
        
        const keypair = await getKeypair();
        
        const server = new rpc.Server(RPC_URL, {
            allowHttp: false,
        });
        
        const signer = basicNodeSigner(keypair, NETWORK_PASSPHRASE);
        
        const clientOptions = {
            publicKey: keypair.publicKey(),
            contractId: CONTRACT_ID,
            networkPassphrase: NETWORK_PASSPHRASE,
            rpcUrl: RPC_URL,
            allowHttp: false,
            ...signer,
        };
        
        clientInstance = await contract.Client.from(clientOptions);
        
        console.log("✅ Cliente Stellar SDK inicializado correctamente");
    }
    
    return clientInstance;
}

function getReadableType(typeObj) {
    if (!typeObj || !typeObj._switch) {
        return 'unknown';
    }

    const typeName = typeObj._switch.name;

    // Tipos básicos
    const typeMap = {
        'scSpecTypeU32': 'u32',
        'scSpecTypeI32': 'i32',
        'scSpecTypeU64': 'u64',
        'scSpecTypeI64': 'i64',
        'scSpecTypeU128': 'u128',
        'scSpecTypeI128': 'i128',
        'scSpecTypeBool': 'bool',
        'scSpecTypeString': 'String',
        'scSpecTypeSymbol': 'Symbol',
        'scSpecTypeAddress': 'Address',
        'scSpecTypeBytes': 'Bytes',
        'scSpecTypeVec': 'Vec',
        'scSpecTypeMap': 'Map',
        'scSpecTypeOption': 'Option',
        'scSpecTypeResult': 'Result',
    };

    if (typeMap[typeName]) {
        // Para tipos complejos como Vec, Option, etc.
        if (typeName === 'scSpecTypeVec' && typeObj._value) {
            const innerType = getReadableType(typeObj._value.elementType());
            return `Vec<${innerType}>`;
        }
        if (typeName === 'scSpecTypeOption' && typeObj._value) {
            const innerType = getReadableType(typeObj._value.valueType());
            return `Option<${innerType}>`;
        }
        return typeMap[typeName];
    }

    // Tipos personalizados (UDT - User Defined Types)
    if (typeName === 'scSpecTypeUdt' && typeObj._value) {
        const udtName = typeObj._value.name().toString();
        return udtName;
    }

    return typeName || 'unknown';
}

export async function getPublicKey() {
    const keypair = await getKeypair();
    return keypair.publicKey();
}

export async function testConnection() {
    try {
        const server = new rpc.Server(RPC_URL);
        await server.getHealth();
        return true;
    } catch (error) {
        console.error("Error de conexión con Stellar:", error);
        return false;
    }
}

export { CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE };
