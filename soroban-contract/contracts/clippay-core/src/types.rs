#![allow(dead_code)]
use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub id: u64,
    pub business_id: Address,
    pub budget: i128,
    pub spent: i128,
    pub commission_rate: u32,
    pub is_active: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Influencer {
    pub id: u64,
    pub address: Address,
    pub campaign_id: u64,
    pub total_conversions: u32,
    pub total_earned: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Conversion {
    pub id: u64,
    pub campaign_id: u64,
    pub influencer_id: u64,
    pub purchase_amount: i128,
    pub commission: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Campaign(u64),
    Influencer(u64),
    Conversion(u64),
    CampaignCounter,
    InfluencerCounter,
    ConversionCounter,
    TokenAddress,
}
