# Project Description

**Deployed Frontend URL:** https://instashot2.vercel.app

**Solana Program ID:** `9uN37h9wSc4yUyMxkfnbtSxuTrAUEEfbqwkhuvnRtADL` 

## Project Overview

### Description

InstaShot is a decentralized social media platform that brings Instagram's visual storytelling experience to the Solana blockchain. Users can share moments through posts with rich captions, discover content through hashtags, and build communities around shared interests. Every post lives permanently on-chain, creating an immutable record of digital memories while maintaining true ownership of content.

The platform transforms traditional social media by eliminating centralized control - no algorithm decides what you see, no corporation owns your data, and no single entity can delete your memories. Built with React and modern web technologies, InstaShot delivers a familiar Instagram-like experience while leveraging blockchain's transparency and permanence.

### Key Features

- **Visual Post Sharing**: Create posts with captions up to 2200 characters, perfect for storytelling and detailed content
- **Hashtag Discovery**: Organize and find content through hashtag systems, building topic-based communities
- **Wallet-Based Profiles**: Your Solana wallet becomes your identity, with auto-generated avatars and activity tracking
- **Story Highlights**: Visual story section showcasing recent community activity and user engagement
- **On-Chain Permanence**: All content stored directly on Solana, ensuring posts can never be censored or lost
- **Real-Time Feed**: Live updates as new posts are created across the network
- **Community Browsing**: Discover other creators and explore their content libraries
- **Content Ownership**: Full CRUD operations - edit or delete your posts while maintaining blockchain transparency

### How to Use the dApp

1. **Connect Wallet**
   - Click the gradient wallet button in the sidebar
   - Select your Solana wallet (Phantom, Solflare, etc.)
   - Approve the connection to start creating

2. **Share Your First Moment**
   - ENavigate to the home feed or profile page
   - Add an optional hashtag to categorize your content
   - Write your caption (up to 50 characters for full storytelling)
   - Click "Share" and confirm the blockchain transaction

3. **Discover Content**
   - Browse the home feed for chronological posts from all users
   - Use the Search page to explore popular hashtags and topics
   - Visit individual user profiles to see their complete post collections
   - Engage with posts through likes, comments, and bookmarks

4. **Manage Your Content**
   - Access your Profile page to view all your posts and activity stats
   - Edit existing posts by clicking the edit button (updates the blockchain record)
   - Delete posts permanently to close accounts and reclaim rent
   - Track your posting activity and engagement metrics

## Program Architecture

InstaShot leverages a straightforward account-based architecture on Solana, prioritizing simplicity and gas efficiency over complex state management. Each post exists as an individual account, allowing for parallel processing and easy content management.

### PDA Usage

This implementation intentionally avoids Program Derived Addresses (PDAs) in favor of a simpler account-per-post model. This design choice was made for simplicity and to avoid the complexity of seed management for PDAs.

**Account Creation Strategy:**

- Individual keypairs generated client-side for each post
- Creator pays rent and owns the account directly
- Account closure refunds rent when posts are deleted

### Program Instructions

**Instructions Implemented:**

- **create_post**: Initializes a new post account with caption and hashtag data
  - Validates input lengths and content safety
  - Sets timestamp and author information
  - Allocates appropriate account space for content storage

- **update_post**: Modifies existing post content while preserving metadata
  - Enforces author-only permissions through account validation
  - Updates caption and hashtag fields in-place
  - Maintains original timestamp and creation data

- **delete_post**: Permanently removes post and reclaims account rent
  - Verifies author permissions before execution
  - Closes account and returns SOL to creator
  - Creates immutable deletion record on blockchain

### Account Structure

```rust
#[account]
pub struct Tweet {
    pub author: Pubkey,        // 32 bytes - Public key of the post author
    pub timestamp: i64,        // 8 bytes - Unix timestamp when post was created
    pub caption: String,         // Variable - Topic/hashtag (max 50 chars * 4 bytes UTF-8)
    pub content: String,       // Variable - Tweet content (max 50 chars * 4 bytes UTF-8)
}
```

**Context Structures:**

```rust
#[account]
pub struct Post {
    pub author: Pubkey,        // Creator's wallet address
    pub timestamp: i64,        // Unix timestamp of creation
    pub hashtag: String,       // Optional topic categorization (max 50 chars)
    pub caption: String,       // Main post content (max 50 chars)
}

// Account allocation: ~9KB per post
// Supports rich captions while maintaining cost efficiency
```

## Testing

### Test Coverage

The testing suite covers both functional operations and edge cases to ensure robust blockchain interactions and proper error handling.

**Happy Path Tests:**

- **Send Post**: Successfully create a post with topic and content
- **Send Post Without Caption**: Create a post with only content
- **Multiple Authors**: Different users can create post independently
- **Fetch All Post**: Retrieve all post from the program
- **Filter by Author**: Fetch post from a specific author
- **Filter by Caption**: Fetch post with specific topics
- **Update Post**: Successfully modify an existing post
- **Delete Post**: Successfully remove a post and close the account

**Unhappy Path Tests:**

- **Caption Too Long**: Reject post with captions exceeding 50 characters
- **Unauthorized Update**: Prevent users from updating other users' post
- **Unauthorized Delete**: Prevent users from deleting other users' post

### Running Tests

```bash
# Install dependencies
npm install

# Build the program
anchor build

# Start local validator (in separate terminal)
solana-test-validator

# Deploy program to local network
anchor deploy

# Run all tests
anchor test

# Run tests without local validator (if already running)
anchor test --skip-local-validator
```

### Frontend Testing

```bash

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Additional Notes for Evaluators

**Architecture Decisions:**

- Chose individual accounts over PDAs to keep things simple and showcase fundamental Anchor account handling
- Implemented React with Vite and TypeScript for better development
- Using `@solana/wallet-adapter-react` used to wallet connectivity

**Key Features to Test:**

1. Content creation and deletion with inline editing interface
2. Real-time data fetching and display

**UI/UX Improvements:**

- Wallet connect/disconnect is integrated directly within the profile area (similar to Instagram’s edit profile button), without requiring a separate section.
- Grid and feed views for posts, smooth transitions when opening post details, inline interactions (like, comment, edit, delete) directly in the feed, and a consistent neutral visual style that keeps the focus on content.
**Technical Stack:**

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Wallet Integration**: @solana/wallet-adapter-react, @solana/wallet-adapter-react-ui
- **Blockchain**: @coral-xyz/anchor v0.31.1 and Anchor Framework
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v7
- **UI Components**: Tailwind CSS

**Known Limitations:**

- User identity is limited to displaying the connected wallet address
- No direct messaging 

**Security Considerations:**

- Accounts must remain rent-exempt with proper closure handling, and all local state is cleared upon wallet disconnection.
