# livetrend

This project is a Cloudflare Worker that aggregates news from Hacker News and Reddit into a single JSON feed stored in KV. The Worker exposes the aggregated list at its main endpoint and updates the data on a schedule using Cron triggers.

## 🚀 Quick Start (Fork & Deploy)

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/livetrend.git
cd livetrend
npm install
```

### 2. Cloudflare Setup
```bash
# Login to Cloudflare
npx wrangler login

# Create KV namespace
npx wrangler kv:namespace create NEWS_CACHE

# Copy the generated namespace ID to wrangler.toml
```

### 3. Configure wrangler.toml
Update `wrangler.toml` with your KV namespace ID:
```toml
kv_namespaces = [
  { binding = "NEWS_CACHE", id = "YOUR_NAMESPACE_ID", preview_id = "YOUR_NAMESPACE_ID" }
]
```

### 4. Deploy
```bash
npx wrangler deploy
```

Your Worker will be available at: `https://YOUR_WORKER_NAME.YOUR_SUBDOMAIN.workers.dev`

### 5. Optional: Reddit Integration
For Reddit news, set up API credentials:
```bash
# Get Reddit API credentials from https://www.reddit.com/prefs/apps
npx wrangler secret put REDDIT_CLIENT_ID
npx wrangler secret put REDDIT_CLIENT_SECRET
```

## 📋 API Response Format

Each news item includes:
- `title`: Article title
- `description`: Article description/excerpt
- `link`: Article URL
- `source`: Either "hackernews" or "reddit"

## 🔧 Local Development

```bash
# Start local dev server
npm run start

# Test local API
curl http://localhost:8787
```

## 📅 Scheduled Updates

The Worker automatically fetches fresh news every 30 minutes using Cloudflare Cron triggers. No manual intervention needed!
