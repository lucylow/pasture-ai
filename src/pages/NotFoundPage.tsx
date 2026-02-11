import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">The page you requested does not exist in this mock app.</p>
      <Link to="/" className="text-[hsl(142,40%,33%)] underline">Back to home</Link>
    </div>
  )
}
