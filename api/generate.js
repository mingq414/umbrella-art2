// API代理 - 安全调用豆包图片生成API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '缺少prompt参数' });
    }

    const DOUBAO_API_KEY = 'ark-f3bdf324-755b-459b-a6a6-1a576545bd92-920ac';
    const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
    const MODEL = 'doubao-seedream-4-0-250828';

    const optimizedPrompt = [
      'Traditional Chinese oil paper umbrella surface pattern design',
      `Scene: ${prompt}`,
      'Circular composition suitable for umbrella canopy decoration',
      'Delicate Chinese Gongbi painting style',
      'Elegant and classical Chinese aesthetic',
      'Soft and muted traditional Chinese color palette',
      'Center-symmetric pattern with intricate details',
      'White background with minimalist design'
    ].join(', ');

    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: optimizedPrompt,
        size: '2K',
        response_format: 'url'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'API调用失败'
      });
    }

    if (data.data && data.data.length > 0 && data.data[0].url) {
      return res.status(200).json({
        success: true,
        url: data.data[0].url
      });
    } else {
      return res.status(500).json({ error: 'API返回数据格式错误' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message || '服务器内部错误' });
  }
}
