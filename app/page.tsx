"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TIERS = [
  {
    id: 1, name: "Basic", price: "$9.99", period: "/mo",
    color: "#6b6580", accent: "#6b6580",
    tagline: "Your daily cosmic pulse",
    features: [
      "All 9 life domains — scores & verdicts",
      "7-day forecast",
      "Should I...? quick guide",
      "Moon phase & retrograde alerts",
      "Eclipse window notifications",
    ],
    locked: ["Signal breakdown detail", "30-day calendar", "Chart view", "Solar arc progressions"],
    cta: "Start Free Trial",
  },
  {
    id: 2, name: "Plus", price: "$29.99", period: "/mo",
    color: "#9b7fe6", accent: "#9b7fe6",
    tagline: "Full signal intelligence",
    features: [
      "Everything in Basic",
      "Full signal breakdown — the why behind every score",
      "30-day forecast + Best Days calendar",
      "Natal chart + current transits",
      "Solar arc progressions",
      "Eclipse amplifier detail",
      "Station detection",
    ],
    locked: ["Birth time & location precision", "Deeper domain specialisations"],
    cta: "Start Free Trial",
  },
  {
    id: 3, name: "Pro", price: "$79.99", period: "/mo",
    color: "#f6ad3c", accent: "#f6ad3c",
    tagline: "Maximum precision",
    featured: true,
    features: [
      "Everything in Plus",
      "Birth time input → Ascendant + Houses",
      "Location / timezone → precise planetary hours",
      "Natal patterns (Grand Trine, Stellium)",
      "Deep domain specialisations:",
      "  · Finance — market cycle overlays",
      "  · Health — biorhythm + surgery windows",
      "  · Travel — departure timing",
      "  · Love — Venus cycle detail",
      "  · Career — authority approach windows",
    ],
    locked: ["Oracle chatbot", "Daily push readings"],
    cta: "Start Free Trial",
  },
  {
    id: 4, name: "Pro+", price: "$99.99", period: "/mo",
    color: "#e879a0", accent: "#e879a0",
    tagline: "Your personal Oracle",
    features: [
      "Everything in Pro",
      "Oracle chatbot — voice + text",
      "Daily push readings — Oracle messages you each morning",
      "Interactive Q&A on your reading",
      "People in Your Orbit — synastry & compatibility",
      "Weekly deep-dive reports",
      "Priority interpretation quality",
      "Free trial of every new feature first",
    ],
    locked: [],
    cta: "Start Free Trial",
  },
];

const TESTIMONIALS = [
  { text: "I pushed my contract signing by 3 days based on the Oracle reading. The deal closed better than expected.", name: "Sarah M.", role: "Entrepreneur", tier: "Pro" },
  { text: "The daily push notification is the first thing I check every morning. It's changed how I plan my week.", name: "James K.", role: "Investor", tier: "Pro+" },
  { text: "Skeptical at first. But the accuracy of the timing predictions over 3 months convinced me.", name: "Priya L.", role: "Creative Director", tier: "Plus" },
];

