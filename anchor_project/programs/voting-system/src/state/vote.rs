use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    #[max_len(64)]
    pub topic: String,
    #[max_len(20, 32)]
    pub options: Vec<String>,
    #[max_len(20)]
    pub votes: Vec<u32>,
    pub end_time: i64,
}
