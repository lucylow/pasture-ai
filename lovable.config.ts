// lovable.config.ts - Lovable Cloud deployment config for Next.js
export default {
  name: "PastureAI Demo",
  build: {
    cmd: "npm run build",
    cwd: "."
  },
  run: {
    cmd: "npm run start",
    port: 3000
  },
  env: {
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1"
  },
  node: {
    version: "20"
  },
  static: { largeBlobs: true }
};
