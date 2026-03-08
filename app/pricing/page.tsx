"use client";
import Link from "next/link";

const TIERS = [
  {
    id: 1, name: "Basic", price: "$9.99", color: "#6b6580",
    tagline: "Your daily cosmic pulse",
    features: ["All 9 domains — scores & verdicts", "7-day forecast", "Should I...? quick guide", "Moon phase & retrograde alerts"],
    locked: ["Signal breakdown", "30-day calendar", "Chart view", "Solar arc"],
  },
  {
    id: 2, name: "Plus", price: "$29.99", color: "#9b7fe6",
    tagline: "Full signal intelligence",
    features: ["Everything in Basic", "Full signal breakdown", "30-day forecast + Best Days", "Natal chart + transits", "Solar arc progressions", "Eclipse + station detail"],
    locked: ["Birth time precision", "Deeper domain specialisations"],
  },
  {
    id: 3, name: "Pro", price: "$79.99", color: "#f6ad3c", featured: true,
    tagline: "Maximum precision",
    features: ["Everything in Plus", "Birth time → Ascendant + Houses", "Location / timezone precision", "Natal patterns (Grand Trine, Stellium)", "Finance — market cycle overlays", "Health — biorhythm + surgery windows", "Travel — departure timing", "Love — Venus cycle detail"],
    locked: ["Oracle chatbot", "Daily push readings"],
  },
  {
    id: 4, name: "Pro+", price: "$99.99", color: "#e879a0",
    tagline: "Your personal Oracle",
    features: ["Everything in Pro", "Oracle chatbot — voice + text", "Daily push morning readings", "Interactive Q&A on readings", "People in Your Orbit — synastry", "Weekly deep-dive reports"],
    locked: [],
  },
];

const FAQ = [
  { q: "How does the free trial work?", a: "You start with a free trial of the tier above what you select. When the trial ends you drop to your paid tier — the difference is noticeable, not devastating." },
  { q: "Can I cancel anytime?", a: "Yes. No lock-in, no questions asked. Your reading history is saved for 30 days after cancellation." },
  { q: "Is birth time required?", a: "No. Without birth time you still get accurate solar-based readings across all 9 domains. Birth time unlocks Ascendant, houses and planetary hours on Tier 3+." },
  { q: "How accurate are the planetary positions?", a: "We use real astronomical calculations accurate to within 1–2° of professional ephemeris data. For most timing decisions this is well within the meaningful range." },
  { q: "What's in the daily push notification?", a: "Each morning the Oracle sends your overall score, your top domain for the day, any retrogrades or moon events, and your best window for action. 3–5 lines. High signal, no noise." },
];

export default function PricingPage() {
  return (
    <div style={{ background: "#07060d", minHeight: "100vh", color: "#e8e4f0" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(155,127,230,0.08) 0%, transparent 60%)" }}/>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(7,6,13,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(31,27,58,0.6)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 9, color: "#6b6580", fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 2 }}>my</span>
          <span style={{ fontSize: 16, fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 3, color: "#e8e4f0" }}>ORACLE</span>
        </Link>
        <Link href="/oracle" style={{ background: "linear-gradient(135deg, #9b7fe6, #f6ad3c)", color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "10px 20px", borderRadius: 10, textDecoration: "none" }}>
          TRY FREE
        </Link>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#f6ad3c", fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 20 }}>PRICING</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, fontStyle: "italic", marginBottom: 20, lineHeight: 1.1 }}>
            Choose your depth of knowing
          </h1>
          <p style={{ fontSize: 15, color: "#6b6580", maxWidth: 500, margin: "0 auto", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.8 }}>
            Every tier runs the same Oracle engine at full power. The difference is how much of what it knows gets revealed to you.
          </p>
        </div>

        {/* Trial banner */}
        <div style={{ background: "linear-gradient(135deg, rgba(155,127,230,0.1), rgba(246,173,60,0.08))", border: "1px solid rgba(155,127,230,0.3)", borderRadius: 14, padding: "18px 28px", textAlign: "center", marginBottom: 48, fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontStyle: "italic", color: "#e8e4f0" }}>
          ✨ Every plan includes a free trial of the tier above — so you always experience what you're upgrading to
        </div>

        {/* Tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 100 }}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{
              background: tier.featured ? "linear-gradient(160deg, #0e0d18, #1a1408)" : "#0e0d18",
              border: `1px solid ${tier.featured ? tier.color : "#1f1b3a"}`,
              borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
              transition: "transform 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>

              {tier.featured && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}/>
              )}
              {tier.featured && (
                <div style={{ position: "absolute", top: 16, right: 16, background: tier.color, color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 6 }}>POPULAR</div>
              )}

              <div style={{ fontSize: 8, letterSpacing: 3, color: tier.color, fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 6 }}>TIER {tier.id}</div>
              <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{tier.name}</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 13, color: "#6b6580", fontStyle: "italic", marginBottom: 24 }}>{tier.tagline}</div>
              <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: 30, fontWeight: 700, color: tier.color, marginBottom: 28 }}>{tier.price}<span style={{ fontSize: 12, color: "#6b6580", fontWeight: 400 }}>/mo</span></div>

              <div style={{ marginBottom: 28 }}>
                {tier.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: "#e8e4f0", lineHeight: 1.5 }}>
                    <span style={{ color: "#3dbd7d", flexShrink: 0, marginTop: 1 }}>✓</span><span>{f}</span>
                  </div>
                ))}
                {tier.locked.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: "#3a3555" }}>
                    <span style={{ flexShrink: 0 }}>—</span><span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/oracle" style={{
                display: "block", textAlign: "center",
                background: tier.featured ? `linear-gradient(135deg, #9b7fe6, ${tier.color})` : "transparent",
                color: tier.featured ? "#000" : tier.color,
                border: tier.featured ? "none" : `1px solid ${tier.color}40`,
                fontFamily: "Syncopate, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                padding: "13px", borderRadius: 12, textDecoration: "none",
              }}>
                START FREE TRIAL
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#9b7fe6", fontFamily: "Syncopate, sans-serif", marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, fontStyle: "italic" }}>Common questions</h2>
          </div>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid #1f1b3a", padding: "24px 0" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 500, marginBottom: 10, color: "#e8e4f0" }}>{item.q}</div>
              <div style={{ fontSize: 14, color: "#6b6580", lineHeight: 1.8 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1f1b3a", padding: "32px", textAlign: "center", color: "#3a3555", fontSize: 11, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
        © 2026 MyOracle · myoracle.me · "The stars incline, they do not compel."
      </footer>
    </div>
  );
}
