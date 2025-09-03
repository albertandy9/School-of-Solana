import { useFilteredPosts } from './instagram-data-access'
import { PostForm } from './instagram-form'
import { PostCard } from './instagram-card'

export function PageHome() {
  const { posts, isLoading, error } = useFilteredPosts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-500">Loading feed...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500">Error loading feed: {error.message}</div>
      </div>
    )
  }

  const sortedPosts = posts.sort((a, b) => {
    const aTime =
      typeof a.account.timestamp === 'object' && a.account.timestamp.toNumber ? a.account.timestamp.toNumber() : 0
    const bTime =
      typeof b.account.timestamp === 'object' && b.account.timestamp.toNumber ? b.account.timestamp.toNumber() : 0
    return bTime - aTime
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto pt-6">
        {/* Stories Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex space-x-4 overflow-x-auto">
            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold relative">
                <span className="text-lg">+</span>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-600">Your story</span>
            </div>
            {/* Mock stories */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">👤</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600">user{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Form */}
        <div className="mb-6">
          <PostForm />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <div className="text-gray-400 text-6xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Start sharing your moments with the world!</p>
              <div className="text-sm text-gray-400">Be the first to create a post</div>
            </div>
          ) : (
            sortedPosts.map((post) => <PostCard key={post.publicKey.toBase58()} post={post} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHome
