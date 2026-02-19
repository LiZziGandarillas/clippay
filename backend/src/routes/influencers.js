import { Router } from "express";
import { InfluencerService } from "../services/InfluencerService.js";
import { authenticate, requireType } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validateRequiredFields } from "../middleware/validation.js";
import { formatBigIntToNumber } from "../utils/helpers.js";

const router = Router();

router.post(
    "/register",
    authenticate,
    requireType("INFLUENCER"),
    validateRequiredFields(["campaign_id"]),
    asyncHandler(async (req, res) => {
        const influencer = await InfluencerService.register({
            userId: req.user.id,
            campaignId: req.body.campaign_id,
        });
        res.status(201).json({
            message: "Successfully joined campaign",
            influencer: formatBigIntToNumber(influencer),
        });
    })
);

router.post(
    "/withdraw",
    authenticate,
    requireType("INFLUENCER"),
    asyncHandler(async (req, res) => {
        const influencers = await InfluencerService.listByUser(req.user.id);

        if (!influencers || influencers.length === 0) {
            return res.status(404).json({ error: "No influencer registrations found" });
        }

        const influencer = influencers.find((inf) => inf.total_earned > 0n);
        if (!influencer) {
            return res.status(400).json({ error: "No earnings to withdraw" });
        }

        const result = await InfluencerService.withdraw(influencer.id, req.user.id);
        res.json({
            message: "Earnings withdrawn successfully",
            ...formatBigIntToNumber(result.withdrawal),
            info: "XLM has been transferred to your wallet",
        });
    })
);

router.get(
    "/me",
    authenticate,
    requireType("INFLUENCER"),
    asyncHandler(async (req, res) => {
        const campaigns = await InfluencerService.listByUser(req.user.id);
        res.json({ campaigns: formatBigIntToNumber(campaigns) });
    })
);

router.get(
    "/by-code/:code",
    asyncHandler(async (req, res) => {
        const influencer = await InfluencerService.getByReferralCode(req.params.code);
        if (!influencer) {
            return res.status(404).json({ error: "Influencer not found", code: req.params.code });
        }
        res.json(formatBigIntToNumber(influencer));
    })
);

router.get(
    "/:id/stats",
    asyncHandler(async (req, res) => {
        const stats = await InfluencerService.getStats(req.params.id);
        res.json(formatBigIntToNumber(stats));
    })
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const influencer = await InfluencerService.getById(req.params.id);
        if (!influencer) {
            return res.status(404).json({ error: "Influencer not found" });
        }
        res.json(formatBigIntToNumber(influencer));
    })
);

export default router;
