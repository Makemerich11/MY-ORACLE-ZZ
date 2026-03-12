export default function AboutPage() {
  const pur = "#9b7fe6", acc = "#f6ad3c", bg = "#07060d", card = "#0f0d1f", bdr = "#1f1b3a", dim = "#6b6580", txt = "#e8e4f0", grn = "#3dbd7d";
  return (
    <div style={{minHeight:"100vh",background:bg,color:txt,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}a{color:${pur};text-decoration:none}a:hover{text-decoration:underline}@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}`}</style>

      {/* Nav */}
      <div style={{padding:"18px 24px",borderBottom:`1px solid ${bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:800,margin:"0 auto"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:8,color:acc,fontWeight:900,letterSpacing:2,fontSize:13,textDecoration:"none"}}>🔮 MYORACLE</a>
        <div style={{display:"flex",gap:20,fontSize:12,color:dim}}>
          <a href="/about">About</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px 80px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:48,marginBottom:16}}>🔮</div>
          <h1 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:900,margin:"0 0 16px",
            background:`linear-gradient(135deg,${acc},#e879a0,${pur})`,backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s linear infinite"}}>
            Built different.<br/>Because the stars are.
          </h1>
          <p style={{fontSize:14,color:dim,lineHeight:1.8,maxWidth:560,margin:"0 auto"}}>
            MyOracle isn't another horoscope app that tells you "Mercury is in retrograde, be careful." 
            It's a precision timing engine that runs your life against the actual sky — right now.
          </p>
        </div>

        {/* The Algorithm section */}
        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:20,padding:"28px 28px",marginBottom:20,borderTop:`3px solid ${pur}`}}>
          <div style={{fontSize:10,color:pur,fontWeight:800,letterSpacing:3,marginBottom:12}}>THE ENGINE</div>
          <h2 style={{fontSize:20,fontWeight:800,color:txt,margin:"0 0 16px"}}>12 astrological systems, running simultaneously</h2>
          <p style={{fontSize:13,color:dim,lineHeight:1.85,marginBottom:16}}>
            Most astrology apps pick one system — usually Western tropical — and call it a day. MyOracle runs twelve simultaneously and cross-correlates them against each other, looking for convergence signals.
          </p>
          <p style={{fontSize:13,color:dim,lineHeight:1.85,marginBottom:20}}>
            When multiple independent systems agree that a particular day is favourable for a particular domain of your life, confidence rises. When they conflict, confidence drops. You see this expressed as a single, honest percentage — not a vague "good vibes" forecast.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              ["🪐","Natal Transits","Live planets aspecting your birth chart"],
              ["📈","Secondary Progressions","Day-for-a-year symbolic movement"],
              ["🌀","Solar Arc Directions","1°/year — major life chapter markers"],
              ["🎯","Midpoint Analysis","Sensitive mathematical points in your chart"],
              ["🔮","Solar Return","Your annual birthday chart reset"],
              ["🏠","House System","Planetary placements by life area"],
              ["⚡","Planet Dignity","Exaltation, rulership, detriment, fall"],
              ["🌑","Eclipse Zones","Active eclipse degrees in your chart"],
              ["☿","Combustion Detection","Planets too close to the Sun"],
              ["✦","Antiscia Points","Mirror-degree activations"],
              ["👥","Mutual Receptions","Planets strengthening each other"],
              ["🌟","Stellium Analysis","Concentrated planetary clusters"],
            ].map(([icon,name,desc],i)=>(
              <div key={i} style={{background:`${pur}08`,border:`1px solid ${bdr}`,borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:11,fontWeight:700,color:txt,marginBottom:2}}>{name}</div>
                <div style={{fontSize:10,color:dim,lineHeight:1.5}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why % scores */}
        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:20,padding:"28px 28px",marginBottom:20,borderTop:`3px solid ${acc}`}}>
          <div style={{fontSize:10,color:acc,fontWeight:800,letterSpacing:3,marginBottom:12}}>WHY PERCENTAGES</div>
          <h2 style={{fontSize:20,fontWeight:800,color:txt,margin:"0 0 16px"}}>The most shareable, actionable signal in astrology</h2>
          <p style={{fontSize:13,color:dim,lineHeight:1.85,marginBottom:12}}>
            "Mercury is squaring your Saturn" means nothing to most people. "Your career score today is 31% — below threshold for big decisions" means something they can act on.
          </p>
          <p style={{fontSize:13,color:dim,lineHeight:1.85}}>
            Our scoring algorithm weights every planetary signal by strength, exactness of aspect, planet speed, retrograde status, and how many other systems corroborate it. The result is a single number that compresses extraordinary complexity into a format anyone can understand — and share.
          </p>
        </div>

        {/* Real time */}
        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:20,padding:"28px 28px",marginBottom:20,borderTop:`3px solid ${grn}`}}>
          <div style={{fontSize:10,color:grn,fontWeight:800,letterSpacing:3,marginBottom:12}}>REAL TIME DATA</div>
          <h2 style={{fontSize:20,fontWeight:800,color:txt,margin:"0 0 16px"}}>Not cached. Not rounded. Computed fresh for every reading.</h2>
          <p style={{fontSize:13,color:dim,lineHeight:1.85,marginBottom:12}}>
            Every calculation in MyOracle uses Swiss Ephemeris-grade planetary position algorithms computing positions to arc-minute precision. When you hit compute, we calculate where every planet actually is right now — not an approximation from a database.
          </p>
          <p style={{fontSize:13,color:dim,lineHeight:1.85}}>
            The world energy scores update continuously. Your personal scores factor in your exact birth date, time (where provided), and location against live planetary positions. This is what separates a timing engine from a horoscope.
          </p>
        </div>

        {/* Who built it */}
        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:20,padding:"28px 28px",marginBottom:40,borderTop:`3px solid #e879a0`}}>
          <div style={{fontSize:10,color:"#e879a0",fontWeight:800,letterSpacing:3,marginBottom:12}}>THE MISSION</div>
          <h2 style={{fontSize:20,fontWeight:800,color:txt,margin:"0 0 16px"}}>Astrology that respects your intelligence</h2>
          <p style={{fontSize:13,color:dim,lineHeight:1.85,marginBottom:12}}>
            The astrology industry is worth $6 billion and growing. Most of that money goes to apps that recycle the same generic sun-sign content dressed up with pretty UI. We built MyOracle because we believe people deserve the depth that serious astrological practice offers — accessible, honest, and quantified.
          </p>
          <p style={{fontSize:13,color:dim,lineHeight:1.85}}>
            We're not here to tell you what you want to hear. We're here to give you the most accurate planetary timing intelligence available — and let you decide what to do with it.
          </p>
        </div>

        {/* CTA */}
        <div style={{textAlign:"center"}}>
          <a href="/" style={{
            display:"inline-block",
            background:`linear-gradient(135deg,${pur},${acc})`,
            color:"#000",borderRadius:14,padding:"14px 40px",
            fontSize:14,fontWeight:900,letterSpacing:1,textDecoration:"none",
          }}>✨ Try the Oracle Free →</a>
          <div style={{fontSize:11,color:dim,marginTop:10}}>No sign-up required to start</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{borderTop:`1px solid ${bdr}`,padding:"24px",textAlign:"center",fontSize:11,color:dim}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:8}}>
          <a href="/">Home</a><a href="/about">About</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a>
        </div>
        © {new Date().getFullYear()} MyOracle · myoracle.me
      </div>
    </div>
  );
}
