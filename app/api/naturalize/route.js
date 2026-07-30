// Turns a telegraphic tapped sequence like ["I", "want", "water"] into a
// natural, grammatically complete spoken sentence — e.g. "I'd like some
// water, please." This is the one place a real LLM does real work in this
// app: AAC users tap words quickly (fewer taps = less physical effort),
// but speaking word-for-word sounds robotic. This bridges that gap without
// changing what the user actually said.
//
// Fails safe: if there's no API key, the request times out, or anything
// goes wrong, we return the raw tapped words so the app never breaks.

export const runtime = 'nodejs';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const TIMEOUT_MS = 6000;

export async function POST(request) {
  let words = [];
  try {
    const body = await request.json();
    words = Array.isArray(body?.words) ? body.words : [];
  } catch {
    // ignore, words stays []
  }

  const fallbackSentence = words.join(' ');
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || words.length === 0) {
    return Response.json({ sentence: fallbackSentence, naturalized: false });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 60,
        messages: [
          {
            role: 'system',
            content:
              'You help an AAC (assistive communication) user speak naturally. ' +
              'You will receive a short sequence of tapped words representing ' +
              'what they want to say telegraphically. Rewrite it as ONE short, ' +
              'natural, grammatically correct spoken sentence that preserves ' +
              'their exact intended meaning. Do not add new information or ' +
              'change the meaning. Reply with ONLY the sentence — no quotes, ' +
              'no explanation.',
          },
          {
            role: 'user',
            content: `Words: ${words.join(', ')}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json({ sentence: fallbackSentence, naturalized: false });
    }

    const data = await res.json();
    const sentence = data?.choices?.[0]?.message?.content?.trim();

    if (!sentence) {
      return Response.json({ sentence: fallbackSentence, naturalized: false });
    }

    return Response.json({ sentence, naturalized: true });
  } catch {
    clearTimeout(timeout);
    return Response.json({ sentence: fallbackSentence, naturalized: false });
  }
}
