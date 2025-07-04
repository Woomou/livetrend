export default {
  async fetch(request, env, ctx) {
    if (!env.NEWS_CACHE) {
      return new Response(JSON.stringify({ error: 'NEWS_CACHE not configured' }), {
        headers: { 'content-type': 'application/json;charset=UTF-8' }
      });
    }
    
    const data = await env.NEWS_CACHE.get('news-feed');
    return new Response(data || '[]', {
      headers: { 'content-type': 'application/json;charset=UTF-8' }
    });
  },
  async scheduled(event, env, ctx) {
    if (!env.NEWS_CACHE) {
      console.log('NEWS_CACHE not configured, skipping scheduled update');
      return;
    }
    
    const hn = await fetchHackerNews();
    const reddit = await fetchReddit(env);
    const feed = [...hn, ...reddit];
    await env.NEWS_CACHE.put('news-feed', JSON.stringify(feed));
  }
};

async function fetchHackerNews() {
  try {
    const idsResp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await idsResp.json();
    const top = ids.slice(0, 10);
    const items = await Promise.all(top.map(async id => {
      const resp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const item = await resp.json();
      return {
        title: item.title,
        description: item.text || '',
        link: item.url || `https://news.ycombinator.com/item?id=${id}`,
        source: 'hackernews'
      };
    }));
    return items;
  } catch (err) {
    console.error('HN fetch error', err);
    return [];
  }
}

async function fetchReddit(env) {
  const clientId = env.REDDIT_CLIENT_ID;
  const clientSecret = env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return [];
  }
  try {
    const tokenResp = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return [];
    const resp = await fetch('https://oauth.reddit.com/r/all/new.json?limit=10', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'User-Agent': 'livetrend-worker' }
    });
    const json = await resp.json();
    const items = json.data.children.map(child => ({
      title: child.data.title,
      description: child.data.selftext || '',
      link: 'https://reddit.com' + child.data.permalink,
      source: 'reddit'
    }));
    return items;
  } catch (err) {
    console.error('Reddit fetch error', err);
    return [];
  }
}
