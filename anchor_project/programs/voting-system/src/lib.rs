pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("FDgFxeYS7Bw1NCx38qwg6xnR8ELicuGKGHcT6aDwUDBX");

#[program]
pub mod voting_system {
    use super::*;

    pub fn init_vote_manager(ctx: Context<InitVoteManager>) -> Result<()> {
        _init_vote_manager(ctx)
    }

    pub fn create_vote(
        ctx: Context<CreateVote>,
        topic: String,
        options: Vec<String>,
        end_time: i64,
    ) -> Result<()> {
        _create_vote(ctx, topic, options, end_time)
    }

    pub fn execute_vote(ctx: Context<ExecuteVote>, index: u64) -> Result<()> {
        _execute_vote(ctx, index as usize)
    }
}
