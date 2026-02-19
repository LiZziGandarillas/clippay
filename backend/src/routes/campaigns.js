import { Router } from "express";
import { CampaignService } from "../services/CampaignService.js";
import { authenticate, requireType, optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
    validateRequiredFields,
    validateCampaign,
    validateNumericParam,
} from "../middleware/validation.js";
import { formatBigIntToNumber } from "../utils/helpers.js";

const router = Router();

router.post(
    "/",
    authenticate,
    requireType("BUSINESS"),
    validateRequiredFields(["name", "commission_rate"]),
    validateCampaign,
    asyncHandler(async (req, res) => {
        const campaign = await CampaignService.create({
            userId: req.user.id,
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            category: req.body.category,
            terms: req.body.terms,
            commission_rate: req.body.commission_rate,
        });

        res.status(201).json({
            message: "Campaign created successfully. Deposit budget with POST /campaigns/:id/deposit-blockchain",
            campaign: formatBigIntToNumber(campaign),
            next_step: {
                endpoint: `/api/v1/campaigns/${campaign.id}/deposit-blockchain`,
                method: "POST",
                body: { amount: "5000000000" },
            },
        });
    })
);

router.post(
    "/:id/deposit-blockchain",
    authenticate,
    requireType("BUSINESS"),
    validateRequiredFields(["amount"]),
    asyncHandler(async (req, res) => {
        const { amount } = req.body;

        if (Number(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be positive" });
        }

        const result = await CampaignService.depositBudgetToBlockchain(
            req.params.id,
            amount,
            req.user.id
        );

        res.json({
            message: "Budget deposited to blockchain escrow successfully",
            campaign: formatBigIntToNumber(result.campaign),
            transaction: result.transaction,
            info: {
                deposited_xlm: result.transaction.deposited_xlm,
                new_total_xlm: result.transaction.new_budget_xlm,
                transaction_hash: result.transaction.transaction_hash,
            },
        });
    })
);

router.get(
    "/:id/escrow-balance",
    authenticate,
    asyncHandler(async (req, res) => {
        const balance = await CampaignService.getEscrowBalance(req.params.id);
        res.json({
            ...balance,
            info: "This shows how much XLM is currently held in the smart contract for this campaign",
        });
    })
);

router.get(
    "/",
    optionalAuth,
    asyncHandler(async (req, res) => {
        const filters = {
            userId: req.query.user_id || (req.user?.type === "BUSINESS" ? req.user.id : undefined),
            isActive: req.query.is_active === "true" ? true : req.query.is_active === "false" ? false : undefined,
            category: req.query.category,
            page: parseInt(req.query.page) || 1,
            limit: Math.min(parseInt(req.query.limit) || 10, 50),
        };

        const result = await CampaignService.list(filters);
        res.json(formatBigIntToNumber(result));
    })
);

router.get(
    "/:id",
    validateNumericParam("id"),
    asyncHandler(async (req, res) => {
        const campaign = await CampaignService.getByBlockchainId(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(formatBigIntToNumber(campaign));
    })
);

router.patch(
    "/:id",
    authenticate,
    requireType("BUSINESS"),
    asyncHandler(async (req, res) => {
        const campaign = await CampaignService.getByBlockchainId(req.params.id);
        if (!campaign || campaign.user_id !== req.user.id) {
            return res.status(403).json({ error: "You can only update your own campaigns" });
        }

        const updated = await CampaignService.updateMetadata(campaign.id, req.body);
        res.json({ message: "Campaign updated successfully", campaign: formatBigIntToNumber(updated) });
    })
);

router.post(
    "/:id/deactivate",
    authenticate,
    requireType("BUSINESS"),
    validateNumericParam("id"),
    asyncHandler(async (req, res) => {
        const campaign = await CampaignService.getByBlockchainId(req.params.id);
        if (!campaign || campaign.user_id !== req.user.id) {
            return res.status(403).json({ error: "You can only deactivate your own campaigns" });
        }

        const updated = await CampaignService.deactivate(campaign.id);
        res.json({ message: "Campaign deactivated successfully", campaign: formatBigIntToNumber(updated) });
    })
);

router.post(
    "/:id/sync",
    authenticate,
    validateNumericParam("id"),
    asyncHandler(async (req, res) => {
        const campaign = await CampaignService.getByBlockchainId(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        const synced = await CampaignService.syncFromBlockchain(campaign.id);
        res.json({ message: "Campaign synced successfully", campaign: formatBigIntToNumber(synced) });
    })
);

export default router;
