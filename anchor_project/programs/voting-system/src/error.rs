use anchor_lang::prelude::*;

#[error_code]
pub enum VoteError {
    #[msg("Already voted!")]
    AlreadyVoted,
    #[msg("Vote ended!")]
    VoteEnded,
}
