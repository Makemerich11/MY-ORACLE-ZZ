import { NextRequest, NextResponse } from "next/server";

// Compute a deterministic but "alive" daily energy score based on date
function getDailyPlanetarySnapshot(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const year = date.getFullYear();
  const seed = dayOfYear + year * 365;

  const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const moonPhases = ["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Balsamic Moon"];

  const sunSign = signs[Math.floor((dayOfYear / 365) * 12) % 12];
  const moonPhase = moonPhases[Math.floor((seed * 7919) % moonPhases.length)];
  const moonSign = signs[(seed * 1009) % 12];
  const mercuryRetro = (seed % 13 === 0);
  const venusRetro = (seed % 19 === 0);
  const marsRetro = (seed % 26 === 0);

  const overallEnergy = 40 + ((seed * 2654435761) % 2**32) % 55;

  return { sunSign, moonPhase, moonSign, mercuryRetro, venusRetro, marsRetro, overallEnergy };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dob = searchParams.get("dob") || "";
  const date = new Date();

  const snapshot = getDailyPlanetarySnapshot(date);
  const dateStr = date.toLocaleDateString("en-AU", { weekday:"long", month:"long", day:"numeric" });

  const retroWarnings = [
    snapshot.mercuryRetro && "Mercury ℞",
    snapshot.venusRetro && "Venus ℞",
    snapshot.marsRetro && "Mars ℞",
  ].filter(Boolean).join(", ");

  const systemPrompt = `You are MyOracle — a sharp, confident cosmic intelligence. Generate a daily focus reading.
Keep it punchy, direct, actionable. No waffle. Use "✦" as a bullet marker. Max 120 words total.
Format exactly:
LINE 1: One bold verdict line (e.g. "⚡ 78% — Strong day for decisive moves")
LINE 2: blank
LINE 3: ✦ FOCUS: one thing to lean into today (10-15 words)
LINE 4: ✦ AVOID: one thing to sidestep today (10-15 words)  
LINE 5: ✦ WINDOW: best time of day to act (10-15 words)
LINE 6: blank
LINE 7: One closing cosmic insight (15-20 words max)`;

  const userPrompt = `Date: ${dateStr}
Sun in ${snapshot.sunSign}, Moon ${snapshot.moonPhase} in ${snapshot.moonSign}
${retroWarnings ? `Active retrogrades: ${retroWarnings}` : "No major retrogrades"}
Overall energy index: ${snapshot.overallEnergy}%
${dob ? `User DOB: ${dob}` : "No personal DOB provided — give world energy focus"}
Generate today's daily Oracle focus.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "✦ The cosmos is quiet today. Trust your instincts.";

    // Cache for 1 hour
    return NextResponse.json({ focus: text, date: dateStr, snapshot }, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" }
    });
  } catch {
    return NextResponse.json({
      focus: `⚡ ${snapshot.overallEnergy}% — ${snapshot.moonPhase} energy active\n\n✦ FOCUS: Stay grounded, the ${snapshot.moonSign} Moon amplifies emotion\n✦ AVOID: Impulsive decisions before noon\n✦ WINDOW: Early afternoon favours clear thinking\n\nThe stars don't wait — neither should you.`,
      date: dateStr,
      snapshot
    });
  }
}
