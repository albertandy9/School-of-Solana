import { useWallet } from '@solana/wallet-adapter-react'
import { useFilteredPosts } from './instagram-data-access'
import { PostForm } from './instagram-form'
import { PostCard } from './instagram-card'
import { Settings, Grid, Bookmark, Tag } from 'lucide-react'

export function PageProfile() {
  const { publicKey } = useWallet()
  const { filterByAuthor, isLoading, error } = useFilteredPosts()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-red-500 text-center">Error loading profile: {error.message}</div>
      </div>
    )
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm max-w-md">
          <div className="text-gray-400 text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-6">Please connect your wallet to view and manage your profile.</p>
          <div className="text-sm text-gray-400">Your posts and profile will appear here once connected.</div>
        </div>
      </div>
    )
  }

  const userPosts = filterByAuthor(publicKey).sort((a, b) => {
    const aTime =
      typeof a.account.timestamp === 'object' && a.account.timestamp.toNumber ? a.account.timestamp.toNumber() : 0
    const bTime =
      typeof b.account.timestamp === 'object' && b.account.timestamp.toNumber ? b.account.timestamp.toNumber() : 0
    return bTime - aTime
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-6">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-6 md:space-y-0">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto md:mx-0">
                {publicKey.toBase58().slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6">
                <h1 className="text-2xl font-light text-gray-900">
                  {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-4)}
                </h1>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <span>Edit Profile</span>
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <div className="font-bold text-lg">{userPosts.length}</div>
                  <div className="text-gray-500 text-sm">posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{Math.floor(Math.random() * 1000)}</div>
                  <div className="text-gray-500 text-sm">followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{Math.floor(Math.random() * 500)}</div>
                  <div className="text-gray-500 text-sm">following</div>
                </div>
              </div>

              {/* Bio */}
              <div className="text-gray-700 text-center md:text-left">
                <div className="font-semibold mb-1">My Solana Journey</div>
                <div className="text-sm mb-1">Building on the blockchain, sharing my experiences</div>
                <div className="text-sm text-blue-600">solana.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Post */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share a new moment</h3>
            <PostForm placeholder="What's happening in your Solana journey?" />
          </div>
        </div>

        {/* Profile Content Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex justify-center space-x-12 px-6">
              <button className="flex items-center space-x-2 text-gray-900 border-b-2 border-gray-900 py-4 text-sm font-medium">
                <Grid className="w-4 h-4" />
                <span>POSTS</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 py-4 text-sm font-medium hover:text-gray-700">
                <Bookmark className="w-4 h-4" />
                <span>SAVED</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 py-4 text-sm font-medium hover:text-gray-700">
                <Tag className="w-4 h-4" />
                <span>TAGGED</span>
              </button>
            </div>
          </div>

          {/* Posts Content */}
          <div className="p-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">📸</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share your first post</h3>
                <p className="text-gray-500 mb-6">Start sharing your moments with the world!</p>
                <div className="text-sm text-gray-400">Your posts will appear here once you start sharing.</div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center text-gray-600 text-sm">
                  {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
                </div>
                <div className="max-w-lg mx-auto space-y-6">
                  {userPosts.map((post) => <PostCard key={post.publicKey.toBase58()} post={post} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userPosts.length}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {userPosts.reduce((acc, post) => acc + (post.account.topic ? 1 : 0), 0)}
              </div>
              <div className="text-sm text-gray-600">With Hashtags</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.floor(Math.random() * 500)}</div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{Math.floor(Math.random() * 100)}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageProfile