# livetrend

This project is a Cloudflare Worker that aggregates news from Hacker News and Reddit into a single JSON feed stored in KV. The Worker exposes the aggregated list at its main endpoint and updates the data on a schedule using Cron triggers.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure a KV namespace called `NEWS_CACHE` in your Cloudflare account and update `wrangler.toml` with the namespace IDs.

3. Optionally set the following secrets for Reddit integration:
   ```bash
   wrangler secret put REDDIT_CLIENT_ID
   wrangler secret put REDDIT_CLIENT_SECRET
   ```
   If not provided, Reddit stories will be skipped.

4. Start a local dev server:
   ```bash
   npm run start
   ```

5. Deploy:
   ```bash
   npm run deploy
   ```

The scheduled handler runs every 30 minutes, fetching the latest articles and caching them under the key `news-feed`.
