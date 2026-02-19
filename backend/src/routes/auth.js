import { Router } from "express";
import { AuthService } from "../services/AuthService.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
    validateRequiredFields,
    validateEmail,
    validatePassword,
    validateStellarAddress,
} from "../middleware/validation.js";

const router = Router();

router.post(
    "/register",
    authLimiter,
    validateRequiredFields(["email", "password", "type", "stellar_address"]),
    validateEmail,
    validatePassword,
    validateStellarAddress,
    asyncHandler(async (req, res) => {
        const { email, password, type, stellar_address } = req.body;

        if (!["business", "influencer"].includes(type.toLowerCase())) {
            return res.status(400).json({
                error: "Invalid type",
                message: "Type must be 'business' or 'influencer'",
            });
        }

        const result = await AuthService.register({ email, password, type, stellar_address });

        res.status(201).json({
            message: "User registered successfully",
            user: result.user,
            token: result.token,
        });
    })
);

router.post(
    "/login",
    authLimiter,
    validateRequiredFields(["email", "password"]),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        res.json({
            message: "Login successful",
            user: result.user,
            token: result.token,
        });
    })
);

router.get(
    "/me",
    authenticate,
    asyncHandler(async (req, res) => {
        res.json({ user: req.user });
    })
);

router.put(
    "/me",
    authenticate,
    asyncHandler(async (req, res) => {
        const { email, stellar_address } = req.body;
        const user = await AuthService.updateUser(req.user.id, { email, stellar_address });

        res.json({ message: "User updated successfully", user });
    })
);

router.post(
    "/change-password",
    authenticate,
    validateRequiredFields(["old_password", "new_password"]),
    validatePassword,
    asyncHandler(async (req, res) => {
        const { old_password, new_password } = req.body;
        await AuthService.changePassword(req.user.id, old_password, new_password);

        res.json({ message: "Password changed successfully" });
    })
);

router.post(
    "/logout",
    authenticate,
    asyncHandler(async (req, res) => {
        await AuthService.invalidateSession(req.token);
        res.json({ message: "Logged out successfully" });
    })
);

export default router;
