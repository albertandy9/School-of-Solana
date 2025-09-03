import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useInstagramProgram } from './instagram-data-access'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Link } from 'react-router'

dayjs.extend(relativeTime)

interface PostAccount {
  publicKey: PublicKey
  account: {
    author: PublicKey
    timestamp: any // BN type
    topic: string
    content: string
  }
}

interface PostCardProps {
  post: PostAccount
  showActions?: boolean
}

export function PostCard({ post, showActions = true }: PostCardProps) {
  const { publicKey } = useWallet()
  const { updatePost, deletePost } = useInstagramProgram()
  const [isEditing, setIsEditing] = useState(false)
  const [editTopic, setEditTopic] = useState(post.account.topic)
  const [editContent, setEditContent] = useState(post.account.content)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100))
  const [isBookmarked, setIsBookmarked] = useState(false)

  const isAuthor = publicKey && post.account.author.equals(publicKey)
  const timestamp =
    typeof post.account.timestamp === 'object' && post.account.timestamp.toNumber
      ? dayjs.unix(post.account.timestamp.toNumber()).fromNow()
      : dayjs().fromNow()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editContent.trim()) return
    if (editContent.length > 2200) return
    if (editTopic.length > 50) return

    try {
      await updatePost.mutateAsync({
        postPublicKey: post.publicKey,
        topic: editTopic.trim(),
        content: editContent.trim(),
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deletePost.mutateAsync({ postPublicKey: post.publicKey })
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditTopic(post.account.topic)
    setEditContent(post.account.content)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-lg mx-auto mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/users/${post.account.author.toBase58()}`} className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {post.account.author.toBase58().slice(0, 2).toUpperCase()}
            </div>
          </Link>
          <div>
            <Link to={`/users/${post.account.author.toBase58()}`} className="font-semibold text-sm text-black hover:underline">
              {post.account.author.toBase58().slice(0, 8)}...{post.account.author.toBase58().slice(-4)}
            </Link>
            <div className="text-xs text-gray-500">{timestamp}</div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {/* Topic */}
        {post.account.topic && (
          <div className="mb-2">
            <Link to={`/search?q=${post.account.topic}`} className="text-blue-600 hover:underline text-sm font-medium">
              #{post.account.topic}
            </Link>
          </div>
        )}

        {/* Post Content */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3">
            <div className="space-y-2">
              <input
                value={editTopic}
                onChange={(e) => setEditTopic(e.target.value)}
                maxLength={50}
                placeholder="Hashtag..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={2200}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                size="sm"
                disabled={updatePost.isPending || !editContent.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {updatePost.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={cancelEdit} disabled={updatePost.isPending}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.account.content}</div>
        )}
      </div>

      {/* Image placeholder */}
      <div className="bg-gray-100 aspect-square mx-4 mb-3 rounded-lg flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📸</div>
          <div className="text-xs">Image placeholder</div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="text-gray-700 hover:text-gray-900 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="text-gray-700 hover:text-gray-900 transition-colors">
                <Send className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`transition-colors ${
                isBookmarked ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Likes count */}
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </div>

          {/* Author actions */}
          {isAuthor && !isEditing && (
            <div className="flex space-x-4 text-xs">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-blue-500 font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePost.isPending}
                className="text-gray-500 hover:text-red-500 font-medium disabled:opacity-50"
              >
                {deletePost.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
