export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt;
    
    if (!prompt) return res.status(400).json({ error: '请输入提示词' });

    const resp = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ark-f3bdf324-755b-459b-a6a6-1a576545bd92-920ac'
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-0-250828',
        prompt: 'Chinese oil paper umbrella design, ' + prompt + ', traditional elegant style, circular pattern',
        size: '2K',
        response_format: 'url'
      })
    });

    const data = await resp.json();
    
    if (!resp.ok) return res.status(500).json({ error: data?.error?.message || 'API调用失败' });
    if (!data?.data?.[0]?.url) return res.status(500).json({ error: '生成失败，请重试' });
    
    return res.status(200).json({ success: true, url: data.data[0].url });
  } catch (e) {
    return res.status(500).json({ error: '服务器错误: ' + e.message });
  }
}
