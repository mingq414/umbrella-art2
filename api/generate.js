export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let prompt;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    prompt = body.prompt;
  } catch (e) {
    return res.status(400).json({ error: '请求格式错误' });
  }

  if (!prompt) {
    return res.status(400).json({ error: '请输入提示词' });
  }

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ark-f3bdf324-755b-459b-a6a6-1a576545bd92-920ac'
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-0-250828',
        prompt: 'Chinese traditional oil paper umbrella design, ' + prompt + ', elegant watercolor style, circular composition',
        size: '2K',
        response_format: 'url'
      })
    });

    const data = await response.json();

    // 检查API是否返回错误
    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || data.error || 'API调用失败';
      console.error('API Error:', errorMsg);
      return res.status(500).json({ error: errorMsg });
    }

    // 检查是否有图片URL
    if (data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].url) {
      return res.status(200).json({ success: true, url: data.data[0].url });
    }

    return res.status(500).json({ error: '未获取到图片' });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: '服务器错误: ' + (error.message || '未知错误') });
  }
}
