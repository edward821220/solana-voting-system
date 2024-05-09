use anchor_lang::prelude::*;

declare_id!("Hi9cu3A6LHB8kuVXFEH8RDCDWSLxSyoEG5bCo9RJ6b7X");

#[program]
pub mod project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
