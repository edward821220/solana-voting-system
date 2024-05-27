use super::{Vote, VoteManager};
use anchor_lang::prelude::*;

pub fn _create_vote(
    ctx: Context<CreateVote>,
    topic: String,
    options: Vec<String>,
    end_time: i64,
) -> Result<()> {
    let vote_manager = &mut ctx.accounts.vote_manager;
    let vote = &mut ctx.accounts.vote;
    let len = options.len();
    vote.id = vote_manager.total_votes;
    vote.topic = topic;
    vote.options = options;
    vote.votes = vec![0; len];
    vote.end_time = end_time;
    vote_manager.total_votes += 1;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateVote<'info> {
    #[account(mut)]
    pub vote_manager: Account<'info, VoteManager>,
    #[account(init, payer = user, space = 8 + Vote::INIT_SPACE, seeds = [b"vote", vote_manager.total_votes.to_le_bytes().as_ref()], bump)]
    pub vote: Account<'info, Vote>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
