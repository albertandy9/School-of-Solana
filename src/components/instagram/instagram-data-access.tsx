import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAnchorProvider } from '@/components/solana/use-anchor-provider'
import { useTransactionToast } from '@/components/use-transaction-toast'
import { useMemo } from 'react'
import * as anchor from '@coral-xyz/anchor'
import { getBasicProgram, getBasicProgramId } from '@project/anchor'
import { useCluster } from '@/components/cluster/cluster-data-access'
import { Cluster } from '@solana/web3.js'

interface PostAccount {
  publicKey: PublicKey
  account: {
    author: PublicKey
    timestamp: anchor.BN
    topic: string
    content: string
  }
}

export function useInstagramProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const transactionToast = useTransactionToast()

  const programId = useMemo(() => getBasicProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBasicProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['instagram', 'all', { cluster }],
    queryFn: () => program?.account.post.all() ?? [],
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createPost = useMutation({
    mutationKey: ['instagram', 'create-post', { cluster }],
    mutationFn: async ({ topic, content }: { topic: string; content: string }) => {
      if (!program || !provider?.wallet?.publicKey) {
        throw new Error('Program or wallet not available')
      }

      const post = anchor.web3.Keypair.generate()

      return program.methods
        .sendPost(topic, content)
        .accounts({
          post: post.publicKey,
          author: provider.wallet.publicKey,
        })
        .signers([post])
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => {
      // Handle error
    },
  })

  const updatePost = useMutation({
    mutationKey: ['instagram', 'update-post', { cluster }],
    mutationFn: async ({
      postPublicKey,
      topic,
      content,
    }: {
      postPublicKey: PublicKey
      topic: string
      content: string
    }) => {
      if (!program || !provider?.wallet?.publicKey) {
        throw new Error('Program or wallet not available')
      }

      return program.methods
        .updatePost(topic, content)
        .accounts({
          post: postPublicKey,
          // author: provider.wallet.publicKey,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
  })

  const deletePost = useMutation({
    mutationKey: ['instagram', 'delete-post', { cluster }],
    mutationFn: async ({ postPublicKey }: { postPublicKey: PublicKey }) => {
      if (!program || !provider?.wallet?.publicKey) {
        throw new Error('Program or wallet not available')
      }

      return program.methods
        .deletePost()
        .accounts({
          post: postPublicKey,
          // author: provider.wallet.publicKey,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
  })

  return useMemo(
    () => ({
      program,
      programId,
      accounts,
      getProgramAccount,
      createPost,
      updatePost,
      deletePost,
    }),
    [accounts, getProgramAccount, program, programId, createPost, updatePost, deletePost],
  )
}

export function useInstagramProgramAccount({ account }: { account: PublicKey }) {
  const { connection } = useConnection()

  return useQuery({
    queryKey: ['instagram', 'account', { account }],
    queryFn: () => connection.getParsedAccountInfo(account),
  })
}

// Helper functions for filtering posts
export function useFilteredPosts() {
  const { accounts } = useInstagramProgram()

  const posts = useMemo(() => {
    if (!accounts.data) return []
    return accounts.data.map((account: any) => ({
      publicKey: account.publicKey,
      account: account.account,
    })) as PostAccount[]
  }, [accounts.data])

  const filterByAuthor = useMemo(
    () => (author: PublicKey) => {
      return posts.filter((post: PostAccount) => post.account.author.toBase58() === author.toBase58())
    },
    [posts],
  )

  const filterByTopic = useMemo(
    () => (topic: string) => {
      return posts.filter((post: PostAccount) => post.account.topic === topic)
    },
    [posts],
  )

  const getAllTopics = useMemo(() => {
    return [...new Set(posts.map((post) => post.account.topic).filter(Boolean))]
  }, [posts])

  const getAllAuthors = useMemo(() => {
    return [...new Set(posts.map((post) => post.account.author.toBase58()))]
  }, [posts])

  return {
    posts,
    filterByAuthor,
    filterByTopic,
    getAllTopics,
    getAllAuthors,
    isLoading: accounts.isLoading,
    error: accounts.error,
  }
}
