// api/generate.js
module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.ARK_API_KEY;
    const modelId = "ep-m-20260425235927-t6nws";

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
                size: "1024x1024",
                n: 1
            })
        });

        const data = await response.json();

        if (data.data && data.data[0]) {
            res.status(200).json({ success: true, url: data.data[0].url });
        } else {
            res.status(500).json({ success: false, error: data.error?.message || "生成失败" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "服务器内部错误" });
    }
}
