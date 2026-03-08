"use client";
import { useRouter } from "next/navigation";

const CL = {
  bg: "#07060d", card: "#0e0d18", card2: "#16142a", bdr: "#1f1b3a",
  acc: "#f6ad3c", grn: "#3dbd7d", red: "#e55050", pur: "#9b7fe6",
  pnk: "#e879a0", txt: "#e8e4f0", dim: "#6b6580",
};

const TIERS = [
  {
    id: 1, name: "Basic", price: "$9.99", color: "#6b6580", period: "/mo",
    tagline: "Start reading the stars",
    features: [
      "All 9 life domain scores",
      "Daily verdicts & Should I...?",
      "7-day personal forecast",
      "Moon phase & retrograde alerts",
      "Planetary hour timing",
    ],
    locked: ["Signal breakdown detail", "30-day forecast", "Chart view", "Best Days calendar", "AI interpretation"],
  },
  {
    id: 2, name: "Plus", price: "$29.99", color: "#9b7fe6", period: "/mo",
    tagline: "Go deeper into every signal",
    features: [
      "Everything in Basic",
      "Full signal breakdown per domain",
      "30-day personal cosmic map",
      "Best Days calendar by domain",
      "Natal chart + transit aspects",
      "Aspect strength & exactness",
    ],
    locked: ["Birth time precision", "AI Oracle interpretation", "Daily push readings"],
  },
  {
    id: 3, name: "Pro", price: "$79.99", color: "#f6ad3c", period: "/mo",
    tagline: "The full Oracle experience",
    popular: true,
    features: [
      "Everything in Plus",
      "AI Oracle interpretation (Claude)",
      "Birth time + location precision",
      "Deeper domain specialisations",
      "Natal pattern detection",
      "Solar arc progressions",
    ],
    locked: ["Daily push readings", "Voice Oracle", "Synastry / partner charts"],
  },
  {
    id: 4, name: "Pro+", price: "$99.99", color: "#e879a0", period: "/mo",
    tagline: "The Oracle, unleashed",
    features: [
      "Everything in Pro",
      "Oracle AI voice + chatbot",
      "Daily personalised push readings",
      "People in Your Orbit (synastry)",
      "Priority support",
      "Early access to new features",
    ],
    locked: [],
  },
];

const FAQ = [
  { q: "Is there a free trial?", a: "Yes — every plan starts with a free 7-day trial of the tier above. So if you pick Basic, you'll experience Plus free for 7 days before dropping to Basic." },
  { q: "How is this personalised?", a: "Your date of birth is used to calculate your natal planetary positions. Every reading compares real-time transits to your unique chart — no two people see the same scores." },
  { q: "Can I change tiers?", a: "Anytime. Upgrade or downgrade with immediate effect. If you upgrade mid-cycle you're only charged the difference." },
  { q: "What does the AI interpretation do?", a: "Available on Pro and above, the AI Oracle reads your planetary positions and speaks your reading in the Oracle's own voice — giving personalised narrative interpretation beyond just numbers." },
  { q: "How accurate are the calculations?", a: "We use real astronomical orbital mechanics — not symbolic approximations. Planetary positions are accurate to within 1-2° of precision ephemeris data." },
];

