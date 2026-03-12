"use client";
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface DailyFocus {
  focus: string;
  date: string;
  snapshot: { overallEnergy: number; moonPhase: string; sunSign: string };
}

export default function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [step, setStep] = useState(0);
  const [notifState, setNotifState] = useState<"idle"|"asking"|"granted"|"denied">("idle");
  const [dailyFocus, setDailyFocus] = useState<DailyFocus | null>(null);
  const [showFocus, setShowFocus] = useState(false);
  const [view, setView] = useState<"install"|"notify">("install");

  const loadDailyFocus = useCallback(async () => {
    const dob = localStorage.getItem("oracle_dob") || "";
    try {
      const res = await fetch(`/api/daily-focus${dob ? `?dob=${encodeURIComponent(dob)}` : ""}`);
      const data = await res.json();
      setDailyFocus(data);
    } catch {}
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      setIsInstalled(true);
      const lastShown = localStorage.getItem("daily_focus_shown");
      const today = new Date().toDateString();
      const hour = new Date().getHours();
      if (lastShown !== today && hour >= 6 && hour <= 12) {
        loadDailyFocus().then(() => {
          setShowFocus(true);
          localStorage.setItem("daily_focus_shown", today);
        });
      }
      return;
    }

    const dismissed = localStorage.getItem("pwa_dismissed_v3");
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios && isSafari) { setTimeout(() => setShowBanner(true), 5000); return; }
    if (ios) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 5000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [loadDailyFocus]);

  useEffect(() => {
    if (!isIOS || !showBanner) return;
    const t = setInterval(() => setStep(s => (s + 1) % 3), 2800);
    return () => clearInterval(t);
  }, [isIOS, showBanner]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setShowBanner(false);
      setTimeout(() => { setView("notify"); setShowBanner(true); }, 1200);
    } else {
      setInstallPrompt(null);
    }
  };

  const handleNotif = async () => {
    setNotifState("asking");
    try {
      const perm = await Notification.requestPermission();
      setNotifState(perm === "granted" ? "granted" : "denied");
      if (perm === "granted") setTimeout(() => setShowBanner(false), 1800);
    } catch { setNotifState("denied"); }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowFocus(false);
    localStorage.setItem("pwa_dismissed_v3", Date.now().toString());
  };

  const ec = (e: number) => e >= 70 ? "#3dbd7d" : e >= 45 ? "#f6ad3c" : "#e55050";

  const STYLES = `
    @keyframes slideUp { from{transform:translateY(110%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes fadeStep { 0%{opacity:0;transform:translateY(8px)} 15%{opacity:1;transform:translateY(0)} 85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-8px)} }
    @keyframes bounceD { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
    @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(155,127,230,0.4)} 50%{box-shadow:0 0 0 10px rgba(155,127,230,0)} }
    .pwa-b{animation:slideUp .5s cubic-bezier(.34,1.56,.64,1)}
    .step-a{animation:fadeStep 2.8s ease-in-out infinite}
    .arr{animation:bounceD 1.2s ease-in-out infinite;display:inline-block}
    .glow-btn{animation:glow 2s infinite}
  `;

  const BASE = {
    position:"fixed" as const, bottom:0, left:0, right:0, zIndex:9999,
    background:"linear-gradient(160deg,#1a1535 0%,#0d0b1e 100%)",
    borderTop:"1px solid #9b7fe6", borderRadius:"20px 20px 0 0",
    boxShadow:"0 -8px 40px rgba(155,127,230,0.3)",
    padding:"20px 20px 28px",
  };

  // Daily focus morning card
  if (showFocus && dailyFocus) {
    const lines = dailyFocus.focus.split("\n").filter(Boolean);
    const verdict = lines[0] || "";
    const rest = lines.slice(1).filter(l => l.trim());
    return (
      <>
        <style>{STYLES}</style>
        <div className="pwa-b" style={BASE}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>🔮</span>
              <div>
                <div style={{color:"#f6ad3c",fontWeight:700,fontSize:12,letterSpacing:1}}>TODAY'S ORACLE BRIEFING</div>
                <div style={{color:"#6b6580",fontSize:11}}>{dailyFocus.date}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{background:ec(dailyFocus.snapshot.overallEnergy)+"22",border:`1px solid ${ec(dailyFocus.snapshot.overallEnergy)}`,borderRadius:8,padding:"3px 10px",color:ec(dailyFocus.snapshot.overallEnergy),fontSize:13,fontWeight:700}}>
                {dailyFocus.snapshot.overallEnergy}%
              </span>
              <button onClick={handleDismiss} style={{background:"transparent",border:"none",color:"#6b6580",fontSize:18,cursor:"pointer"}}>✕</button>
            </div>
          </div>
          <div style={{color:"#e8deff",fontWeight:700,fontSize:15,marginBottom:12,lineHeight:1.4}}>{verdict}</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {rest.map((line,i)=>{
              const c = line.includes("AVOID") ? "#e55050" : line.includes("FOCUS") ? "#3dbd7d" : line.includes("WINDOW") ? "#f6ad3c" : "#9b7fe6";
              return <div key={i} style={{background:c+"15",border:`1px solid ${c}33`,borderRadius:8,padding:"8px 12px",color:c,fontSize:13,lineHeight:1.5}}>{line}</div>;
            })}
          </div>
          <div style={{marginTop:12,color:"#6b6580",fontSize:11}}>🌙 {dailyFocus.snapshot.moonPhase} · ☀️ {dailyFocus.snapshot.sunSign}</div>
        </div>
      </>
    );
  }

  if (!showBanner) return null;

  // Notification offer
  if (view === "notify") {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pwa-b" style={BASE}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:38,marginBottom:10}}>🔔</div>
            <div style={{color:"#f6ad3c",fontWeight:700,fontSize:16,marginBottom:8}}>Daily Oracle Reminders</div>
            <div style={{color:"#8a7aaa",fontSize:13,lineHeight:1.6,marginBottom:20}}>
              Get your personal cosmic briefing every morning — energy score, what to focus on, and what to avoid.
            </div>
            {notifState==="granted" ? (
              <div style={{color:"#3dbd7d",fontWeight:700,fontSize:15}}>✓ Daily reminders activated!</div>
            ) : notifState==="denied" ? (
              <div style={{color:"#6b6580",fontSize:13}}>Enable notifications in your device settings to receive daily briefings.</div>
            ) : (
              <div style={{display:"flex",gap:10}}>
                <button onClick={handleNotif} className="glow-btn" style={{flex:1,background:"linear-gradient(135deg,#9b7fe6,#7c5cbf)",color:"white",border:"none",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  {notifState==="asking" ? "..." : "Notify me daily ✦"}
                </button>
                <button onClick={handleDismiss} style={{background:"transparent",color:"#6b6580",border:"1px solid #2a2548",borderRadius:12,padding:"14px 16px",fontSize:13,cursor:"pointer"}}>Later</button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // iOS guide
  if (isIOS) {
    const steps = [
      {icon:"⬆️",bg:"#f6ad3c22",border:"#f6ad3c55",color:"#f6ad3c",label:"1. Tap Share",sub:"The box with arrow ↑ at the bottom of Safari"},
      {icon:"➕",bg:"#9b7fe622",border:"#9b7fe655",color:"#9b7fe6",label:'2. Tap "Add to Home Screen"',sub:"Scroll down in the share menu to find it"},
      {icon:"✅",bg:"#3dbd7d22",border:"#3dbd7d55",color:"#3dbd7d",label:"3. Tap Add — installed!",sub:"MyOracle lives on your home screen like a real app"},
    ];
    const s = steps[step];
    return (
      <>
        <style>{STYLES}</style>
        <div className="pwa-b" style={BASE}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src="/icons/icon-72x72.png" alt="" style={{width:44,height:44,borderRadius:10}} />
              <div>
                <div style={{color:"#f6ad3c",fontWeight:700,fontSize:14}}>📲 Install MyOracle</div>
                <div style={{color:"#6b6580",fontSize:11}}>Free · No App Store needed</div>
              </div>
            </div>
            <button onClick={handleDismiss} style={{background:"transparent",border:"none",color:"#6b6580",fontSize:18,cursor:"pointer"}}>✕</button>
          </div>

          <div className="step-a" style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{fontSize:30}}>{s.icon}</div>
            <div>
              <div style={{color:s.color,fontWeight:700,fontSize:14}}>{s.label}</div>
              <div style={{color:"#8a7aaa",fontSize:12,marginTop:3}}>{s.sub}</div>
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:12}}>
            {steps.map((_,i)=>(
              <div key={i} style={{width:i===step?20:6,height:6,borderRadius:3,background:i===step?"#9b7fe6":"#2a2548",transition:"all .3s"}} />
            ))}
          </div>

          <div style={{textAlign:"center"}}>
            <div style={{color:"#6b6580",fontSize:12}}>Tap the share icon at the bottom of Safari</div>
            <div className="arr" style={{color:"#9b7fe6",fontSize:22,marginTop:4}}>↓</div>
          </div>
        </div>
      </>
    );
  }

  // Android one-tap
  return (
    <>
      <style>{STYLES}</style>
      <div className="pwa-b" style={BASE}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <img src="/icons/icon-72x72.png" alt="" style={{width:52,height:52,borderRadius:12}} />
          <div style={{flex:1}}>
            <div style={{color:"#f6ad3c",fontWeight:700,fontSize:15,marginBottom:3}}>Install MyOracle</div>
            <div style={{color:"#8a7aaa",fontSize:12}}>Add to home screen · instant access · no App Store</div>
          </div>
          <button onClick={handleDismiss} style={{background:"transparent",border:"none",color:"#6b6580",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={handleInstall} className="glow-btn" style={{flex:1,background:"linear-gradient(135deg,#9b7fe6,#7c5cbf)",color:"white",border:"none",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            🔮 Install Free
          </button>
          <button onClick={handleDismiss} style={{background:"transparent",color:"#6b6580",border:"1px solid #2a2548",borderRadius:12,padding:"14px 16px",fontSize:13,cursor:"pointer"}}>Later</button>
        </div>
      </div>
    </>
  );
}
