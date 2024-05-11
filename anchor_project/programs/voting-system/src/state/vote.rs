use anchor_lang::prelude::*;

#[account]
pub struct Vote {
    pub topic: String,
    pub options: Vec<String>,
    pub votes: Vec<u32>,
}

impl Vote {
    pub const MAX_TOPIC_LENGTH: usize = 64;
    pub const MAX_OPTION_LENGTH: usize = 32;
    pub const MAX_OPTIONS_LENGTH: usize = 20;
    pub const MAX_VOTES_LENGTH: usize = 20;
    pub const MAX_SIZE: usize = (4 + Vote::MAX_TOPIC_LENGTH)
        + (4 + Vote::MAX_OPTION_LENGTH * Vote::MAX_OPTIONS_LENGTH)
        + (4 + 4 * Vote::MAX_VOTES_LENGTH);
}
