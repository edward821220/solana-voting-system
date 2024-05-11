use super::{UserVote, Vote, VoteError};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ExecuteVote<'info> {
    #[account(mut)]
    pub vote: Account<'info, Vote>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [
            user.key().as_ref(),
            vote.key().as_ref()
        ],
        bump,
        space = 8 + std::mem::size_of::<UserVote>()
    )]
    pub user_vote: Account<'info, UserVote>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn _execute_vote(ctx: Context<ExecuteVote>, index: usize) -> Result<()> {
    let vote = &mut ctx.accounts.vote;
    let user_vote = &mut ctx.accounts.user_vote;
    require!(!user_vote.has_voted, VoteError::AlreadyVoted);

    user_vote.has_voted = true;
    user_vote.user = ctx.accounts.user.key();
    user_vote.vote = vote.key();
    vote.votes[index] += 1;
    Ok(())
}
