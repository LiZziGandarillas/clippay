import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many attempts",
        message: "Too many login attempts from this IP. Try again in 15 minutes.",
    },
});

export const conversionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests",
        message: "Too many conversion attempts. Please slow down.",
    },
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests",
        message: "Rate limit exceeded. Please slow down.",
    },
});
