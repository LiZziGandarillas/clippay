import { Router } from "express";
import { ConversionService } from "../services/ConversionService.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { conversionLimiter } from "../middleware/rateLimiter.js";
import { validateRequiredFields, validateConversion } from "../middleware/validation.js";
import { formatBigIntToNumber } from "../utils/helpers.js";

const router = Router();

router.post(
    "/",
    conversionLimiter,
    validateRequiredFields(["referral_code", "purchase_amount", "buyer_confirmation"]),
    validateConversion,
    asyncHandler(async (req, res) => {
        const conversion = await ConversionService.register({
            referralCode: req.body.referral_code,
            purchaseAmount: req.body.purchase_amount,
            buyerConfirmation: req.body.buyer_confirmation,
        });

        res.status(201).json({
            message: "Conversion registered and payment released successfully",
            conversion: formatBigIntToNumber(conversion),
        });
    })
);

router.post(
    "/simulate",
    validateRequiredFields(["referral_code", "purchase_amount"]),
    asyncHandler(async (req, res) => {
        const simulation = await ConversionService.simulate(
            req.body.referral_code,
            req.body.purchase_amount
        );

        res.json({ simulation: true, ...formatBigIntToNumber(simulation) });
    })
);

router.get(
    "/stats",
    authenticate,
    asyncHandler(async (req, res) => {
        const filters = {
            campaignId: req.query.campaign_id,
            influencerId: req.query.influencer_id,
            startDate: req.query.start_date,
            endDate: req.query.end_date,
        };
        const stats = await ConversionService.getStats(filters);
        res.json(formatBigIntToNumber(stats));
    })
);

router.get(
    "/tracking/:trackingId",
    asyncHandler(async (req, res) => {
        const conversion = await ConversionService.getByTrackingId(req.params.trackingId);
        if (!conversion) {
            return res.status(404).json({
                error: "Conversion not found",
                tracking_id: req.params.trackingId,
            });
        }
        res.json(formatBigIntToNumber(conversion));
    })
);

router.get(
    "/",
    optionalAuth,
    asyncHandler(async (req, res) => {
        const filters = {
            campaignId: req.query.campaign_id,
            influencerId: req.query.influencer_id,
            status: req.query.status,
            page: parseInt(req.query.page) || 1,
            limit: Math.min(parseInt(req.query.limit) || 10, 50),
        };
        const result = await ConversionService.list(filters);
        res.json(formatBigIntToNumber(result));
    })
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const conversion = await ConversionService.getById(req.params.id);
        if (!conversion) {
            return res.status(404).json({ error: "Conversion not found" });
        }
        res.json(formatBigIntToNumber(conversion));
    })
);

router.post(
    "/:id/sync",
    authenticate,
    asyncHandler(async (req, res) => {
        const synced = await ConversionService.syncFromBlockchain(req.params.id);
        res.json({ message: "Conversion synced successfully", conversion: formatBigIntToNumber(synced) });
    })
);

export default router;
