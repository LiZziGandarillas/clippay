import { isValidEmail, isValidPassword, isValidStellarAddress } from "../utils/helpers.js";

export const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        const missing = [];
        
        for (const field of fields) {
            if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
                missing.push(field);
            }
        }

        if (missing.length > 0) {
            return res.status(400).json({
                error: "Missing required fields",
                fields: missing,
            });
        }

        next();
    };
};

export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (email && !isValidEmail(email)) {
        return res.status(400).json({
            error: "Invalid email format",
        });
    }

    next();
};

export const validatePassword = (req, res, next) => {
    const { password } = req.body;
    
    if (password && !isValidPassword(password)) {
        return res.status(400).json({
            error: "Invalid password",
            message: "Password must be at least 8 characters and contain letters and numbers",
        });
    }

    next();
};

export const validateStellarAddress = (req, res, next) => {
    const { stellar_address } = req.body;
    
    if (stellar_address && !isValidStellarAddress(stellar_address)) {
        return res.status(400).json({
            error: "Invalid Stellar address",
            message: "Stellar address must be 56 characters starting with G",
        });
    }

    next();
};

export const validateNumericParam = (paramName) => {
    return (req, res, next) => {
        const value = req.params[paramName];
        const num = Number(value);

        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
            return res.status(400).json({
                error: "Invalid parameter",
                message: `${paramName} must be a non-negative integer`,
            });
        }

        req.params[paramName] = num;
        next();
    };
};

export const validateCampaign = (req, res, next) => {
    const { name, budget, commission_rate } = req.body;
    const errors = [];

    if (name && (typeof name !== "string" || name.trim().length === 0)) {
        errors.push("name must be a non-empty string");
    }

    if (name && name.length > 100) {
        errors.push("name must be 100 characters or less");
    }

    if (budget !== undefined) {
        const budgetNum = Number(budget);
        if (isNaN(budgetNum) || budgetNum <= 0) {
            errors.push("budget must be a positive number");
        }
    }

    if (commission_rate !== undefined) {
        const rateNum = Number(commission_rate);
        if (isNaN(rateNum) || rateNum < 1 || rateNum > 10000) {
            errors.push("commission_rate must be between 1 and 10000 basis points");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Validation failed",
            details: errors,
        });
    }

    next();
};

export const validateConversion = (req, res, next) => {
    const { referral_code, purchase_amount, buyer_confirmation } = req.body;
    const errors = [];

    if (!referral_code || typeof referral_code !== "string") {
        errors.push("referral_code is required and must be a string");
    }

    if (purchase_amount !== undefined) {
        const amount = Number(purchase_amount);
        if (isNaN(amount) || amount <= 0) {
            errors.push("purchase_amount must be a positive number");
        }
    }

    if (buyer_confirmation === undefined || typeof buyer_confirmation !== "boolean") {
        errors.push("buyer_confirmation is required and must be a boolean");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Validation failed",
            details: errors,
        });
    }

    next();
};
