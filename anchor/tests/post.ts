import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Base } from '../target/types/base'
import * as assert from 'assert'
import * as bs58 from 'bs58'

describe('base', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())
  const program = anchor.workspace.Base as Program<Base>

  const sendPost = async (author: anchor.web3.PublicKey, topic: string, content: string) => {
    const post = anchor.web3.Keypair.generate()
    await program.methods
      .sendPost(topic, content)
      .accounts({
        post: post.publicKey, 
        author,
      })
      .signers([post])
      .rpc()

    return post
  }

  it('can send a new post', async () => {
    const post = anchor.web3.Keypair.generate()
    await program.methods
      .sendPost('veganism', 'Hummus, am I right?')
      .accounts({
        post: post.publicKey,
        author: program.provider.wallet!.publicKey,
      })
      .signers([post])
      .rpc()

    const postAccount = await program.account.post.fetch(post.publicKey)

    assert.equal(postAccount.author.toBase58(), program.provider.wallet!.publicKey.toBase58())
    assert.equal(postAccount.topic, 'veganism')
    assert.equal(postAccount.content, 'Hummus, am I right?')
    assert.ok(postAccount.timestamp)
  })

  it('can send a new post without a caption', async () => {
    const post = anchor.web3.Keypair.generate()
    await program.methods
      .sendPost('', 'gm')
      .accounts({
        post: post.publicKey,
        author: program.provider.wallet!.publicKey,
      })
      .signers([post])
      .rpc()

    const postAccount = await program.account.post.fetch(post.publicKey)

    assert.equal(postAccount.author.toBase58(), program.provider.wallet!.publicKey.toBase58())
    assert.equal(postAccount.topic, '')
    assert.equal(postAccount.content, 'gm')
    assert.ok(postAccount.timestamp)
  })

  it('can send a new post from a different people', async () => {
    const otherUser = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    const post = anchor.web3.Keypair.generate()
    await program.methods
      .sendPost('veganism', 'Yay Tofu!')
      .accounts({
        post: post.publicKey,
        author: otherUser.publicKey,
      })
      .signers([otherUser, post])
      .rpc()

    const postAccount = await program.account.post.fetch(post.publicKey)

    assert.equal(postAccount.author.toBase58(), otherUser.publicKey.toBase58())
    assert.equal(postAccount.topic, 'veganism')
    assert.equal(postAccount.content, 'Yay Tofu!')
    assert.ok(postAccount.timestamp)
  })

  it('cannot provide a caption with more than 50 characters', async () => {
    try {
      const post = anchor.web3.Keypair.generate()
      const topicWith51Chars = 'x'.repeat(51)
      await program.methods
        .sendPost(topicWith51Chars, 'Hummus, am I right?')
        .accounts({
          post: post.publicKey,
          author: program.provider.wallet!.publicKey,
        })
        .signers([post])
        .rpc()
    } catch (error: any) {
      assert.equal(error.error.errorMessage, 'The provided caption should be 50 characters long maximum.')
      return
    }

    assert.fail('The instruction should have failed with a 51-character topic.')
  })

  it('can fetch all posts', async () => {
    const postAccounts = await program.account.post.all()
    assert.equal(postAccounts.length, 3)
  })

  it('can filter posts by people', async () => {
    const authorPublicKey = program.provider.wallet!.publicKey
    const postAccounts = await program.account.post.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: authorPublicKey.toBase58(),
        },
      },
    ])

    assert.equal(postAccounts.length, 2)
    assert.ok(
      postAccounts.every((postAccount) => {
        return postAccount.account.author.toBase58() === authorPublicKey.toBase58()
      }),
    )
  })

  it('can filter posts by captions', async () => {
    const postAccounts = await program.account.post.all([
      {
        memcmp: {
          offset:
            8 + 
            32 + 
            8 + 
            4, 
          bytes: bs58.encode(Buffer.from('veganism')),
        },
      },
    ])

    assert.equal(postAccounts.length, 2)
    assert.ok(
      postAccounts.every((postAccount) => {
        return postAccount.account.topic === 'veganism'
      }),
    )
  })

  it('can update a post', async () => {
    const author = program.provider.wallet!.publicKey
    const post = await sendPost(author, 'web2', 'Hello World!')
    const postAccount = await program.account.post.fetch(post.publicKey)

    assert.equal(postAccount.topic, 'web2')
    assert.equal(postAccount.content, 'Hello World!')

    await program.methods
      .updatePost('solana', 'gm everyone!')
      .accounts({
        post: post.publicKey,
        author,
      })
      .rpc()

    const updatedPostAccount = await program.account.post.fetch(post.publicKey)
    assert.equal(updatedPostAccount.topic, 'solana')
    assert.equal(updatedPostAccount.content, 'gm everyone!')
  })

  it("cannot update someone else's post", async () => {
    const author = program.provider.wallet!.publicKey
    const post = await sendPost(author, 'solana', 'Solana is awesome!')

    try {
      await program.methods
        .updatePost('eth', 'Ethereum is awesome!')
        .accounts({
          post: post.publicKey,
          author: anchor.web3.Keypair.generate().publicKey,
        })
        .rpc()
      assert.fail("We were able to update someone else's post.")
    } catch (error: any) {
      const postAccount = await program.account.post.fetch(post.publicKey)
      assert.equal(postAccount.topic, 'solana')
      assert.equal(postAccount.content, 'Solana is awesome!')
    }
  })

  it('can delete a post', async () => {
    const author = program.provider.wallet!.publicKey
    const post = await sendPost(author, 'solana', 'gm')

    await program.methods
      .deletePost()
      .accounts({
        post: post.publicKey,
        author,
      })
      .rpc()

    const postAccount = await program.account.post.fetchNullable(post.publicKey)
    assert.ok(postAccount === null)
  })

  it("cannot delete someone else's post", async () => {
    const author = program.provider.wallet!.publicKey
    const post = await sendPost(author, 'solana', 'gm')

    try {
      await program.methods
        .deletePost()
        .accounts({
          post: post.publicKey,
          author: anchor.web3.Keypair.generate().publicKey,
        })
        .rpc()
      assert.fail("We were able to delete someone else's post.")
    } catch (error: any) {
      const postAccount = await program.account.post.fetch(post.publicKey)
      assert.equal(postAccount.topic, 'solana')
      assert.equal(postAccount.content, 'gm')
    }
  })
})
