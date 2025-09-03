import { Link } from 'react-router'

export function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go to Home
            </Link>
            <Link
              to="/topics"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Topics
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Or try searching for what you need in the navigation above.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
