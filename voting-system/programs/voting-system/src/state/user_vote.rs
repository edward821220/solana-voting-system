use anchor_lang::prelude::*;

#[account]
pub struct UserVote {
    pub user: Pubkey,
    pub vote: Pubkey,
    pub has_voted: bool,
}
