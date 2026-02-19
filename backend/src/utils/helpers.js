export function generateTrackingId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CONV-${timestamp}-${random}`;
}

export function generateReferralCode(campaignId, influencerId) {
    const random = generateRandomString(6);
    return `CAMP${campaignId}-INF${influencerId}-${random}`;
}

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    
    return result;
}

export function parseReferralCode(code) {
    const regex = /^CAMP(\d+)-INF(\d+)-([A-Z0-9]{6})$/;
    const match = code.match(regex);
    
    if (!match) {
        return null;
    }
    
    return {
        campaignId: parseInt(match[1], 10),
        influencerId: parseInt(match[2], 10),
        randomPart: match[3],
    };
}

export function isValidReferralCodeFormat(code) {
    return parseReferralCode(code) !== null;
}

export function stroopsToXlm(stroops) {
    return Number(stroops) / 10_000_000;
}

export function xlmToStroops(xlm) {
    return BigInt(Math.floor(xlm * 10_000_000));
}

export function calculateCommission(amount, commissionRate) {
    return (BigInt(amount) * BigInt(commissionRate)) / BigInt(10000);
}

export function formatBigIntToNumber(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === "bigint") {
        return Number(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(formatBigIntToNumber);
    }

    if (typeof obj === "object") {
        const formatted = {};
        for (const [key, value] of Object.entries(obj)) {
            formatted[key] = formatBigIntToNumber(value);
        }
        return formatted;
    }

    return obj;
}

export function isValidStellarAddress(address) {
    const regex = /^G[A-Z2-7]{55}$/;
    return regex.test(address);
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isValidPassword(password) {
    if (password.length < 8) return false;
    if (!/[a-zA-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
}

export function sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

export function paginate(items, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        pagination: {
            page,
            limit,
            total: items.length,
            pages: Math.ceil(items.length / limit),
            hasMore: endIndex < items.length,
        },
    };
}

export function generateShortHash() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date) {
    return new Date(date).toISOString();
}

export function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return ((part / total) * 100).toFixed(2);
}
