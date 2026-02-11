import { mockCommunityPosts } from '../mock/data'

export function CommunityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community (mock)</h2>
      <p className="text-gray-500 text-sm">Farmer stories and insights. All content here is mocked for demo.</p>
      <div className="space-y-4">
        {mockCommunityPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border p-5 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-xs text-gray-500">{post.author} • {post.farmName}</p>
              </div>
              <span className="text-xs text-gray-400">❤️ {post.likes} · 💬 {post.comments}</span>
            </div>
            <p className="text-sm text-gray-700">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
