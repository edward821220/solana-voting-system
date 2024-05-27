use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VoteManager {
    pub total_votes: u64,
}
