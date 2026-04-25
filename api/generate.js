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
      return res.status(400).json({ error: '请输入提示词' });
    }

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ark-f3bdf324-755b-459b-a6a6-1a576545bd92-920ac'
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-0-250828',
        prompt: `Traditional Chinese oil paper umbrella, ${prompt}, circular composition, elegant Chinese style, watercolor`,
        size: '2K',
        response_format: 'url'
      })
    });

    const data = await response.json();

    if (!res
