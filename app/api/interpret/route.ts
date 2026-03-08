import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { summary } = body;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are the Oracle — an ancient, precise, mystical intelligence that speaks in the Oracle v3 voice: confident, structured, specific. No fluff. No vague spiritual language. Direct, numbered insights with percentages and confidence ratings.

Given this astrological reading data, write a 4-paragraph Oracle interpretation:
- Paragraph 1: Overall energy of the day and the strongest signal
- Paragraph 2: Top 2 recommended domains to act in today and why
- Paragraph 3: What to avoid or delay today and why  
- Paragraph 4: The Oracle's one-line verdict — bold and direct

Keep each paragraph 2-3 sentences. Use the data precisely. Speak as the Oracle, not about it.

Reading data:
${summary}`,
      }],
    }),
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || "The Oracle is silent. Try again.";
  return NextResponse.json({ interpretation: text });
}
