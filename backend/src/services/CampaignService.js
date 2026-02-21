import { prisma } from "../config/database.js";
import { getContractClient, getPublicKey } from "../config/stellar.js";
import { TransactionService } from "./TransactionService.js";

export class CampaignService {
    static async create(data) {
        const { userId, name, description, image_url, category, terms, commission_rate } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stellar_address: true, type: true },
        });

        if (!user) throw new Error("User not found");
        if (user.type !== "BUSINESS") throw new Error("Only business users can create campaigns");

        const serverPublicKey = getPublicKey();

        const client = await getContractClient();
        const tx = await client.create_campaign({
            business_id: serverPublicKey,
            commission_rate: Number(commission_rate),
        });

        const { result } = await tx.signAndSend();
        const blockchainId = Number(result);

        return await prisma.campaign.create({
            data: {
                blockchain_id: BigInt(blockchainId),
                user_id: userId,
                name,
                description,
                image_url,
                category,
                terms,
                budget: BigInt(0),
                spent: BigInt(0),
                commission_rate,
                is_active: true,
            },
            include: {
                user: {
                    select: { id: true, email: true, stellar_address: true },
                },
            },
        });
    }

    static async depositBudgetToBlockchain(campaignId, amount, userId) {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) throw new Error("Campaign not found");
        if (campaign.user_id !== userId) throw new Error("Only campaign owner can deposit budget");

        const result = await TransactionService.depositToContract(
            campaign.blockchain_id,
            BigInt(amount)
        );

        const [updated] = await prisma.$transaction([
            prisma.campaign.update({
                where: { id: campaignId },
                data: { budget: { increment: BigInt(amount) } },
                include: { user: { select: { email: true } } },
            }),
            prisma.auditLog.create({
                data: {
                    user_id: userId,
                    action: "DEPOSIT_BUDGET",
                    resource: "campaigns",
                    resource_id: campaignId,
                    details: {
                        amount: Number(amount),
                        blockchain_id: Number(campaign.blockchain_id),
                        transaction_hash: result.transaction_hash,
                    },
                },
            }),
        ]);

        const safeTransaction = {
            success: result.success,
            transaction_hash: result.transaction_hash,
            deposited_amount: Number(result.deposited_amount),
            deposited_xlm: result.deposited_xlm,
            new_budget: Number(result.new_budget),
            new_budget_xlm: result.new_budget_xlm,
        };

        return { campaign: updated, transaction: safeTransaction };
    }

    static async getByBlockchainId(blockchainId) {
        let campaign = await prisma.campaign.findUnique({
            where: { blockchain_id: BigInt(blockchainId) },
            include: {
                user: { select: { email: true, stellar_address: true } },
                _count: { select: { influencers: true, conversions: true } },
            },
        });

        if (campaign) return campaign;

        const client = await getContractClient();
        const tx = await client.get_campaign({ campaign_id: BigInt(blockchainId) });
        const blockchainData = tx.result;

        if (!blockchainData) throw new Error("Campaign not found");

        return await prisma.campaign.create({
            data: {
                blockchain_id: BigInt(blockchainId),
                user_id: "unknown",
                name: `Campaign #${blockchainId}`,
                budget: BigInt(blockchainData.budget),
                spent: BigInt(blockchainData.spent),
                commission_rate: Number(blockchainData.commission_rate),
                is_active: blockchainData.is_active,
            },
        });
    }

    static async list(filters = {}) {
        const { userId, isActive, category, page = 1, limit = 10 } = filters;

        const where = {};
        if (userId) where.user_id = userId;
        if (isActive !== undefined) where.is_active = isActive;
        if (category) where.category = category;

        const [campaigns, total] = await prisma.$transaction([
            prisma.campaign.findMany({
                where,
                include: {
                    user: { select: { email: true } },
                    _count: { select: { influencers: true, conversions: true } },
                },
                orderBy: { created_at: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.campaign.count({ where }),
        ]);

        return {
            campaigns,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    static async updateMetadata(campaignId, data) {
        const { name, description, image_url, category, terms } = data;

        return await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(image_url !== undefined && { image_url }),
                ...(category !== undefined && { category }),
                ...(terms !== undefined && { terms }),
            },
        });
    }

    static async deactivate(campaignId) {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw new Error("Campaign not found");

        const client = await getContractClient();
        const tx = await client.deactivate_campaign({ campaign_id: campaign.blockchain_id });
        await tx.signAndSend();

        return await prisma.campaign.update({
            where: { id: campaignId },
            data: { is_active: false },
        });
    }

    static async getEscrowBalance(campaignId) {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw new Error("Campaign not found");

        const blockchainState = await TransactionService.getCampaignBlockchainState(
            campaign.blockchain_id
        );

        return {
            campaign_id: campaignId,
            blockchain_id: Number(campaign.blockchain_id),
            budget_total: blockchainState.budget,
            budget_total_xlm: blockchainState.budget / 10_000_000,
            spent: blockchainState.spent,
            spent_xlm: blockchainState.spent / 10_000_000,
            available: blockchainState.available,
            available_xlm: blockchainState.available / 10_000_000,
            commission_rate: blockchainState.commission_rate / 100,
        };
    }

    static async syncFromBlockchain(campaignId) {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw new Error("Campaign not found in DB");

        const blockchainState = await TransactionService.getCampaignBlockchainState(
            campaign.blockchain_id
        );

        return await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                budget: BigInt(blockchainState.budget),
                spent: BigInt(blockchainState.spent),
                is_active: blockchainState.is_active,
            },
        });
    }
}
