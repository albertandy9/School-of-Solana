import { useState } from 'react'
import { useInstagramProgram } from './instagram-data-access'
import { Button } from '@/components/ui/button'
import { useWallet } from '@solana/wallet-adapter-react'
import { ImagePlus, Smile } from 'lucide-react'

interface PostFormProps {
  placeholder?: string
  forcedTopic?: string
  onSubmit?: () => void
}

export function PostForm({ placeholder = "Share a moment...", forcedTopic, onSubmit }: PostFormProps) {
  const { createPost } = useInstagramProgram()
  const { publicKey, connected } = useWallet()
  const [topic, setTopic] = useState(forcedTopic || '')
  const [content, setContent] = useState('')
  
  const characterLimit = 2200 // Instagram allows longer captions
  const topicLimit = 50
  const characterCount = content.length
  const topicCount = topic.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (content.length > characterLimit) return
    if (topic.length > topicLimit) return

    try {
      await createPost.mutateAsync({ topic: topic.trim(), content: content.trim() })
      setContent('')
      if (!forcedTopic) {
        setTopic('')
      }
      onSubmit?.()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const isValid = content.trim() && content.length <= characterLimit && topic.length <= topicLimit

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {connected && publicKey ? publicKey.toBase58().slice(0, 2).toUpperCase() : '?'}
          </div>
          
          {/* Form content */}
          <div className="flex-1 space-y-3">
            {/* Topic input */}
            {!forcedTopic && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-lg">#</span>
                <input
                  type="text"
                  placeholder="Add a hashtag..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={createPost.isPending}
                  maxLength={topicLimit}
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <span className="text-xs text-gray-400">
                  {topicCount}/{topicLimit}
                </span>
              </div>
            )}

            {/* Content textarea */}
            <textarea
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={createPost.isPending}
              maxLength={characterLimit}
              className="w-full text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent min-h-[80px] text-sm leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />

            {/* Media buttons and actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  disabled={createPost.isPending}
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
                  disabled={createPost.isPending}
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-sm">Emoji</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400">
                  {characterLimit - characterCount} left
                </span>
                <Button
                  type="submit"
                  disabled={!isValid || createPost.isPending}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50 text-sm"
                >
                  {createPost.isPending ? 'Sharing...' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}