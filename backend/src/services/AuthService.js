import { supabaseAdmin } from "../config/supabase.js";
import { prisma } from "../config/database.js";

export class AuthService {
    static async register(data) {
        const { email, password, type, stellar_address } = data;

        const existingStellar = await prisma.user.findUnique({
            where: { stellar_address },
        });
        if (existingStellar) throw new Error("Stellar address already registered");

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                type: type.toUpperCase(),
                stellar_address,
            },
        });

        if (authError) {
            if (authError.message.includes("already registered")) {
                throw new Error("Email already registered");
            }
            throw new Error(authError.message);
        }

        const user = await prisma.user.create({
            data: {
                id: authData.user.id,
                email,
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

        const { data: signInData, error: signInError } =
            await supabaseAdmin.auth.signInWithPassword({ email, password });

        if (signInError) throw new Error(signInError.message);

        return {
            user,
            token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token,
        };
    }

    static async login(email, password) {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error("Invalid credentials");

        const user = await prisma.user.findUnique({
            where: { id: data.user.id },
            select: {
                id: true,
                email: true,
                type: true,
                stellar_address: true,
                created_at: true,
            },
        });

        if (!user) throw new Error("User not found");

        return {
            user,
            token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    }

    static async verifyToken(token) {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data.user) throw new Error("Invalid or expired token");
        return data.user;
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

        if (email) {
            await supabaseAdmin.auth.admin.updateUserById(userId, { email });
            updateData.email = email;
        }
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

        const { error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
            email: user.email,
            password: oldPassword,
        });
        if (verifyError) throw new Error("Current password is incorrect");

        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: newPassword,
        });
        if (error) throw new Error(error.message);

        return { message: "Password updated successfully" };
    }

    static async invalidateSession(_token) {
        return { message: "Session invalidated" };
    }
}
