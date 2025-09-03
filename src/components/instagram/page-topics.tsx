import { useParams, Link } from 'react-router'
import { useInstagramProgram } from './instagram-data-access'
import { PostCard } from './instagram-card'
import { ArrowLeft } from 'lucide-react'

export function PagePostDetail() {
  const { post: postParam } = useParams<{ post: string }>()
  const { accounts } = useInstagramProgram()

  if (!postParam) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-500 mb-6">No post ID was provided in the URL.</p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (accounts.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading post...</div>
        </div>
      </div>
    )
  }

  if (accounts.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Post</h2>
            <p className="text-red-500 mb-6">Error: {accounts.error.message}</p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const post = accounts.data?.find((account) => account.publicKey.toBase58() === postParam)

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-500 mb-6">The post you're looking for doesn't exist or has been deleted.</p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const postAccount = {
    publicKey: post.publicKey,
    account: post.account,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-6">
        {/* Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </Link>
        </div>

        {/* Post Detail */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Post Details</h2>
          <PostCard post={postAccount} />
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
          <div className="space-y-4">
            {/* Mock comments */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  U{i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">user{i + 1}</span>
                    <span className="text-gray-500 text-xs">2h</span>
                  </div>
                  <p className="text-sm text-gray-700">Great post! Thanks for sharing.</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add comment */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ?
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Post ID:</span>
              <span className="text-gray-600 font-mono text-xs break-all max-w-xs text-right">
                {post.publicKey.toBase58()}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Author:</span>
              <span className="text-gray-600 font-mono text-xs break-all max-w-xs text-right">
                {post.account.author.toBase58()}
              </span>
            </div>
            {post.account.topic && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hashtag:</span>
                <span className="text-blue-600">#{post.account.topic}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Created:</span>
              <span className="text-gray-600">
                {typeof post.account.timestamp === 'object' && post.account.timestamp.toNumber
                  ? new Date(post.account.timestamp.toNumber() * 1000).toLocaleString()
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">More from this user</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👤</div>
            <p className="text-sm">More posts from this user would appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagePostDetail