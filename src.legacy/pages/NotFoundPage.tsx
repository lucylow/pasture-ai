import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground">The page you requested does not exist.</p>
      <Link
        to="/"
        className="inline-block px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  )
}
