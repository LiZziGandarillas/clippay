import { getContractClient, getPublicKey } from "../config/stellar.js";

export class TransactionService {
    static async depositToContract(campaignBlockchainId, amount) {
        if (amount <= 0n) throw new Error("Amount must be positive");
        if (amount < 1_000_000n) throw new Error("Minimum deposit is 0.1 XLM (1000000 stroops)");

        try {
            const client = await getContractClient();
            const publicKey = getPublicKey();

            console.log(`🔄 Depositing ${Number(amount) / 10_000_000} XLM to contract...`);

            const tx = await client.deposit_campaign_budget({
                campaign_id: BigInt(campaignBlockchainId),
                from: publicKey,
                amount: BigInt(amount),
            });

            const { result } = await tx.signAndSend();

            console.log(`✅ Deposit successful. TX Hash: ${tx.transactionHash}`);

            return {
                success: true,
                campaign: result,
                transaction_hash: tx.transactionHash,
                deposited_amount: Number(amount),
                deposited_xlm: Number(amount) / 10_000_000,
                new_budget: Number(result.budget),
                new_budget_xlm: Number(result.budget) / 10_000_000,
            };
        } catch (error) {
            console.error("❌ Deposit failed:", error.message);
            throw new Error(`Blockchain deposit failed: ${error.message}`);
        }
    }

    // influencerAddress: la wallet real del influencer (registrada en el contrato)
    static async withdrawEarnings(influencerBlockchainId, influencerAddress) {
        try {
            const client = await getContractClient();

            // Verificar earnings antes de intentar el retiro
            const influencerTx = await client.get_influencer({
                influencer_id: BigInt(influencerBlockchainId),
            });
            const influencer = influencerTx.result;
            const earned = BigInt(influencer.total_earned);

            if (earned === 0n) throw new Error("No earnings to withdraw");

            console.log(`🔄 Withdrawing ${Number(earned) / 10_000_000} XLM to ${influencerAddress}...`);

            // "to" debe ser la wallet real del influencer — es quien el contrato
            // verifica con assert_eq!(influencer.address, to)
            console.log("🔍 Withdrawing to address:", influencerAddress);
            const tx = await client.withdraw_earnings({
                influencer_id: BigInt(influencerBlockchainId),
                to: influencerAddress,
            });

            const { result } = await tx.signAndSend();
            const withdrawnAmount = Number(result);

            console.log(`✅ Withdraw successful. TX Hash: ${tx.transactionHash}`);

            return {
                success: true,
                withdrawn_amount: withdrawnAmount,
                withdrawn_xlm: withdrawnAmount / 10_000_000,
                transaction_hash: tx.transactionHash,
                remaining_earnings: 0,
            };
        } catch (error) {
            console.error("❌ Withdraw failed:", error.message);
            throw new Error(`Blockchain withdraw failed: ${error.message}`);
        }
    }

    static async getContractBalance() {
        try {
            const client = await getContractClient();
            const tx = await client.get_contract_balance();
            const balance = Number(tx.result);

            return {
                balance_stroops: balance,
                balance_xlm: balance / 10_000_000,
                formatted: `${(balance / 10_000_000).toFixed(7)} XLM`,
            };
        } catch (error) {
            throw new Error(`Failed to get contract balance: ${error.message}`);
        }
    }

    static async getCampaignBlockchainState(campaignBlockchainId) {
        try {
            const client = await getContractClient();
            const tx = await client.get_campaign({ campaign_id: BigInt(campaignBlockchainId) });
            const campaign = tx.result;

            return {
                blockchain_id: Number(campaign.id),
                budget: Number(campaign.budget),
                spent: Number(campaign.spent),
                available: Number(campaign.budget) - Number(campaign.spent),
                commission_rate: Number(campaign.commission_rate),
                is_active: campaign.is_active,
            };
        } catch (error) {
            throw new Error(`Failed to get campaign state: ${error.message}`);
        }
    }

    static async getInfluencerBlockchainState(influencerBlockchainId) {
        try {
            const client = await getContractClient();
            const tx = await client.get_influencer({
                influencer_id: BigInt(influencerBlockchainId),
            });
            const influencer = tx.result;

            return {
                blockchain_id: Number(influencer.id),
                address: influencer.address,
                campaign_id: Number(influencer.campaign_id),
                total_conversions: Number(influencer.total_conversions),
                total_earned: Number(influencer.total_earned),
                total_earned_xlm: Number(influencer.total_earned) / 10_000_000,
            };
        } catch (error) {
            throw new Error(`Failed to get influencer state: ${error.message}`);
        }
    }

    static estimateFee(operation) {
        const baseFee = 100;
        const fees = {
            deposit: baseFee * 2,
            withdraw: baseFee * 2,
            register_conversion: baseFee,
            register_influencer: baseFee,
        };
        const fee = fees[operation] ?? baseFee;

        return {
            fee_stroops: fee,
            fee_xlm: fee / 10_000_000,
            operation,
            formatted: `${(fee / 10_000_000).toFixed(7)} XLM`,
        };
    }
}
