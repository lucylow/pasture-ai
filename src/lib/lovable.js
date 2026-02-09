// Mock Lovable client for demo - no external dependencies
const mockUser = { id: 'demo', email: 'demo@farm.com', farm_name: 'Springfield Pastures' }

export const lovable = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      if (email === 'demo@farm.com') {
        return { user: mockUser, error: null }
      }
      return { user: null, error: { message: 'Invalid credentials' } }
    },
    signUp: async ({ email, password }) => ({ user: mockUser, error: null }),
    signOut: async () => ({ error: null }),
    getUser: () => mockUser
  },
  storage: {
    list: async (bucket) => ({ data: [], error: null }),
    from: (bucket) => ({
      upload: async (path, file) => ({ data: { path }, error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: `/uploads/${path}` } })
    })
  },
  db: {
    from: (table) => ({
      select: (cols) => ({
        eq: (col, val) => ({
          order: (col, opts) => ({
            limit: (n) => Promise.resolve({ 
              data: [{
                id: '1',
                user_id: 'demo',
                predictions: { drygreeng: 152.1, drytotalg: 187.3 },
                pasture_health: 'good',
                recommendations: { action: 'graze', days: 4 },
                confidence: 0.85,
                created_at: new Date().toISOString()
              }],
              error: null 
            })
          })
        })
      }),
      insert: (data) => Promise.resolve({ data, error: null })
    })
  }
}

// Simple reactive store
let currentUser = null
const listeners = new Set()

export const user = {
  subscribe: (fn) => {
    listeners.add(fn)
    fn(currentUser)
    return () => listeners.delete(fn)
  },
  set: (val) => {
    currentUser = val
    listeners.forEach(fn => fn(val))
  }
}

export const signIn = async (email, password) => {
  const { user: u, error } = await lovable.auth.signInWithPassword({ email, password })
  if (u) user.set(u)
  return { user: u, error }
}

export const signUp = async (email, password) => {
  const { user: u, error } = await lovable.auth.signUp({ email, password })
  return { user: u, error }
}
