import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
    static async register(data) {
        const { email, password, type, stellar_address } = data;

        const [existingEmail, existingStellar] = await Promise.all([
            prisma.user.findUnique({ where: { email } }),
            prisma.user.findUnique({ where: { stellar_address } }),
        ]);

        if (existingEmail) throw new Error("Email already registered");
        if (existingStellar) throw new Error("Stellar address already registered");

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash,
                type: type.toUpperCase(),
                stellar_address,
            },
            select: {
                id: true,
                email: true,
                type: true,
                stellar_address: true,
                created_at: true,
            },
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error("Invalid credentials");

        const token = this.generateToken(user);
        const { password_hash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            throw new Error("Invalid or expired token");
        }
    }

    static async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                type: true,
                stellar_address: true,
                created_at: true,
            },
        });

        if (!user) throw new Error("User not found");
        return user;
    }

    static async updateUser(userId, data) {
        const { email, stellar_address } = data;
        const updateData = {};
        if (email) updateData.email = email;
        if (stellar_address) updateData.stellar_address = stellar_address;

        return await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                type: true,
                stellar_address: true,
                updated_at: true,
            },
        });
    }

    static async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isValid) throw new Error("Current password is incorrect");

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password_hash },
        });

        return { message: "Password updated successfully" };
    }

    static generateToken(user) {
        return jwt.sign(
            { userId: user.id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );
    }

    static async createSession(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return await prisma.session.create({
            data: { user_id: userId, token, expires_at: expiresAt },
        });
    }

    static async invalidateSession(token) {
        return await prisma.session.deleteMany({ where: { token } });
    }

    static async cleanExpiredSessions() {
        return await prisma.session.deleteMany({
            where: { expires_at: { lt: new Date() } },
        });
    }
}
