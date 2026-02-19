#![no_std]

mod types;
use types::{Campaign, Conversion, DataKey, Influencer};

use soroban_sdk::{contract, contractimpl, token, Address, Env};

#[contract]
pub struct ClipPayContract;

#[contractimpl]
impl ClipPayContract {
    pub fn initialize(env: Env, token: Address) {
        assert!(
            !env.storage().instance().has(&DataKey::TokenAddress),
            "Contract already initialized"
        );
        env.storage()
            .instance()
            .set(&DataKey::TokenAddress, &token);
    }

    pub fn create_campaign(
        env: Env,
        business_id: Address,
        commission_rate: u32,
    ) -> u64 {
        assert!(
            commission_rate > 0 && commission_rate <= 10000,
            "Commission rate must be between 1 and 10000 basis points"
        );

        let campaign_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::CampaignCounter)
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::CampaignCounter, &(campaign_id + 1));

        let campaign = Campaign {
            id: campaign_id,
            business_id,
            budget: 0,
            spent: 0,
            commission_rate,
            is_active: true,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            ("campaign", "created"),
            (campaign_id, commission_rate),
        );

        campaign_id
    }

    pub fn deposit_campaign_budget(
        env: Env,
        campaign_id: u64,
        from: Address,
        amount: i128,
    ) -> Campaign {
        from.require_auth();

        assert!(amount > 0, "Amount must be positive");
        assert!(amount >= 1_000_000, "Minimum deposit is 0.1 XLM (1000000 stroops)");

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.is_active, "Campaign is not active");
        assert_eq!(
            campaign.business_id, from,
            "Only campaign owner can deposit"
        );

        get_token_client(&env).transfer(
            &from,
            &env.current_contract_address(),
            &amount,
        );

        campaign.budget = campaign
            .budget
            .checked_add(amount)
            .expect("Budget overflow");

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            ("campaign", "budget_deposited"),
            (campaign_id, amount, campaign.budget),
        );

        campaign
    }

    pub fn deactivate_campaign(env: Env, campaign_id: u64) {
        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.is_active, "Campaign is already inactive");

        campaign.is_active = false;

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            ("campaign", "deactivated"),
            campaign_id,
        );
    }

    pub fn get_campaign(env: Env, campaign_id: u64) -> Campaign {
        env.storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found")
    }

    pub fn register_influencer(
        env: Env,
        campaign_id: u64,
        influencer_address: Address,
    ) -> u64 {
        let campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.is_active, "Campaign is not active");

        let influencer_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::InfluencerCounter)
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::InfluencerCounter, &(influencer_id + 1));

        let influencer = Influencer {
            id: influencer_id,
            address: influencer_address,
            campaign_id,
            total_conversions: 0,
            total_earned: 0,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Influencer(influencer_id), &influencer);

        env.events().publish(
            ("influencer", "registered"),
            (influencer_id, campaign_id),
        );

        influencer_id
    }

    pub fn withdraw_earnings(env: Env, influencer_id: u64, to: Address) -> i128 {
        to.require_auth();

        let mut influencer: Influencer = env
            .storage()
            .persistent()
            .get(&DataKey::Influencer(influencer_id))
            .expect("Influencer not found");

        assert_eq!(
            influencer.address, to,
            "Only influencer owner can withdraw"
        );

        let amount = influencer.total_earned;
        assert!(amount > 0, "No earnings to withdraw");

        get_token_client(&env).transfer(
            &env.current_contract_address(),
            &to,
            &amount,
        );

        influencer.total_earned = 0;

        env.storage()
            .persistent()
            .set(&DataKey::Influencer(influencer_id), &influencer);

        env.events().publish(
            ("influencer", "earnings_withdrawn"),
            (influencer_id, amount),
        );

        amount
    }

    pub fn get_influencer(env: Env, influencer_id: u64) -> Influencer {
        env.storage()
            .persistent()
            .get(&DataKey::Influencer(influencer_id))
            .expect("Influencer not found")
    }

    pub fn register_conversion(
        env: Env,
        campaign_id: u64,
        influencer_id: u64,
        purchase_amount: i128,
        timestamp: u64,
    ) -> u64 {
        assert!(purchase_amount > 0, "Purchase amount must be positive");

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("Campaign not found");

        assert!(campaign.is_active, "Campaign is not active");

        let mut influencer: Influencer = env
            .storage()
            .persistent()
            .get(&DataKey::Influencer(influencer_id))
            .expect("Influencer not found");

        assert_eq!(
            influencer.campaign_id, campaign_id,
            "Influencer not in this campaign"
        );

        let commission = (purchase_amount
            .checked_mul(campaign.commission_rate as i128)
            .expect("Commission calculation overflow"))
            / 10000;

        let available = campaign.budget - campaign.spent;
        assert!(commission <= available, "Insufficient campaign budget");

        let conversion_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::ConversionCounter)
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::ConversionCounter, &(conversion_id + 1));

        let conversion = Conversion {
            id: conversion_id,
            campaign_id,
            influencer_id,
            purchase_amount,
            commission,
            timestamp,
        };

        campaign.spent = campaign
            .spent
            .checked_add(commission)
            .expect("Spent overflow");

        influencer.total_earned = influencer
            .total_earned
            .checked_add(commission)
            .expect("Total earned overflow");

        influencer.total_conversions = influencer
            .total_conversions
            .checked_add(1)
            .expect("Conversions overflow");

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.storage()
            .persistent()
            .set(&DataKey::Influencer(influencer_id), &influencer);

        env.storage()
            .persistent()
            .set(&DataKey::Conversion(conversion_id), &conversion);

        env.events().publish(
            ("conversion", "registered"),
            (conversion_id, campaign_id, influencer_id, commission),
        );

        conversion_id
    }

    pub fn get_conversion(env: Env, conversion_id: u64) -> Conversion {
        env.storage()
            .persistent()
            .get(&DataKey::Conversion(conversion_id))
            .expect("Conversion not found")
    }

    pub fn get_contract_balance(env: Env) -> i128 {
        get_token_client(&env).balance(&env.current_contract_address())
    }
}

fn get_token_client(env: &Env) -> token::Client {
    let token_address: Address = env
        .storage()
        .instance()
        .get(&DataKey::TokenAddress)
        .expect("Contract not initialized: call initialize() first");
    token::Client::new(env, &token_address)
}

mod test;
