// 本地测试脚本
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLocalAPI() {
  try {
    console.log('🧪 测试本地 API...');
    
    const response = await fetch('http://localhost:8787');
    const data = await response.json();
    
    console.log('✅ API 响应:', data);
    console.log('📊 状态码:', response.status);
    console.log('🔗 URL:', response.url);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('💡 请确保本地服务器正在运行: npm run start');
  }
}

// 测试 Hacker News API
async function testHackerNews() {
  try {
    console.log('\n🧪 测试 Hacker News API...');
    
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await response.json();
    
    console.log('✅ Hacker News 响应:', ids.slice(0, 5));
    console.log('📊 获取到', ids.length, '个故事 ID');
    
  } catch (error) {
    console.error('❌ Hacker News 测试失败:', error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('🚀 开始测试 livetrend-aggregator...\n');
  
  await testLocalAPI();
  await testHackerNews();
  
  console.log('\n✨ 测试完成！');
}

runTests(); 