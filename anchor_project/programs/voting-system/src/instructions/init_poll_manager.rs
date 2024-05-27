use super::VoteManager;
use anchor_lang::prelude::*;

pub fn _init_vote_manager(ctx: Context<InitVoteManager>) -> Result<()> {
    let vote_manager = &mut ctx.accounts.vote_manager;
    vote_manager.total_votes = 0;
    Ok(())
}

#[derive(Accounts)]
pub struct InitVoteManager<'info> {
    #[account(init, payer = user, space = 8 + VoteManager::INIT_SPACE, seeds = [b"vote_manager"], bump)]
    pub vote_manager: Account<'info, VoteManager>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
