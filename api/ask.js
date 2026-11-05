// Save this file as api/ask.js: make a folder named api in the root folder of
// your repo, and put this file in it. Vercel runs every file in api/ on its
// server, so your page can call this one at /api/ask.

export default {
  async fetch(request) {
    // The prompt your page sent in the request body.
    const { prompt } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/responses", {
      method: "POST",
      headers: {
        // The key comes from Vercel's settings (Settings > Environment Variables),
        // never from a file in your repo.
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // The course key works with this model only.
        model: 'deepseek/deepseek-v4.1-flash-1017',
        // The longest answer you pay for, in tokens (about three quarters of a
        // word each). A longer answer is cut off at this point.
        max_output_tokens: 1000,
        reasoning: { effort: "none" },
        instructions: 'You are a strict but kind wizard professor at a school of magic, '
          + 'speaking in the style of the Harry Potter books, with spells, potions, owls and house points. '
          + 'Your job is to test whether the student has finished their work and tasks. '
          + 'Award house points for finished tasks and take points away for excuses. '
          + 'Always end with one direct question about what they still have to finish. '
          + 'Keep every answer under 80 words.',
        input: prompt
      })
    });

    // Send the model's reply back to your page as it arrived.
    const data = await response.json();
    return Response.json(data, { status: response.status });
  },
};
