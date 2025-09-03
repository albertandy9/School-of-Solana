import React from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from './ui/button'
import { Home, Search, PlusSquare, Heart, User, MessageCircle } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

interface InstagramLayoutProps {
  children: React.ReactNode
}

export function InstagramLayout({ children }: InstagramLayoutProps) {
  const location = useLocation()
  const { publicKey, connected, disconnect } = useWallet()

  const navigationItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Create', path: '/create', icon: PlusSquare },
    { label: 'Messages', path: '/messages', icon: MessageCircle },
    { label: 'Notifications', path: '/notifications', icon: Heart },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleWalletClick = async () => {
    if (connected) {
      try {
        await disconnect()
      } catch (error) {
        console.error('Failed to disconnect wallet:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto flex">
        {/* Left Sidebar */}
        <div className="w-64 h-screen sticky top-0 p-4 border-r border-gray-200">
          {/* Logo */}
          <div className="mb-8 px-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg">
                <span className="text-white font-bold text-sm">📷</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Instashot
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-4 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-gray-100 font-semibold' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${
                    isActive(item.path) ? 'text-black' : 'text-gray-700'
                  }`} />
                  <span className={`text-base ${
                    isActive(item.path) ? 'text-black font-semibold' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Create Post Button */}
          <Link to="/create">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-base mb-6">
              Create Post
            </Button>
          </Link>

          {/* More Menu */}
          <div className="mb-8">
            <button className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-50 w-full text-left transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-700">☰</span>
              </div>
              <span className="text-base text-gray-700">More</span>
            </button>
          </div>

          {/* Wallet Connection Area */}
          <div className="absolute bottom-4 left-4 right-4">
            {connected && publicKey ? (
              <div
                onClick={handleWalletClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200"
                title="Click to disconnect wallet"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {publicKey.toBase58().slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-black">
                    {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-4)}
                  </div>
                  <div className="text-xs text-gray-500">Click to disconnect</div>
                </div>
              </div>
            ) : (
              <WalletMultiButton className="!w-full !bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white hover:!from-purple-600 hover:!to-pink-600 !rounded-lg !font-semibold !border-0 !p-3 !h-auto !flex !items-center !justify-center !shadow-md !transition-all" />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen bg-gray-50">
          {children}
        </div>

        {/* Right Sidebar - Suggestions (Optional) */}
        <div className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Suggested for you</h3>
            <div className="space-y-3">
              {/* Placeholder for suggestions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="text-sm font-semibold">username</div>
                    <div className="text-xs text-gray-500">Suggested for you</div>
                  </div>
                </div>
                <button className="text-xs text-blue-500 font-semibold hover:text-blue-700">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
