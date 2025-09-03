use anchor_lang::prelude::*;

declare_id!("9uN37h9wSc4yUyMxkfnbtSxuTrAUEEfbqwkhuvnRtADL");

#[program]
pub mod base {
    use super::*;
    
    #[inline(never)]
    pub fn send_post(ctx: Context<SendPost>, topic: String, content: String) -> Result<()> {
        let post: &mut Account<Post> = &mut ctx.accounts.post;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        // Validate topic & content length
        require!(topic.chars().count() <= 50, ErrorCode::TopicTooLong);
        require!(content.chars().count() <= 50, ErrorCode::ContentTooLong);

        post.author = *author.key;
        post.timestamp = clock.unix_timestamp;
        post.topic = topic;
        post.content = content;

        Ok(())
    }

    #[inline(never)]
    pub fn update_post(ctx: Context<UpdatePost>, topic: String, content: String) -> Result<()> {
        let post: &mut Account<Post> = &mut ctx.accounts.post;

        require!(topic.chars().count() <= 50, ErrorCode::TopicTooLong);
        require!(content.chars().count() <= 50, ErrorCode::ContentTooLong);

        post.topic = topic;
        post.content = content;

        Ok(())
    }

    #[inline(never)]
    pub fn delete_post(_ctx: Context<DeletePost>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendPost<'info> {
    #[account(init, payer = author, space = Post::LEN)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut, has_one = author)]
    pub post: Account<'info, Post>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(mut, has_one = author, close = author)]
    pub post: Account<'info, Post>,
    pub author: Signer<'info>,
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_TOPIC_LENGTH: usize = 50 * 4; // 50 chars max.
const MAX_CONTENT_LENGTH: usize = 50 * 4; // 50 chars max.

impl Post {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH  // Timestamp.
        + STRING_LENGTH_PREFIX + MAX_TOPIC_LENGTH // Topic.
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH; // Content.
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided caption should be 50 characters long maximum.")]
    TopicTooLong,
    #[msg("The provided content should be 50 characters long maximum.")]
    ContentTooLong,
}
