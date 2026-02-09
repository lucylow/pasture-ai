# 🚀 CredTrust Quick Start Guide

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:8080
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Lovable (Recommended)
1. Open your project in [Lovable](https://lovable.dev)
2. Click **Share → Publish**
3. Your app is live at `https://your-app.lovable.app`

### Option 2: Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables as needed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | Optional (has fallback) |
| `VITE_BACKEND_URL` | Backend API URL | Optional |

## ✅ Verification Checklist

- [ ] App loads at localhost:8080
- [ ] Landing page renders correctly
- [ ] Dashboard accessible at /app
- [ ] Wallet connect button works
- [ ] Theme toggle works (dark/light)

---

*Built with [Lovable](https://lovable.dev)*