const DOMAINS = [
  { icon: "💼", name: "Career", desc: "Launches, promotions, bold moves" },
  { icon: "💕", name: "Love", desc: "Proposals, difficult conversations" },
  { icon: "📜", name: "Contracts", desc: "Signing, negotiations, deals" },
  { icon: "✈️", name: "Travel", desc: "Moving, relocating, journeys" },
  { icon: "🌿", name: "Health", desc: "Surgery timing, new regimens" },
  { icon: "🎨", name: "Creative", desc: "Launches, performances, art" },
  { icon: "📚", name: "Learning", desc: "Exams, courses, teaching" },
  { icon: "🧘", name: "Spiritual", desc: "Retreats, therapy, inner work" },
  { icon: "💰", name: "Wealth", desc: "Investments, property, salary" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--txt)" }}>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 30%, rgba(155,127,230,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(246,173,60,0.05) 0%, transparent 50%)" }}/>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(7,6,13,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(31,27,58,0.8)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 2 }}>my</span>
          <span style={{ fontSize: 18, fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 3, color: "var(--txt)" }}>ORACLE</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features", "Pricing", "How It Works"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontSize: 11, color: "var(--dim)", fontFamily: "Syncopate, sans-serif", letterSpacing: 1, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--txt)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}>
              {item}
            </a>
          ))}
          <Link href="/oracle" style={{
            background: "linear-gradient(135deg, var(--pur), var(--acc))",
            color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: 1, padding: "10px 20px", borderRadius: 10, textDecoration: "none",
            transition: "opacity 0.2s",
          }}>
            TRY FREE
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* Orbiting ring */}
        <div style={{ position: "relative", width: 120, height: 120, marginBottom: 48 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(155,127,230,0.3)", animation: "float 6s ease-in-out infinite" }}/>
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(246,173,60,0.2)", animation: "float 6s ease-in-out infinite 1s" }}/>
          <div style={{ position: "absolute", inset: 16, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,127,230,0.15), transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
            🔮
          </div>
        </div>

        <div style={{ fontSize: 10, letterSpacing: 6, color: "var(--pur)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 20 }}>
          PERSONAL DECISION ORACLE
        </div>

        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
          <span style={{ display: "block", fontSize: "clamp(52px, 8vw, 96px)", fontStyle: "italic",
            background: "linear-gradient(135deg, #f6ad3c, #e879a0, #9b7fe6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Know When to Act.
          </span>
          <span style={{ display: "block", fontSize: "clamp(36px, 5vw, 64px)", color: "var(--dim)", fontWeight: 300 }}>
            Not just what to do.
          </span>
        </h1>

        <p style={{ fontSize: 17, color: "var(--dim)", maxWidth: 560, lineHeight: 1.8, marginBottom: 48, fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>
          MyOracle analyses your personal birth chart against real planetary positions to tell you the optimal timing for every major life decision — career moves, contracts, love, health, wealth and more.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/oracle" style={{
            background: "linear-gradient(135deg, var(--pur), var(--acc))",
            color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 1, padding: "16px 36px", borderRadius: 14, textDecoration: "none",
            display: "inline-block",
          }}>
            CONSULT THE ORACLE FREE
          </Link>
          <a href="#pricing" style={{
            background: "transparent", color: "var(--dim)", fontFamily: "Syncopate, sans-serif",
            fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "15px 28px",
            borderRadius: 14, textDecoration: "none", border: "1px solid var(--bdr)", display: "inline-block",
          }}>
            VIEW PLANS
          </a>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 64, display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          {[["🔮", "Real astronomical data"], ["⚡", "Instant readings"], ["🎯", "9 life domains"]].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--dim)" }}>
              <span>{icon}</span>
              <span style={{ fontFamily: "Syncopate, sans-serif", fontSize: 9, letterSpacing: 1 }}>{text.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--acc)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 16 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, fontStyle: "italic" }}>
              The Oracle reads your chart
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { step: "01", title: "Enter your birth date", desc: "Your natal chart is calculated from real planetary positions at the moment you were born.", icon: "📅" },
              { step: "02", title: "Choose your target date", desc: "The Oracle analyses current transits against your chart — today or any future date.", icon: "🔭" },
              { step: "03", title: "Receive your reading", desc: "Scores across 9 life domains with signal breakdowns, confidence ratings, and optimal timing windows.", icon: "📊" },
            ].map(item => (
              <div key={item.step} style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 16, padding: 32, position: "relative" }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--mut)", fontFamily: "Syncopate, sans-serif", marginBottom: 16 }}>{item.step}</div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 500, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section id="features" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--pur)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 16 }}>9 LIFE DOMAINS</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, fontStyle: "italic" }}>
              Every dimension of your life, timed
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {DOMAINS.map(d => (
              <div key={d.name} style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "20px 16px", textAlign: "center", transition: "border-color 0.2s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--pur)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bdr)")}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{d.icon}</div>
                <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{d.name.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: "var(--dim)" }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--pnk)", fontFamily: "Syncopate, sans-serif", marginBottom: 48 }}>WHAT USERS SAY</div>
          <div style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 20, padding: "48px 40px", minHeight: 180 }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.7, color: "var(--txt)", marginBottom: 24 }}>
              "{TESTIMONIALS[activeTestimonial].text}"
            </p>
            <div style={{ fontSize: 12, color: "var(--dim)" }}>
              <span style={{ color: "var(--txt)", fontWeight: 500 }}>{TESTIMONIALS[activeTestimonial].name}</span>
              {" · "}{TESTIMONIALS[activeTestimonial].role}
              {" · "}<span style={{ color: "var(--acc)" }}>{TESTIMONIALS[activeTestimonial].tier}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? "var(--acc)" : "var(--mut)", border: "none", cursor: "pointer", transition: "all 0.3s" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--acc)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 16 }}>PRICING</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, fontStyle: "italic", marginBottom: 16 }}>
              Choose your depth of knowing
            </h2>
            <p style={{ fontSize: 14, color: "var(--dim)", maxWidth: 480, margin: "0 auto" }}>
              Every tier includes a free trial of the tier above — so you always know what you're upgrading to.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {TIERS.map(tier => (
              <div key={tier.id} style={{
                background: tier.featured ? `linear-gradient(160deg, var(--card), #1a1408)` : "var(--card)",
                border: `1px solid ${tier.featured ? tier.color : "var(--bdr)"}`,
                borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
                transition: "transform 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>

                {tier.featured && (
                  <div style={{ position: "absolute", top: 16, right: 16, background: "var(--acc)", color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 6 }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: 9, letterSpacing: 3, color: tier.color, fontFamily: "Syncopate, sans-serif", fontWeight: 700, marginBottom: 8 }}>
                  TIER {tier.id}
                </div>
                <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tier.name}</div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 14, color: "var(--dim)", fontStyle: "italic", marginBottom: 24 }}>{tier.tagline}</div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                  <span style={{ fontFamily: "Syncopate, sans-serif", fontSize: 32, fontWeight: 700, color: tier.color }}>{tier.price}</span>
                  <span style={{ fontSize: 12, color: "var(--dim)" }}>{tier.period}</span>
                </div>

                <div style={{ marginBottom: 24 }}>
                  {tier.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: f.startsWith("  ·") ? "var(--dim)" : "var(--txt)" }}>
                      {!f.startsWith("  ·") && <span style={{ color: "var(--grn)", flexShrink: 0 }}>✓</span>}
                      {f.startsWith("  ·") && <span style={{ color: "var(--dim)", flexShrink: 0, marginLeft: 16 }}>·</span>}
                      <span>{f.startsWith("  ·") ? f.slice(4) : f}</span>
                    </div>
                  ))}
                  {tier.locked.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: "var(--mut)", textDecoration: "none" }}>
                      <span style={{ color: "var(--mut)", flexShrink: 0 }}>—</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/oracle" style={{
                  display: "block", textAlign: "center",
                  background: tier.featured ? `linear-gradient(135deg, var(--pur), ${tier.color})` : "transparent",
                  color: tier.featured ? "#000" : tier.color,
                  border: tier.featured ? "none" : `1px solid ${tier.color}40`,
                  fontFamily: "Syncopate, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  padding: "13px", borderRadius: 12, textDecoration: "none",
                  transition: "opacity 0.2s",
                }}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🔮</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, fontStyle: "italic", marginBottom: 20 }}>
            The Oracle is ready for you
          </h2>
          <p style={{ fontSize: 15, color: "var(--dim)", marginBottom: 40, lineHeight: 1.8 }}>
            Start with your free reading — no account required. See your chart, your scores, and your best days for the next 30 days.
          </p>
          <Link href="/oracle" style={{
            background: "linear-gradient(135deg, var(--pur), var(--acc))",
            color: "#000", fontFamily: "Syncopate, sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, padding: "18px 48px", borderRadius: 14, textDecoration: "none",
            display: "inline-block",
          }}>
            CONSULT THE ORACLE — FREE
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--bdr)", padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 10, color: "var(--dim)", fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 2 }}>my</span>
          <span style={{ fontSize: 14, fontFamily: "Syncopate, sans-serif", fontWeight: 700, letterSpacing: 3, color: "var(--txt)" }}>ORACLE</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--mut)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
          "The stars incline, they do not compel."
        </div>
        <div style={{ fontSize: 11, color: "var(--mut)" }}>
          © 2026 MyOracle · myoracle.me
        </div>
      </footer>
    </div>
  );
}
// domain config
