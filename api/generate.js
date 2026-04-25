// api/generate.js
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  // 从 Vercel 环境变量中读取 Key，更安全
  const apiKey = process.env.ARK_API_KEY; 
  // 替换为你火山引擎后台的“推理终端 ID” (以 ep- 开头)
  const modelId = "你后台的推理终端ID"; 

  try {
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        prompt: prompt + ", circular design, umbrella surface pattern, traditional chinese style, high quality",
        size: "512x512",
        n: 1
      })
    });

    const data = await response.json();

    if (data.data && data.data[0]) {
      // 返回生成的图片 URL
      res.status(200).json({ success: true, url: data.data[0].url });
    } else {
      console.error("API Error Detail:", data);
      res.status(500).json({ success: false, error: data.error?.message || "生成失败" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "服务器内部错误" });
  }
}
