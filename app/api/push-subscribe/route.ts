import { NextRequest, NextResponse } from "next/server";

// In production, store subscriptions in a database (Supabase/Postgres)
// For now, acknowledge and store in memory (Vercel serverless = ephemeral, use DB in prod)
const subscriptions = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, dob, timezone } = body;

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    // Store subscription (replace with DB in production)
    const key = Buffer.from(subscription.endpoint).toString("base64").slice(0, 32);
    subscriptions.set(key, { subscription, dob, timezone, createdAt: new Date().toISOString() });

    console.log(`New push subscription registered: ${key}`);

    return NextResponse.json({ 
      success: true, 
      message: "Daily Oracle reminders activated! You'll receive your cosmic briefing each morning.",
      key 
    });
  } catch (err) {
    console.error("Push subscription error:", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint } = body;
    const key = Buffer.from(endpoint).toString("base64").slice(0, 32);
    subscriptions.delete(key);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 });
  }
}