export default function PricingPage() {
  const router = useRouter();

  const selectTier = (tierId: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("myoracle_tier", String(tierId));
    }
    router.push("/oracle");
  };

  return (
    <div style={{ background: CL.bg, color: CL.txt, minHeight: "100vh", fontFamily: "Georgia, Palatino, serif" }}>
      <style>{`
        @keyframes glow { 0%,100%{text-shadow:0 0 20px #f6ad3c33} 50%{text-shadow:0 0 40px #f6ad3c66,0 0 80px #9b7fe633} }
        * { box-sizing: border-box; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${CL.bdr}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontFamily: "Syncopate, sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
          <span style={{ color: CL.dim, fontSize: 10 }}>my</span>
          <span style={{ color: CL.txt }}>ORACLE</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontFamily: "system-ui", fontSize: 12 }}>
          <a href="/oracle" style={{ color: CL.dim }}>Oracle</a>
          <a href="/pricing" style={{ color: CL.acc }}>Pricing</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "70px 20px 50px" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: CL.pur, fontFamily: "system-ui", fontWeight: 700, marginBottom: 12 }}>CHOOSE YOUR PLAN</div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 52, fontWeight: 300, fontStyle: "italic", margin: "0 0 16px", animation: "glow 5s ease infinite" }}>
          Your Oracle, your depth
        </h1>
        <p style={{ fontSize: 16, color: CL.dim, maxWidth: 500, margin: "0 auto 16px", fontFamily: "system-ui", lineHeight: 1.7 }}>
          Every plan reads the real sky for your unique birth chart. Choose how deep you want to go.
        </p>
        <div style={{ display: "inline-block", background: `${CL.grn}15`, border: `1px solid ${CL.grn}40`, borderRadius: 20, padding: "8px 20px", fontSize: 12, color: CL.grn, fontFamily: "system-ui" }}>
          ✨ 7-day free trial of the tier above — on every plan
        </div>
      </div>

      {/* TIER CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>
        {TIERS.map(tier => (
          <div key={tier.id} style={{
            background: CL.card,
            border: `1px solid ${tier.popular ? tier.color : CL.bdr}`,
            borderRadius: 20,
            padding: 32,
            position: "relative",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.borderColor = tier.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = tier.popular ? tier.color : CL.bdr; }}
          >
            {tier.popular && (
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${CL.pur}, ${tier.color})`, color: "#000", fontSize: 9, fontWeight: 800, fontFamily: "system-ui", letterSpacing: 2, padding: "5px 16px", borderRadius: 20 }}>
                MOST POPULAR
              </div>
            )}

            <div style={{ fontSize: 9, letterSpacing: 3, color: tier.color, fontFamily: "system-ui", fontWeight: 700, marginBottom: 6 }}>TIER {tier.id}</div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{tier.name}</div>
            <div style={{ fontSize: 11, color: CL.dim, fontFamily: "system-ui", marginBottom: 20 }}>{tier.tagline}</div>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "system-ui", fontSize: 42, fontWeight: 900, color: tier.color }}>{tier.price}</span>
              <span style={{ fontFamily: "system-ui", fontSize: 13, color: CL.dim }}>{tier.period}</span>
            </div>

            <button
              onClick={() => selectTier(tier.id)}
              style={{
                width: "100%", padding: "14px", marginBottom: 28,
                background: tier.popular ? `linear-gradient(135deg, ${CL.pur}, ${tier.color})` : "transparent",
                border: `1px solid ${tier.color}`,
                color: tier.popular ? "#000" : tier.color,
                borderRadius: 12, fontSize: 11, fontWeight: 800,
                fontFamily: "system-ui", letterSpacing: 1, cursor: "pointer",
              }}
            >
              START FREE TRIAL →
            </button>

            <div style={{ marginBottom: 20 }}>
              {tier.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", fontFamily: "system-ui", fontSize: 12, color: CL.txt, borderBottom: `1px solid ${CL.bdr}30` }}>
                  <span style={{ color: CL.grn }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
              {tier.locked.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", fontFamily: "system-ui", fontSize: 12, color: CL.dim, borderBottom: `1px solid ${CL.bdr}20` }}>
                  <span>🔒</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {tier.id < 4 && (
              <div style={{ fontSize: 10, color: CL.dim, fontFamily: "system-ui", fontStyle: "italic", textAlign: "center" }}>
                Free trial includes {TIERS[tier.id].name} features for 7 days
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 300, fontStyle: "italic", marginBottom: 40 }}>
          Questions
        </h2>
        {FAQ.map((item, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${CL.bdr}`, padding: "20px 0" }}>
            <div style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 700, color: CL.acc, marginBottom: 8 }}>{item.q}</div>
            <div style={{ fontFamily: "system-ui", fontSize: 13, color: CL.dim, lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${CL.bdr}`, padding: "30px", textAlign: "center", fontFamily: "system-ui", fontSize: 11, color: CL.dim }}>
        <i>"The stars incline, they do not compel."</i>
        <div style={{ marginTop: 8 }}>© 2026 myoracle.me · <a href="/" style={{ color: CL.dim }}>Home</a> · <a href="/oracle" style={{ color: CL.dim }}>Oracle</a></div>
      </div>
    </div>
  );
}
