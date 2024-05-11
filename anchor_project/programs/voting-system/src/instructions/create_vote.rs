use super::Vote;
use anchor_lang::prelude::*;

pub fn _create_vote(ctx: Context<CreateVote>, topic: String, options: Vec<String>) -> Result<()> {
    let vote = &mut ctx.accounts.vote;
    let len = options.len();
    vote.topic = topic;
    vote.options = options;
    vote.votes = vec![0; len];
    Ok(())
}

#[derive(Accounts)]
#[instruction(topic:String)]
pub struct CreateVote<'info> {
    #[account(init, payer = user, space = 8 + Vote::INIT_SPACE, seeds = [b"vote",topic.as_bytes()], bump)]
    pub vote: Account<'info, Vote>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
