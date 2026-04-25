// api/generate.js
module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.ARK_API_KEY;
    const modelId = "ep-m-20260425235927-t6nws";

    try {
        // 第一步：调用火山引擎生成图片
        const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelId,
                prompt: prompt + ", circular design, umbrella surface pattern, traditional chinese style, high quality",
                size: "1024x1024",
                n: 1
            })
        });

        const data = await response.json();

        if (!data.data || !data.data[0]) {
            return res.status(500).json({ success: false, error: data.error?.message || "生成失败" });
        }

        const imageUrl = data.data[0].url;

        // 第二步：服务端下载图片，转成 base64
        const imgResponse = await fetch(imageUrl);
        const arrayBuffer = await imgResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = imgResponse.headers.get('content-type') || 'image/png';

        res.status(200).json({
            success: true,
            url: `data:${contentType};base64,${base64}`  // 返回 base64
        });

    } catch (error) {
        res.status(500).json({ success: false, error: "服务器内部错误: " + error.message });
    }
}
