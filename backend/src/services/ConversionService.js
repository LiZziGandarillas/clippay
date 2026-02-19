import { prisma } from "../config/database.js";
import { getContractClient } from "../config/stellar.js";
import { generateTrackingId } from "../utils/helpers.js";

export class ConversionService {
    static async register(data) {
        const { referralCode, purchaseAmount, buyerConfirmation } = data;

        if (!buyerConfirmation) throw new Error("Buyer confirmation is required");

        const influencer = await prisma.influencer.findUnique({
            where: { referral_code: referralCode },
            include: { campaign: true, user: true },
        });

        if (!influencer) throw new Error("Invalid referral code");
        if (!influencer.campaign.is_active) throw new Error("Campaign is not active");

        const commissionRate = influencer.campaign.commission_rate;
        const expectedCommission =
            (BigInt(purchaseAmount) * BigInt(commissionRate)) / BigInt(10000);

        const available = influencer.campaign.budget - influencer.campaign.spent;
        if (expectedCommission > available) throw new Error("Insufficient campaign budget");

        const recentPaid = await prisma.conversion.findFirst({
            where: {
                influencer_id: influencer.id,
                purchase_amount: BigInt(purchaseAmount),
                status: "PAID",
                created_at: { gte: new Date(Date.now() - 5 * 60 * 1000) },
            },
            include: {
                campaign: { select: { name: true } },
                influencer: {
                    select: {
                        referral_code: true,
                        user: { select: { email: true } },
                    },
                },
            },
        });

        if (recentPaid) return recentPaid;

        let blockchainResult;
        try {
            const client = await getContractClient();
            const tx = await client.register_conversion({
                campaign_id: influencer.campaign.blockchain_id,
                influencer_id: influencer.blockchain_id,
                purchase_amount: BigInt(purchaseAmount),
                timestamp: BigInt(Math.floor(Date.now() / 1000)),
            });

            const { result } = await tx.signAndSend();
            blockchainResult = {
                blockchainId: Number(result),
                txHash: tx.transactionHash || null,
            };
        } catch (error) {
            throw new Error(`Blockchain error: ${error.message}`);
        }

        const trackingId = generateTrackingId();

        const [conversion] = await prisma.$transaction([
            prisma.conversion.create({
                data: {
                    blockchain_id: BigInt(blockchainResult.blockchainId),
                    tracking_id: trackingId,
                    campaign_id: influencer.campaign_id,
                    influencer_id: influencer.id,
                    purchase_amount: BigInt(purchaseAmount),
                    commission: expectedCommission,
                    buyer_confirmation: true,
                    status: "PAID",
                    blockchain_tx_hash: blockchainResult.txHash,
                    timestamp: BigInt(Math.floor(Date.now() / 1000)),
                },
                include: {
                    campaign: { select: { name: true } },
                    influencer: {
                        select: {
                            referral_code: true,
                            user: { select: { email: true } },
                        },
                    },
                },
            }),
            prisma.campaign.update({
                where: { id: influencer.campaign_id },
                data: { spent: { increment: expectedCommission } },
            }),
            prisma.influencer.update({
                where: { id: influencer.id },
                data: {
                    total_conversions: { increment: 1 },
                    total_earned: { increment: expectedCommission },
                },
            }),
        ]);

        return conversion;
    }

    static async getById(id) {
        return await prisma.conversion.findUnique({
            where: { id },
            include: {
                campaign: { select: { name: true, commission_rate: true } },
                influencer: {
                    select: {
                        referral_code: true,
                        user: { select: { email: true } },
                    },
                },
            },
        });
    }

    static async getByTrackingId(trackingId) {
        return await prisma.conversion.findUnique({
            where: { tracking_id: trackingId },
            include: { campaign: true, influencer: true },
        });
    }

    static async list(filters = {}) {
        const { campaignId, influencerId, status, page = 1, limit = 10 } = filters;

        const where = {};
        if (campaignId) where.campaign_id = campaignId;
        if (influencerId) where.influencer_id = influencerId;
        if (status) where.status = status;

        const [conversions, total] = await prisma.$transaction([
            prisma.conversion.findMany({
                where,
                include: {
                    campaign: { select: { name: true } },
                    influencer: { select: { referral_code: true } },
                },
                orderBy: { created_at: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.conversion.count({ where }),
        ]);

        return {
            conversions,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    static async simulate(referralCode, purchaseAmount) {
        const influencer = await prisma.influencer.findUnique({
            where: { referral_code: referralCode },
            include: { campaign: true },
        });

        if (!influencer) throw new Error("Invalid referral code");
        if (!influencer.campaign.is_active) throw new Error("Campaign is not active");

        const commissionRate = influencer.campaign.commission_rate;
        const expectedCommission =
            (BigInt(purchaseAmount) * BigInt(commissionRate)) / BigInt(10000);

        const available = influencer.campaign.budget - influencer.campaign.spent;
        const canProcess = expectedCommission <= available;

        return {
            referral_code: referralCode,
            purchase_amount: Number(purchaseAmount),
            expected_commission: Number(expectedCommission),
            commission_percentage: commissionRate / 100,
            campaign: {
                name: influencer.campaign.name,
                available_budget: Number(available),
            },
            can_process: canProcess,
            warning: !canProcess ? "Insufficient campaign budget" : null,
        };
    }

    static async getStats(filters = {}) {
        const { campaignId, influencerId, startDate, endDate } = filters;

        const where = {};
        if (campaignId) where.campaign_id = campaignId;
        if (influencerId) where.influencer_id = influencerId;
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }

        const [stats, statusBreakdown] = await prisma.$transaction([
            prisma.conversion.aggregate({
                where,
                _count: true,
                _sum: { purchase_amount: true, commission: true },
                _avg: { commission: true },
            }),
            prisma.conversion.groupBy({
                by: ["status"],
                where,
                _count: true,
            }),
        ]);

        return {
            total_conversions: stats._count,
            total_purchase_amount: Number(stats._sum.purchase_amount || 0),
            total_commission: Number(stats._sum.commission || 0),
            avg_commission: Number(stats._avg.commission || 0),
            by_status: statusBreakdown.reduce((acc, item) => {
                acc[item.status] = item._count;
                return acc;
            }, {}),
        };
    }

    static async syncFromBlockchain(conversionId) {
        const conversion = await prisma.conversion.findUnique({
            where: { id: conversionId },
        });

        if (!conversion || conversion.blockchain_id === BigInt(0)) {
            throw new Error("Conversion not found or not on blockchain");
        }

        const client = await getContractClient();
        const tx = await client.get_conversion({ conversion_id: conversion.blockchain_id });
        const blockchainData = tx.result;

        return await prisma.conversion.update({
            where: { id: conversionId },
            data: {
                purchase_amount: BigInt(blockchainData.purchase_amount),
                commission: BigInt(blockchainData.commission),
                timestamp: BigInt(blockchainData.timestamp),
            },
        });
    }
}
