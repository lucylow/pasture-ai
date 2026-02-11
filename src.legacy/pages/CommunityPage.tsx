import { mockCommunityPosts } from '../mock/data'

export function CommunityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community</h2>
      <p className="text-sm text-muted-foreground">
        Farmer stories and insights. All content is mocked for demo.
      </p>

      <div className="space-y-4">
        {mockCommunityPosts.map(post => (
          <article
            key={post.id}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {post.author} · {post.farmName}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                ❤️ {post.likes} · 💬 {post.comments}
              </span>
            </div>
            <p className="text-sm text-foreground/80">{post.content}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
