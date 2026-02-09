export default {
  cloud: {
    database: true,
    auth: true,
    storage: true,
    functions: true,
    secrets: ['MAPBOX_TOKEN', 'LOVABLE_AI_KEY']
  },
  frontend: {
    framework: 'react',
    bundler: 'vite',
    styling: 'tailwind',
    pwa: true
  },
  ai: {
    models: ['gemini-2.0-flash', 'openai-gpt4o-mini']
  }
}
