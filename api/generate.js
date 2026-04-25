export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = "ark-f3bdf324-755b-459b-a6a6-1a576545bd92-920ac"; // 建议后续放入环境变量

  try {
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "doubao-art-v2", // 请确认为 Seedream/豆包对应的模型ID
        prompt: prompt + ", circular design, umbrella surface pattern, traditional chinese style",
        size: "512x512"
      })
    });

    const data = await response.json();
    
    if (data.data && data.data[0]) {
      res.status(200).json({ success: true, url: data.data[0].url });
    } else {
      res.status(500).json({ success: false, error: "生成失败" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
