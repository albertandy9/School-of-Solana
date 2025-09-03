import { useParams, Link } from 'react-router'
import { PublicKey } from '@solana/web3.js'
import { useFilteredPosts } from './instagram-data-access'
import { PostCard } from './instagram-card'

export function PageUsers() {
  const { author } = useParams<{ author: string }>()
  const { posts, filterByAuthor, getAllAuthors, isLoading, error } = useFilteredPosts()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading users...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-red-500 text-center">Error loading users: {error.message}</div>
      </div>
    )
  }

  const authors = getAllAuthors
  const filteredPosts = author ? filterByAuthor(new PublicKey(author)) : posts

  const sortedPosts = filteredPosts.sort((a, b) => {
    const aTime =
      typeof a.account.timestamp === 'object' && a.account.timestamp.toNumber ? a.account.timestamp.toNumber() : 0
    const bTime =
      typeof b.account.timestamp === 'object' && b.account.timestamp.toNumber ? b.account.timestamp.toNumber() : 0
    return bTime - aTime
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-6">
        {/* User Browser */}
        {!author && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Discover People</h2>
            {authors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Connect your wallet and start posting to see users here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.map((authorKey) => {
                  const userPosts = filterByAuthor(new PublicKey(authorKey))
                  return (
                    <div key={authorKey} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                      <Link to={`/users/${authorKey}`} className="block">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                          {authorKey.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {authorKey.slice(0, 8)}...{authorKey.slice(-4)}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
                        </div>
                        <div className="inline-flex px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                          View Profile
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected User Profile */}
        {author && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <Link to="/users" className="text-blue-600 hover:underline text-sm">
                  ← Back to Users
                </Link>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-6 md:space-y-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto md:mx-0">
                    {author.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6">
                    <h1 className="text-2xl font-light text-gray-900">
                      {author.slice(0, 8)}...{author.slice(-4)}
                    </h1>
                    <div className="flex space-x-2">
                      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                        Follow
                      </button>
                      <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Message
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center md:justify-start space-x-8 mb-6">
                    <div className="text-center">
                      <div className="font-bold text-lg">{sortedPosts.length}</div>
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
                  <div className="text-gray-700">
                    <div className="font-semibold mb-1">Solana Creator</div>
                    <div className="text-sm">Sharing moments on the blockchain 🚀</div>
                    <div className="text-sm text-blue-600 mt-1">solana.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-center space-x-12 mb-6">
                  <button className="flex items-center space-x-2 text-gray-900 border-t-2 border-gray-900 pt-4 text-sm font-medium">
                    <span>📱</span>
                    <span>POSTS</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 pt-4 text-sm font-medium">
                    <span>📺</span>
                    <span>REELS</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 pt-4 text-sm font-medium">
                    <span>🏷️</span>
                    <span>TAGGED</span>
                  </button>
                </div>

                {/* Posts */}
                {sortedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📸</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">This user hasn't shared any posts.</p>
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto space-y-6">
                    {sortedPosts.map((post) => <PostCard key={post.publicKey.toBase58()} post={post} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PageUsers
