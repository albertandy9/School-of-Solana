import { useParams, Link, useSearchParams } from 'react-router'
import { useFilteredPosts } from './instagram-data-access'
import { PostForm } from './instagram-form'
import { PostCard } from './instagram-card'
import { Search } from 'lucide-react'
import { useState } from 'react'

export function PageSearch() {
  const { topic } = useParams<{ topic: string }>()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')
  const { posts, filterByTopic, getAllTopics, isLoading, error } = useFilteredPosts()
  const [searchTerm, setSearchTerm] = useState(searchQuery || '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-red-500 text-center">Error loading content: {error.message}</div>
      </div>
    )
  }

  const topics = getAllTopics
  const activeQuery = topic || searchQuery
  const filteredPosts = activeQuery ? filterByTopic(activeQuery) : posts
  
  const sortedPosts = filteredPosts.sort((a, b) => {
    const aTime =
      typeof a.account.timestamp === 'object' && a.account.timestamp.toNumber ? a.account.timestamp.toNumber() : 0
    const bTime =
      typeof b.account.timestamp === 'object' && b.account.timestamp.toNumber ? b.account.timestamp.toNumber() : 0
    return bTime - aTime
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-6">
        {/* Search Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hashtags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Popular Hashtags */}
        {!activeQuery && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Hashtags</h2>
            {topics.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <div className="text-4xl mb-2">🏷️</div>
                <p>No hashtags found.</p>
                <p className="text-sm">Start posting with hashtags to see them here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {topics.map((topicName) => {
                  const topicPosts = filterByTopic(topicName)
                  return (
                    <Link
                      key={topicName}
                      to={`/search?q=${topicName}`}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          #
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                            #{topicName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {topicPosts.length} {topicPosts.length === 1 ? 'post' : 'posts'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {activeQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Link to="/search" className="text-blue-600 hover:underline text-sm">
                  ← Back to Search
                </Link>
              </div>
              <h2 className="text-lg font-bold text-gray-900">#{activeQuery}</h2>
            </div>
            
            {/* Create post for this topic */}
            <div className="mb-6">
              <PostForm forcedTopic={activeQuery} placeholder={`Share something about #${activeQuery}...`} />
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {activeQuery && (
            <div className="text-center text-gray-600 text-sm">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} for #{activeQuery}
            </div>
          )}
          
          {sortedPosts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeQuery ? `No posts for #${activeQuery}` : 'No posts found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeQuery 
                  ? `Be the first to post about #${activeQuery}!`
                  : 'Try searching for a specific hashtag or topic.'
                }
              </p>
            </div>
          ) : (
            <div className="max-w-lg mx-auto space-y-6">
              {sortedPosts.map((post) => <PostCard key={post.publicKey.toBase58()} post={post} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageSearch