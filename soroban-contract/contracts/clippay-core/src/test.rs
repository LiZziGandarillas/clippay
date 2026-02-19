#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
    token::{Client as TokenClient, StellarAssetClient as TokenAdminClient},
};

fn setup(env: &Env) -> (ClipPayContractClient, Address) {
    let contract_id = env.register(ClipPayContract, ());
    let client = ClipPayContractClient::new(env, &contract_id);

    let token_admin = Address::generate(env);
    let token_id = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_address = token_id.address();

    client.initialize(&token_address);

    (client, token_address)
}

fn mint_tokens(env: &Env, token_address: &Address, to: &Address, amount: i128) {
    let admin = Address::generate(env);
    let token_admin = TokenAdminClient::new(env, token_address);
    env.mock_all_auths();
    token_admin.mint(to, &amount);
}

fn setup_campaign_funded(
    env: &Env,
    client: &ClipPayContractClient,
    budget: i128,
    rate: u32,
) -> (u64, u64) {
    use types::DataKey;

    let business = Address::generate(env);
    let campaign_id = client.create_campaign(&business, &rate);

    env.as_contract(&client.address, || {
        let mut campaign: types::Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .unwrap();
        campaign.budget = budget;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
    });

    let influencer_addr = Address::generate(env);
    let influencer_id = client.register_influencer(&campaign_id, &influencer_addr);

    (campaign_id, influencer_id)
}

#[test]
fn test_initialize() {
    let env = Env::default();
    let (client, _token_address) = setup(&env);
    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    assert_eq!(campaign_id, 0);
}

#[test]
#[should_panic(expected = "Contract already initialized")]
fn test_initialize_twice_panics() {
    let env = Env::default();
    let (client, token_address) = setup(&env);
    client.initialize(&token_address);
}

#[test]
fn test_create_campaign() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    assert_eq!(campaign_id, 0);

    let campaign = client.get_campaign(&campaign_id);
    assert_eq!(campaign.id, 0);
    assert_eq!(campaign.business_id, business);
    assert_eq!(campaign.budget, 0);
    assert_eq!(campaign.spent, 0);
    assert_eq!(campaign.commission_rate, 500);
    assert_eq!(campaign.is_active, true);
}

#[test]
fn test_create_multiple_campaigns() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let id1 = client.create_campaign(&business, &500);
    let id2 = client.create_campaign(&business, &1000);

    assert_eq!(id1, 0);
    assert_eq!(id2, 1);
}

#[test]
#[should_panic(expected = "Commission rate must be between")]
fn test_create_campaign_rate_zero() {
    let env = Env::default();
    let (client, _) = setup(&env);
    let business = Address::generate(&env);
    client.create_campaign(&business, &0);
}

#[test]
#[should_panic(expected = "Commission rate must be between")]
fn test_create_campaign_rate_too_high() {
    let env = Env::default();
    let (client, _) = setup(&env);
    let business = Address::generate(&env);
    client.create_campaign(&business, &15000);
}

#[test]
fn test_deactivate_campaign() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    assert_eq!(client.get_campaign(&campaign_id).is_active, true);
    client.deactivate_campaign(&campaign_id);
    assert_eq!(client.get_campaign(&campaign_id).is_active, false);
}

#[test]
#[should_panic(expected = "Campaign is already inactive")]
fn test_deactivate_already_inactive() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    client.deactivate_campaign(&campaign_id);
    client.deactivate_campaign(&campaign_id);
}

#[test]
fn test_deposit_campaign_budget() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    let deposit_amount: i128 = 5_000_000_000;
    mint_tokens(&env, &token_address, &business, deposit_amount);

    let updated_campaign = client.deposit_campaign_budget(&campaign_id, &business, &deposit_amount);

    assert_eq!(updated_campaign.budget, deposit_amount);
    assert_eq!(updated_campaign.spent, 0);

    let token_client = TokenClient::new(&env, &token_address);
    assert_eq!(token_client.balance(&client.address), deposit_amount);
}

#[test]
#[should_panic(expected = "Amount must be positive")]
fn test_deposit_zero_amount() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    client.deposit_campaign_budget(&campaign_id, &business, &0);
}

#[test]
#[should_panic(expected = "Minimum deposit is 0.1 XLM")]
fn test_deposit_below_minimum() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    mint_tokens(&env, &token_address, &business, 500_000);
    client.deposit_campaign_budget(&campaign_id, &business, &500_000);
}

#[test]
#[should_panic(expected = "Only campaign owner can deposit")]
fn test_deposit_wrong_owner() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    let business = Address::generate(&env);
    let attacker = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    mint_tokens(&env, &token_address, &attacker, 5_000_000_000);
    client.deposit_campaign_budget(&campaign_id, &attacker, &5_000_000_000);
}

#[test]
#[should_panic(expected = "Campaign is not active")]
fn test_deposit_inactive_campaign() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    client.deactivate_campaign(&campaign_id);

    mint_tokens(&env, &token_address, &business, 5_000_000_000);
    client.deposit_campaign_budget(&campaign_id, &business, &5_000_000_000);
}

#[test]
fn test_register_influencer() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    let influencer_addr = Address::generate(&env);
    let influencer_id = client.register_influencer(&campaign_id, &influencer_addr);

    assert_eq!(influencer_id, 0);

    let influencer = client.get_influencer(&influencer_id);
    assert_eq!(influencer.id, 0);
    assert_eq!(influencer.address, influencer_addr);
    assert_eq!(influencer.campaign_id, campaign_id);
    assert_eq!(influencer.total_conversions, 0);
    assert_eq!(influencer.total_earned, 0);
}

#[test]
#[should_panic(expected = "Campaign not found")]
fn test_register_influencer_campaign_not_found() {
    let env = Env::default();
    let (client, _) = setup(&env);
    let influencer_addr = Address::generate(&env);
    client.register_influencer(&999, &influencer_addr);
}

#[test]
#[should_panic(expected = "Campaign is not active")]
fn test_register_influencer_inactive_campaign() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    client.deactivate_campaign(&campaign_id);

    let influencer_addr = Address::generate(&env);
    client.register_influencer(&campaign_id, &influencer_addr);
}

#[test]
fn test_register_conversion_full_flow() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 1_000_000_000, 500);

    let purchase_amount: i128 = 100_000_000;
    let expected_commission = purchase_amount * 500 / 10000;

    let conversion_id = client.register_conversion(
        &campaign_id,
        &influencer_id,
        &purchase_amount,
        &1707908400,
    );

    assert_eq!(conversion_id, 0);

    let conversion = client.get_conversion(&conversion_id);
    assert_eq!(conversion.campaign_id, campaign_id);
    assert_eq!(conversion.influencer_id, influencer_id);
    assert_eq!(conversion.purchase_amount, purchase_amount);
    assert_eq!(conversion.commission, expected_commission);

    let campaign = client.get_campaign(&campaign_id);
    assert_eq!(campaign.spent, expected_commission);

    let influencer = client.get_influencer(&influencer_id);
    assert_eq!(influencer.total_earned, expected_commission);
    assert_eq!(influencer.total_conversions, 1);
}

#[test]
#[should_panic(expected = "Insufficient campaign budget")]
fn test_conversion_insufficient_budget() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 1_000_000, 500);

    client.register_conversion(&campaign_id, &influencer_id, &1_000_000_000, &1707908400);
}

#[test]
fn test_multiple_conversions_accumulate_correctly() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 10_000_000_000, 500);

    client.register_conversion(&campaign_id, &influencer_id, &100_000_000, &1707908400);
    client.register_conversion(&campaign_id, &influencer_id, &200_000_000, &1707908500);

    let influencer = client.get_influencer(&influencer_id);
    assert_eq!(influencer.total_conversions, 2);

    let expected_total = (100_000_000 + 200_000_000) * 500 / 10000;
    assert_eq!(influencer.total_earned, expected_total);
}

#[test]
fn test_commission_calculation_10_percent() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 10_000_000_000, 1000);

    let conversion_id = client.register_conversion(
        &campaign_id,
        &influencer_id,
        &100_000_000,
        &1707908400,
    );

    let conversion = client.get_conversion(&conversion_id);
    assert_eq!(conversion.commission, 10_000_000);
}

#[test]
#[should_panic(expected = "Campaign is not active")]
fn test_conversion_on_inactive_campaign() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 1_000_000_000, 500);

    client.deactivate_campaign(&campaign_id);
    client.register_conversion(&campaign_id, &influencer_id, &100_000_000, &1707908400);
}

#[test]
#[should_panic(expected = "Purchase amount must be positive")]
fn test_conversion_zero_amount() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 1_000_000_000, 500);

    client.register_conversion(&campaign_id, &influencer_id, &0, &1707908400);
}

#[test]
#[should_panic(expected = "Influencer not in this campaign")]
fn test_conversion_wrong_campaign() {
    let env = Env::default();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id_1 = client.create_campaign(&business, &500);
    let campaign_id_2 = client.create_campaign(&business, &500);

    let influencer_addr = Address::generate(&env);
    let influencer_id = client.register_influencer(&campaign_id_1, &influencer_addr);

    env.as_contract(&client.address, || {
        use types::DataKey;
        let mut campaign: types::Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id_2))
            .unwrap();
        campaign.budget = 1_000_000_000;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id_2), &campaign);
    });

    client.register_conversion(&campaign_id_2, &influencer_id, &100_000_000, &1707908400);
}

#[test]
fn test_withdraw_earnings() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    let budget: i128 = 5_000_000_000;
    mint_tokens(&env, &token_address, &business, budget);
    client.deposit_campaign_budget(&campaign_id, &business, &budget);

    let influencer_addr = Address::generate(&env);
    let influencer_id = client.register_influencer(&campaign_id, &influencer_addr);
    client.register_conversion(&campaign_id, &influencer_id, &100_000_000, &1707908400);

    let expected_commission: i128 = 100_000_000 * 500 / 10000;

    let token_client = TokenClient::new(&env, &token_address);
    let balance_before = token_client.balance(&influencer_addr);

    let withdrawn = client.withdraw_earnings(&influencer_id, &influencer_addr);
    assert_eq!(withdrawn, expected_commission);

    let balance_after = token_client.balance(&influencer_addr);
    assert_eq!(balance_after - balance_before, expected_commission);

    let influencer = client.get_influencer(&influencer_id);
    assert_eq!(influencer.total_earned, 0);
}

#[test]
#[should_panic(expected = "No earnings to withdraw")]
fn test_withdraw_no_earnings() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _) = setup(&env);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);

    let influencer_addr = Address::generate(&env);
    let influencer_id = client.register_influencer(&campaign_id, &influencer_addr);

    client.withdraw_earnings(&influencer_id, &influencer_addr);
}

#[test]
#[should_panic(expected = "Only influencer owner can withdraw")]
fn test_withdraw_wrong_owner() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _) = setup(&env);

    let (campaign_id, influencer_id) =
        setup_campaign_funded(&env, &client, 1_000_000_000, 500);

    client.register_conversion(&campaign_id, &influencer_id, &100_000_000, &1707908400);

    let attacker = Address::generate(&env);
    client.withdraw_earnings(&influencer_id, &attacker);
}

#[test]
fn test_get_contract_balance() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, token_address) = setup(&env);

    assert_eq!(client.get_contract_balance(), 0);

    let business = Address::generate(&env);
    let campaign_id = client.create_campaign(&business, &500);
    let deposit: i128 = 5_000_000_000;
    mint_tokens(&env, &token_address, &business, deposit);
    client.deposit_campaign_budget(&campaign_id, &business, &deposit);

    assert_eq!(client.get_contract_balance(), deposit);
}
