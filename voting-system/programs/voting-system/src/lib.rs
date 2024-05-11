pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("ARRHD7kASuE4zSEssjL3RYLRQDRvnNFCTn7J4ffCbdhM");

#[program]
pub mod voting_system {
    use super::*;

    pub fn create_vote(
        ctx: Context<CreateVote>,
        topic: String,
        options: Vec<String>,
    ) -> Result<()> {
        _create_vote(ctx, topic, options)
    }

    pub fn execute_vote(ctx: Context<ExecuteVote>, index: u64) -> Result<()> {
        _execute_vote(ctx, index as usize)
    }
}
