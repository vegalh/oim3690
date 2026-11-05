// Vercel serverless function. Runs on the server, so the key never reaches the browser.
// Set OPENROUTER_API_KEY in Vercel's Environment Variables (Settings > Environment Variables).
export default {
  async fetch(request) {
    const { prompt } = await request.json();
    const key = process.env.OPENROUTER_API_KEY;
    const response = await fetch("https://openrouter.ai/api/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4.1-flash-1017",
        max_output_tokens: 1000,
        input: prompt
      })
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  },
};
