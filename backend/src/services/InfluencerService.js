import { prisma } from "../config/database.js";
import { getContractClient } from "../config/stellar.js";
import { generateReferralCode } from "../utils/helpers.js";
import { TransactionService } from "./TransactionService.js";

export class InfluencerService {
    static async register(data) {
        const { userId, campaignId } = data;

        const [campaign, user] = await Promise.all([
            prisma.campaign.findUnique({ where: { id: campaignId } }),
            prisma.user.findUnique({ where: { id: userId } }),
        ]);

        if (!campaign) throw new Error("Campaign not found");
        if (!campaign.is_active) throw new Error("Campaign is not active");
        if (!user) throw new Error("User not found");
        if (user.type !== "INFLUENCER") throw new Error("User must be an influencer");

        const existing = await prisma.influencer.findFirst({
            where: { user_id: userId, campaign_id: campaignId },
        });
        if (existing) throw new Error("Already registered in this campaign");

        const client = await getContractClient();
        const tx = await client.register_influencer({
            campaign_id: campaign.blockchain_id,
            // Registrar la wallet REAL del influencer en el contrato
            // para que withdraw_earnings pueda transferirle directamente
            influencer_address: user.stellar_address,
        });

        const { result } = await tx.signAndSend();
        const blockchainId = Number(result);
        const referralCode = generateReferralCode(Number(campaign.blockchain_id), blockchainId);

        return await prisma.influencer.create({
            data: {
                blockchain_id: BigInt(blockchainId),
                user_id: userId,
                campaign_id: campaignId,
                referral_code: referralCode,
                total_conversions: 0,
                total_earned: BigInt(0),
            },
            include: {
                user: { select: { email: true, stellar_address: true } },
                campaign: { select: { name: true, commission_rate: true } },
            },
        });
    }

    static async withdraw(influencerId, userId) {
        const influencer = await prisma.influencer.findUnique({
            where: { id: influencerId },
            include: {
                user: { select: { stellar_address: true } },
                campaign: { select: { name: true } },
            },
        });

        if (!influencer) throw new Error("Influencer not found");
        if (influencer.user_id !== userId) throw new Error("Only influencer owner can withdraw");
        if (influencer.total_earned === 0n) throw new Error("No earnings to withdraw");

        // Pasar la wallet real del influencer para que el contrato
        // transfiera el XLM directamente a su dirección
        const result = await TransactionService.withdrawEarnings(
            influencer.blockchain_id,
            influencer.user.stellar_address
        );

        const [updated] = await prisma.$transaction([
            prisma.influencer.update({
                where: { id: influencerId },
                data: { total_earned: BigInt(0) },
            }),
            prisma.auditLog.create({
                data: {
                    user_id: userId,
                    action: "WITHDRAW_EARNINGS",
                    resource: "influencers",
                    resource_id: influencerId,
                    details: {
                        withdrawn_amount: result.withdrawn_amount,
                        blockchain_id: Number(influencer.blockchain_id),
                        transaction_hash: result.transaction_hash,
                        to_address: influencer.user.stellar_address,
                    },
                },
            }),
        ]);

        return { influencer: updated, withdrawal: result };
    }

    static async getById(id) {
        return await prisma.influencer.findUnique({
            where: { id },
            include: {
                user: { select: { email: true, stellar_address: true } },
                campaign: {
                    select: { name: true, commission_rate: true, is_active: true },
                },
            },
        });
    }

    static async getByReferralCode(code) {
        return await prisma.influencer.findUnique({
            where: { referral_code: code },
            include: { user: true, campaign: true },
        });
    }

    static async listByUser(userId) {
        return await prisma.influencer.findMany({
            where: { user_id: userId },
            include: {
                campaign: {
                    select: {
                        name: true,
                        description: true,
                        commission_rate: true,
                        is_active: true,
                    },
                },
                _count: { select: { conversions: true } },
            },
            orderBy: { created_at: "desc" },
        });
    }

    static async getStats(influencerId) {
        const influencer = await prisma.influencer.findUnique({
            where: { id: influencerId },
        });
        if (!influencer) throw new Error("Influencer not found");

        return {
            influencer_id: influencer.id,
            referral_code: influencer.referral_code,
            total_conversions: influencer.total_conversions,
            total_earned: Number(influencer.total_earned),
            total_earned_xlm: Number(influencer.total_earned) / 10_000_000,
            can_withdraw: influencer.total_earned > 0n,
        };
    }

    static async syncFromBlockchain(influencerId) {
        const influencer = await prisma.influencer.findUnique({
            where: { id: influencerId },
        });
        if (!influencer) throw new Error("Influencer not found");

        const blockchainState = await TransactionService.getInfluencerBlockchainState(
            influencer.blockchain_id
        );

        return await prisma.influencer.update({
            where: { id: influencerId },
            data: {
                total_conversions: blockchainState.total_conversions,
                total_earned: BigInt(blockchainState.total_earned),
            },
        });
    }
}
