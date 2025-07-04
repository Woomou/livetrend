#!/bin/bash

echo "🚀 livetrend-aggregator 部署脚本"
echo "=================================="

# 检查是否设置了 API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 请先设置 CLOUDFLARE_API_TOKEN 环境变量"
    echo "   在 Cloudflare Dashboard 中创建 API Token，然后运行："
    echo "   export CLOUDFLARE_API_TOKEN='your_token_here'"
    exit 1
fi

# 检查是否设置了 KV namespace ID
if [ -z "$KV_NAMESPACE_ID" ]; then
    echo "❌ 请先设置 KV_NAMESPACE_ID 环境变量"
    echo "   在 Cloudflare Dashboard 中创建 KV namespace，然后运行："
    echo "   export KV_NAMESPACE_ID='your_namespace_id_here'"
    exit 1
fi

echo "✅ 环境变量已设置"

# 更新 wrangler.toml 配置
echo "📝 更新 wrangler.toml 配置..."
sed -i '' "s/id = \"\"/id = \"$KV_NAMESPACE_ID\"/" wrangler.toml
sed -i '' "s/preview_id = \"\"/preview_id = \"$KV_NAMESPACE_ID\"/" wrangler.toml

# 取消注释 KV namespace 配置
sed -i '' 's/# kv_namespaces = \[/kv_namespaces = [/' wrangler.toml
sed -i '' 's/#   { binding = "NEWS_CACHE", id = "", preview_id = "" }/  { binding = "NEWS_CACHE", id = "'$KV_NAMESPACE_ID'", preview_id = "'$KV_NAMESPACE_ID'" }/' wrangler.toml
sed -i '' 's/# \]/]/' wrangler.toml

echo "✅ 配置文件已更新"

# 部署到 Cloudflare
echo "🚀 开始部署..."
npx wrangler deploy

echo "✅ 部署完成！"
echo "🌐 你的 Worker 现在应该可以在以下地址访问："
echo "   https://livetrend-aggregator.your-subdomain.workers.dev" 