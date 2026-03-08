// @ts-nocheck
"use client";
import { useState, useEffect, useCallback } from "react";

// =====================================================
// 🔮 ORACLE v3 — PERSONAL DECISION ENGINE
// Same framework that called Iran. Now for YOUR life.
// =====================================================

const PLANETS = [
  { name:"Sun",sym:"☉",c:"#f6ad3c",period:365.25,domain:"Identity · Purpose · Leadership",action:"Self-expression, authority moves, creative launches" },
  { name:"Moon",sym:"☽",c:"#c4cdd4",period:27.32,domain:"Emotion · Intuition · Cycles",action:"Moving, family decisions, emotional commitments" },
  { name:"Mercury",sym:"☿",c:"#45d0c8",period:87.97,domain:"Mind · Contracts · Communication",action:"Signing, negotiations, travel, learning" },
  { name:"Venus",sym:"♀",c:"#e879a0",period:224.7,domain:"Love · Beauty · Values · Wealth",action:"Proposals, purchases, art, relationships" },
  { name:"Mars",sym:"♂",c:"#e55050",period:686.97,domain:"Drive · Courage · Conflict · Energy",action:"Starting projects, physical challenges, asserting" },
  { name:"Jupiter",sym:"♃",c:"#9b7fe6",period:4332.59,domain:"Growth · Luck · Expansion · Wisdom",action:"Big ventures, education, travel, legal, publishing" },
  { name:"Saturn",sym:"♄",c:"#7a8594",period:10759.22,domain:"Structure · Karma · Discipline · Time",action:"Long-term commitments, career, foundations" },
  { name:"Uranus",sym:"♅",c:"#38d6f5",period:30688.5,domain:"Revolution · Freedom · Surprise",action:"Breaking patterns, innovation, sudden shifts" },
  { name:"Neptune",sym:"♆",c:"#7c8cf5",period:60182,domain:"Dreams · Spirit · Illusion · Healing",action:"Creative vision, healing, spiritual practice" },
  { name:"Pluto",sym:"♇",c:"#b366e0",period:90560,domain:"Transformation · Power · Rebirth",action:"Deep change, releasing, endings → beginnings" },
];
const SIGNS = [
  { name:"Aries",sym:"♈",el:"fire",start:0,c:"#e55050",trait:"Initiative, courage" },
  { name:"Taurus",sym:"♉",el:"earth",start:30,c:"#3dbd7d",trait:"Stability, persistence" },
  { name:"Gemini",sym:"♊",el:"air",start:60,c:"#f6c23c",trait:"Curiosity, adaptability" },
  { name:"Cancer",sym:"♋",el:"water",start:90,c:"#c4cdd4",trait:"Nurturing, emotional depth" },
  { name:"Leo",sym:"♌",el:"fire",start:120,c:"#f6ad3c",trait:"Creativity, self-expression" },
  { name:"Virgo",sym:"♍",el:"earth",start:150,c:"#45d0c8",trait:"Analysis, refinement" },
  { name:"Libra",sym:"♎",el:"air",start:180,c:"#e879a0",trait:"Balance, harmony" },
  { name:"Scorpio",sym:"♏",el:"water",start:210,c:"#b366e0",trait:"Intensity, transformation" },
  { name:"Sagittarius",sym:"♐",el:"fire",start:240,c:"#9b7fe6",trait:"Adventure, wisdom" },
  { name:"Capricorn",sym:"♑",el:"earth",start:270,c:"#7a8594",trait:"Ambition, mastery" },
  { name:"Aquarius",sym:"♒",el:"air",start:300,c:"#38d6f5",trait:"Innovation, freedom" },
  { name:"Pisces",sym:"♓",el:"water",start:330,c:"#7c8cf5",trait:"Intuition, compassion" },
];
const ASPECTS = [
  { name:"Conjunction",angle:0,orb:8,sym:"☌",power:10,nature:"fusion",c:"#f6ad3c" },
  { name:"Sextile",angle:60,orb:5,sym:"⚹",power:4,nature:"opportunity",c:"#45d0c8" },
  { name:"Square",angle:90,orb:7,sym:"□",power:8,nature:"tension",c:"#e55050" },
  { name:"Trine",angle:120,orb:7,sym:"△",power:7,nature:"flow",c:"#3dbd7d" },
  { name:"Opposition",angle:180,orb:8,sym:"☍",power:9,nature:"polarity",c:"#e879a0" },
];
const DOMAINS = [
  { id:"career",name:"Career & Business",icon:"💼",rulers:["Sun","Saturn","Jupiter","Mars"],sub:"Launches, promotions, ventures, job changes, authority moves" },
  { id:"love",name:"Love & Relationships",icon:"💕",rulers:["Venus","Moon","Jupiter"],sub:"Commitments, proposals, difficult conversations, deep connection" },
  { id:"contracts",name:"Contracts & Signing",icon:"📜",rulers:["Mercury","Jupiter","Saturn"],sub:"Legal filings, negotiations, agreements, documents, deals" },
  { id:"travel",name:"Travel & Relocation",icon:"✈️",rulers:["Mercury","Jupiter","Moon"],sub:"Moving house, big journeys, new environments, relocation" },
  { id:"health",name:"Health & Body",icon:"🌿",rulers:["Mars","Sun","Moon"],sub:"Surgery timing, new regimens, recovery, lifestyle changes" },
  { id:"creative",name:"Creative Projects",icon:"🎨",rulers:["Venus","Neptune","Sun","Mercury"],sub:"Art, writing, launches, performances, publishing" },
  { id:"learning",name:"Learning & Growth",icon:"📚",rulers:["Mercury","Jupiter","Saturn"],sub:"Courses, exams, study, teaching, mentoring, certifications" },
  { id:"spiritual",name:"Spiritual & Inner Work",icon:"🧘",rulers:["Neptune","Moon","Pluto"],sub:"Retreats, therapy, meditation, deep reflection, healing" },
  { id:"financial",name:"Major Purchases",icon:"💰",rulers:["Venus","Jupiter","Saturn","Pluto"],sub:"Property, vehicles, investments, salary negotiations" },
];
const QUICK_QS = [
  { q:"Sign a contract today?",dom:"contracts",icon:"✍️" },
  { q:"Start a new venture?",dom:"career",icon:"🚀" },
  { q:"Have a difficult conversation?",dom:"love",icon:"💬" },
  { q:"Move or relocate?",dom:"travel",icon:"🏠" },
  { q:"Make a big purchase?",dom:"financial",icon:"💳" },
  { q:"Launch creative work?",dom:"creative",icon:"🎨" },
  { q:"Schedule surgery / health change?",dom:"health",icon:"💪" },
  { q:"Start a course or exam prep?",dom:"learning",icon:"📖" },
];

// --- COMPUTATION ENGINE ---
const mod360 = v => ((v%360)+360)%360;
const Eng = {
  T: d => { const y=d.getFullYear(),m=d.getMonth()+1,da=d.getDate(),a=Math.floor((14-m)/12),y1=y+4800-a,m1=m+12*a-3; return ((da+Math.floor((153*m1+2)/5)+365*y1+Math.floor(y1/4)-Math.floor(y1/100)+Math.floor(y1/400)-32045)-2451545.0)/36525; },
  pos: date => {
    const T=Eng.T(date), d2=new Date(date); d2.setDate(d2.getDate()-1); const T2=Eng.T(d2);
    const R={Sun:280.4664567+360.0076983*T,Moon:218.3164477+481267.88123421*T,Mercury:252.2509+149472.6746*T,Venus:181.9798+58517.8157*T,Mars:355.4330+19140.2993*T,Jupiter:34.3515+3034.9057*T,Saturn:50.0774+1222.1138*T,Uranus:314.055+428.4677*T,Neptune:304.349+218.4862*T,Pluto:238.929+145.2078*T};
    const Y={Mercury:252.2509+149472.6746*T2,Venus:181.9798+58517.8157*T2,Mars:355.4330+19140.2993*T2,Jupiter:34.3515+3034.9057*T2,Saturn:50.0774+1222.1138*T2,Uranus:314.055+428.4677*T2,Neptune:304.349+218.4862*T2,Pluto:238.929+145.2078*T2};
    return Object.entries(R).map(([name,lng]) => { const l=mod360(lng),sign=SIGNS[Math.floor(l/30)],planet=PLANETS.find(p=>p.name===name); let retro=false; if(Y[name]){let d=l-mod360(Y[name]);if(d>180)d-=360;if(d<-180)d+=360;retro=d<0;} return {name,lng:l,sign,degree:l%30,planet,retro}; });
  },
  aspects: (p1,p2) => {
    const f=[],seen=new Set();
    for(const a of p1) for(const b of p2){if(a.name===b.name)continue;let d=Math.abs(a.lng-b.lng);if(d>180)d=360-d;for(const asp of ASPECTS){const orb=Math.abs(d-asp.angle);if(orb<=asp.orb){const k=[a.name,b.name].sort().join("-")+asp.name;if(!seen.has(k)){seen.add(k);f.push({p1:a,p2:b,asp,orb:+orb.toFixed(1),strength:1-orb/asp.orb,exact:+((1-orb/asp.orb)*100).toFixed(0)});}}}}
    return f.sort((a,b)=>b.strength-a.strength);
  },
  moonPhase: pos => {
    const m=pos.find(p=>p.name==="Moon"),s=pos.find(p=>p.name==="Sun"); if(!m||!s)return{name:"?",icon:"🌑",power:0,energy:""};
    const a=mod360(m.lng-s.lng);
    if(a<22.5)return{name:"New Moon",icon:"🌑",power:8,energy:"Set intentions. Plant seeds. Begin."};
    if(a<67.5)return{name:"Waxing Crescent",icon:"🌒",power:6,energy:"Building momentum. Take first steps."};
    if(a<112.5)return{name:"First Quarter",icon:"🌓",power:5,energy:"Decision point. Commit or pivot."};
    if(a<157.5)return{name:"Waxing Gibbous",icon:"🌔",power:7,energy:"Refine and push. Almost peak."};
    if(a<202.5)return{name:"Full Moon",icon:"🌕",power:9,energy:"Culmination. Harvest. Heightened emotion."};
    if(a<247.5)return{name:"Waning Gibbous",icon:"🌖",power:4,energy:"Gratitude. Share. Distribute."};
    if(a<292.5)return{name:"Last Quarter",icon:"🌗",power:3,energy:"Release. Let go. Forgive."};
    return{name:"Balsamic Moon",icon:"🌘",power:2,energy:"Rest. Surrender. Prepare for renewal."};
  },
  voc: pos => { const m=pos.find(p=>p.name==="Moon"); if(!m||m.degree<=27)return false; return !pos.some(p=>{if(p.name==="Moon")return false;let d=Math.abs(m.lng-p.lng);if(d>180)d=360-d;return ASPECTS.some(a=>Math.abs(d-a.angle)<=a.orb*0.4);}); },
  scoreDomain: (dom,natal,transit,date) => {
    const aspects=Eng.aspects(transit,natal);
    const rel=aspects.filter(a=>dom.rulers.includes(a.p1.name)||dom.rulers.includes(a.p2.name));
    let score=0; const signals=[];
    rel.forEach(a=>{let imp=a.strength*a.asp.power;const ben=["Venus","Jupiter","Sun"].includes(a.p1.name);if(["flow","opportunity","fusion"].includes(a.asp.nature)){if(ben)imp*=1.5;score+=imp;signals.push({text:`${a.p1.planet?.sym} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:+imp.toFixed(1),type:"green",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — supports action (${a.exact}% exact)`});}else{if(["Saturn","Mars","Pluto"].includes(a.p1.name))imp*=1.4;score-=imp;signals.push({text:`${a.p1.planet?.sym} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:-imp.toFixed(1),type:"red",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — caution advised (${a.exact}% exact)`});}});
    transit.filter(p=>p.retro&&dom.rulers.includes(p.name)).forEach(p=>{const pen=p.name==="Mercury"?-8:p.name==="Venus"?-6:p.name==="Mars"?-7:-4;score+=pen;signals.push({text:`${p.planet?.sym} ${p.name} RETROGRADE in ${p.sign.name}`,val:pen,type:"warning",conf:8,detail:p.name==="Mercury"?"Avoid signing — miscommunication risk high":p.name==="Venus"?"Re-evaluate, don't commit to new":p.name==="Mars"?"Frustrated energy — action may backfire":"Deep review phase, not initiation"});});
    const mp=Eng.moonPhase(transit),waxing=["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous"].includes(mp.name);
    if(["career","contracts","creative","learning"].includes(dom.id)){if(waxing){score+=4;signals.push({text:`${mp.icon} ${mp.name} — Waxing Phase`,val:4,type:"green",conf:6,detail:"Building energy supports new initiatives"});}else{score-=3;signals.push({text:`${mp.icon} ${mp.name} — Waning Phase`,val:-3,type:"caution",conf:5,detail:"Releasing phase — better for completing than starting"});}}
    if(dom.id==="spiritual"&&["Full Moon","Waning Gibbous","Last Quarter"].includes(mp.name)){score+=5;signals.push({text:`${mp.icon} ${mp.name} supports inner work`,val:5,type:"green",conf:7,detail:"Heightened awareness for reflection"});}
    if(dom.id==="love"&&mp.name==="Full Moon"){score+=4;signals.push({text:`${mp.icon} Full Moon — emotional peak`,val:4,type:"green",conf:7,detail:"Feelings surface — powerful for honest connection"});}
    if(Eng.voc(transit)){score-=6;signals.push({text:"🚫 Void of Course Moon",val:-6,type:"warning",conf:7,detail:"Actions started now tend to fizzle — wait if possible"});}
    const hrs=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"],dayR=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"][date.getDay()],hR=hrs[(hrs.indexOf(dayR)+date.getHours())%7];
    if(dom.rulers.includes(hR)){score+=3;signals.push({text:`⏰ Planetary Hour of ${hR} — aligned`,val:3,type:"green",conf:4,detail:`Current hour ruled by ${hR}`});}
    const norm=Math.max(-100,Math.min(100,score*2.5));
    const confidence=Math.min(9,Math.max(2,Math.round((Math.abs(norm)/100)*6+signals.length*0.4+2)));
    const gn=signals.filter(s=>s.type==="green").length,rd=signals.filter(s=>s.type==="red"||s.type==="warning"||s.type==="caution").length;
    const convergence=gn+rd?Math.round(Math.max(gn,rd)/(gn+rd)*100):50;
    return{score:norm,signals:signals.sort((a,b)=>Math.abs(b.val)-Math.abs(a.val)),confidence,convergence,greenCount:gn,redCount:rd,totalSignals:signals.length};
  },
};

// --- STYLING ---
const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",blu:"#38d6f5",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};
const vColor=s=>s>30?CL.grn:s>10?"#7ddba3":s>-10?CL.acc:s>-30?"#e5a0a0":CL.red;
const vText=s=>s>40?"EXCELLENT — Act with high confidence":s>20?"FAVORABLE — Conditions support action":s>5?"LEANING POSITIVE — Proceed with awareness":s>-5?"NEUTRAL — Mixed signals, use judgment":s>-20?"LEANING CHALLENGING — Extra caution recommended":s>-40?"CHALLENGING — Seriously consider postponing":"AVOID — Strong signals against action today";
const confText=c=>c>=8?"Very High":c>=6?"High":c>=4?"Moderate":"Low";
const fmtD=d=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fmtDL=d=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

// --- BULLET COMPONENT (Oracle-style) ---
const Bullet = ({children,color,conf,val,strong}) => (
  <div style={{display:"flex",gap:8,padding:"6px 0",borderBottom:`1px solid ${CL.bdr}40`,alignItems:"flex-start"}}>
    <span style={{color:color||CL.txt,fontSize:14,marginTop:1}}>•</span>
    <div style={{flex:1,fontSize:12.5,lineHeight:1.65,fontFamily:"system-ui",color:CL.txt}}>
      {strong?<b style={{color:color||CL.txt}}>{strong}</b>:null}
      {strong?" — ":""}{children}
      {conf!==undefined&&<span style={{color:CL.dim,fontStyle:"italic"}}> Confidence: {conf}/10</span>}
      {val!==undefined&&<span style={{marginLeft:6,fontWeight:700,color:+val>0?CL.grn:CL.red}}>({+val>0?"+":""}{val})</span>}
    </div>
  </div>
);

// ============ MAIN ============
export default function OraclePersonalV3() {
  const [dob,setDob]=useState("");
  const [targetDate,setTargetDate]=useState(new Date().toISOString().split("T")[0]);
  const [tab,setTab]=useState("reading");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState(null);

  const compute=useCallback(()=>{
    if(!dob)return;setLoading(true);
    setTimeout(()=>{
      const bDate=new Date(dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
      const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
      const allAspects=Eng.aspects(transit,natal);
      const mp=Eng.moonPhase(transit),voc=Eng.voc(transit);
      const retros=transit.filter(p=>p.retro);
      const sunSign=natal.find(p=>p.name==="Sun").sign;
      const moonSign=natal.find(p=>p.name==="Moon").sign;
      const elements={fire:0,earth:0,air:0,water:0};natal.forEach(p=>{if(p.sign)elements[p.sign.el]++;});
      const domains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate)})).sort((a,b)=>b.score-a.score);
      const overall=domains.reduce((s,d)=>s+d.score,0)/domains.length;
      const overallConf=Math.round(domains.reduce((s,d)=>s+d.confidence,0)/domains.length);
      const totalGreen=domains.reduce((s,d)=>s+d.greenCount,0);
      const totalRed=domains.reduce((s,d)=>s+d.redCount,0);
      const overallConv=totalGreen+totalRed?Math.round(Math.max(totalGreen,totalRed)/(totalGreen+totalRed)*100):50;
      // 30-day
      const forecast=[];
      for(let i=0;i<30;i++){const d=new Date(tDate);d.setDate(d.getDate()+i);const dt=Eng.pos(d);const ds=DOMAINS.map(dm=>({...dm,...Eng.scoreDomain(dm,natal,dt,d)}));const avg=ds.reduce((s,x)=>s+x.score,0)/ds.length;const best=ds.reduce((b,x)=>x.score>b.score?x:b,ds[0]);const worst=ds.reduce((b,x)=>x.score<b.score?x:b,ds[0]);forecast.push({date:d,overall:avg,best,worst,moonPhase:Eng.moonPhase(dt),domains:ds});}
      const bestDays=DOMAINS.map((dom,di)=>{const sorted=[...forecast].sort((a,b)=>b.domains[di].score-a.domains[di].score);return{domain:dom,top3:sorted.slice(0,3).map(f=>({date:f.date,score:f.domains[di].score,conf:f.domains[di].confidence})),bottom3:sorted.slice(-3).reverse().map(f=>({date:f.date,score:f.domains[di].score}))};});
      setData({natal,transit,allAspects,mp,voc,retros,sunSign,moonSign,elements,domains,overall,overallConf,overallConv,totalGreen,totalRed,forecast,bestDays});
      setLoading(false);
    },500);
  },[dob,targetDate]);

  useEffect(()=>{if(dob)compute();},[dob,targetDate]);

  const SC={card:{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}};
  const TB=({id,label,icon})=><button onClick={()=>setTab(id)} style={{background:tab===id?CL.acc:"transparent",color:tab===id?"#000":CL.dim,border:`1px solid ${tab===id?CL.acc:CL.bdr}`,borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>{icon} {label}</button>;

  // Section header (like "## SECTION — SUBTITLE")
  const SH=({icon,title,sub,color})=>(
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,letterSpacing:3,color:color||CL.acc,fontWeight:700,fontFamily:"system-ui"}}>{icon}</div>
      <div style={{fontSize:16,fontWeight:800,color:CL.txt,fontFamily:"system-ui",marginTop:2}}>{title}</div>
      {sub&&<div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui"}}>{sub}</div>}
    </div>
  );

  // Horizontal divider
  const HR=()=><div style={{height:1,background:CL.bdr,margin:"14px 0"}}/>;

  return (
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"'Georgia','Palatino',serif",padding:"10px 14px",maxWidth:720,margin:"0 auto"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{text-shadow:0 0 15px #f6ad3c44}50%{text-shadow:0 0 30px #f6ad3c88,0 0 60px #9b7fe644}}input[type="date"]{font-family:inherit}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}*{box-sizing:border-box}`}</style>

      {/* HEADER */}
      <div style={{textAlign:"center",padding:"18px 0 10px"}}>
        <div style={{fontSize:10,letterSpacing:6,color:CL.pur,fontWeight:700,fontFamily:"system-ui"}}>ORACLE v3</div>
        <h1 style={{fontSize:24,fontWeight:400,margin:"4px 0",fontStyle:"italic",background:`linear-gradient(135deg,${CL.acc},${CL.pnk},${CL.pur})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 5s ease infinite"}}>Personal Decision Oracle</h1>
        <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>Framework: Oracle v3 Predictive Analysis · Classification: PERSONAL GUIDANCE</div>
      </div>

      {/* DOB INPUT */}
      <div style={{...SC.card,background:`linear-gradient(160deg,${CL.card},#120e24)`,borderColor:CL.pur+"50"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:1,minWidth:140}}>
            <label style={{fontSize:9,color:CL.dim,display:"block",marginBottom:3,fontFamily:"system-ui",letterSpacing:1}}>DATE OF BIRTH</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{width:"100%",padding:"10px 12px",background:CL.card2,border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:15}}/>
          </div>
          <div style={{flex:1,minWidth:140}}>
            <label style={{fontSize:9,color:CL.dim,display:"block",marginBottom:3,fontFamily:"system-ui",letterSpacing:1}}>DATE TO ANALYZE</label>
            <input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} style={{width:"100%",padding:"10px 12px",background:CL.card2,border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:15}}/>
          </div>
          <button onClick={compute} disabled={!dob||loading} style={{background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:10,padding:"11px 24px",fontSize:12,fontWeight:800,cursor:!dob?"not-allowed":"pointer",opacity:!dob?0.4:1,fontFamily:"system-ui",letterSpacing:1}}>{loading?"✨ Computing...":"🔮 Consult Oracle"}</button>
        </div>
      </div>

      {data&&(<>
        {/* TABS */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",marginBottom:10}}>
          <TB id="reading" label="Full Reading" icon="🔮"/>
          <TB id="shouldi" label="Should I...?" icon="🤔"/>
          <TB id="calendar" label="30-Day" icon="📅"/>
          <TB id="bestdays" label="Best Days" icon="⭐"/>
          <TB id="chart" label="Chart" icon="🌌"/>
        </div>

        {/* ========================================= */}
        {/*           FULL READING TAB                */}
        {/* ========================================= */}
        {tab==="reading"&&(<>

          {/* SITUATION ASSESSMENT */}
          <div style={SC.card}>
            <SH icon="📊" title="SITUATION ASSESSMENT" sub={`Personal Reading for ${fmtDL(new Date(targetDate))}`}/>
            <Bullet strong={`${data.sunSign.sym} Sun in ${data.sunSign.name}`}>Your core identity and purpose — {data.sunSign.trait.toLowerCase()}</Bullet>
            <Bullet strong={`${data.moonSign.sym} Moon in ${data.moonSign.name}`}>Your emotional nature and instinct patterns</Bullet>
            <Bullet strong={`${data.mp.icon} ${data.mp.name}`}>{data.mp.energy}</Bullet>
            {data.voc&&<Bullet strong="🚫 Void of Course Moon" color={CL.red}>Actions started now tend to not go as planned. Delay important decisions if possible.</Bullet>}
            {data.retros.map(r=><Bullet key={r.name} strong={`${r.planet?.sym} ${r.name} Retrograde in ${r.sign.name}`} color={CL.acc}>{r.name==="Mercury"?"Contracts, communication, and travel are disrupted — avoid signing, double-check everything":r.name==="Venus"?"Values and relationships under review — not ideal for new commitments":r.name==="Mars"?"Action is frustrated, delays likely — don't force outcomes":"Deep review energy, not initiation energy"}</Bullet>)}
            <Bullet strong="Elemental Balance">🔥 Fire: {data.elements.fire} · 🌍 Earth: {data.elements.earth} · 💨 Air: {data.elements.air} · 💧 Water: {data.elements.water}</Bullet>
          </div>

          {/* OVERALL VERDICT — big numbers, Oracle style */}
          <div style={{...SC.card,background:`linear-gradient(150deg,${CL.card},${data.overall>15?"#0d1a10":data.overall<-15?"#1a0d0d":"#1a1708"})`}}>
            <SH icon="🎯" title="OVERALL VERDICT" color={vColor(data.overall)}/>
            <div style={{fontSize:15,color:vColor(data.overall),fontWeight:600,fontFamily:"system-ui",marginBottom:14}}>{vText(data.overall)}</div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
              {[
                {label:"OVERALL SCORE",value:`${data.overall>0?"+":""}${data.overall.toFixed(0)}`,color:vColor(data.overall),sub:"Weighted average across all 9 life domains"},
                {label:"CONFIDENCE",value:`${data.overallConf}/10`,color:CL.acc,sub:confText(data.overallConf)+" — based on signal strength and count"},
                {label:"CONVERGENCE",value:`${data.overallConv}%`,color:data.overallConv>70?CL.grn:data.overallConv>55?CL.acc:CL.red,sub:data.overallConv>70?"Strong agreement across signals":"Signals are mixed — proceed with nuance"},
                {label:"SIGNAL BALANCE",value:`▲${data.totalGreen} / ▼${data.totalRed}`,color:data.totalGreen>data.totalRed?CL.grn:CL.red,sub:`${data.totalGreen} supportive vs ${data.totalRed} challenging signals`},
              ].map(m=>(
                <div key={m.label} style={{background:CL.card2,borderRadius:10,padding:12,borderTop:`2px solid ${m.color}`}}>
                  <div style={{fontSize:8,letterSpacing:2,color:CL.dim,fontFamily:"system-ui",fontWeight:700}}>{m.label}</div>
                  <div style={{fontSize:24,fontWeight:900,color:m.color,fontFamily:"system-ui",margin:"4px 0"}}>{m.value}</div>
                  <div style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",lineHeight:1.4}}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DOMAIN-BY-DOMAIN — like the Scenario blocks */}
          <div style={SC.card}>
            <SH icon="📋" title="DOMAIN-BY-DOMAIN ANALYSIS" sub="Ranked by score — tap any domain for full signal breakdown"/>
            {data.domains.map((d,i)=>(
              <div key={d.id} onClick={()=>setExpanded(expanded===d.id?null:d.id)} style={{background:CL.card2,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",borderLeft:`4px solid ${vColor(d.score)}`,transition:"all 0.2s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:"system-ui"}}>{d.icon} {d.name}</div>
                    <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:1}}>{d.sub}</div>
                  </div>
                  <div style={{textAlign:"right",fontFamily:"system-ui"}}>
                    <div style={{fontSize:26,fontWeight:900,color:vColor(d.score),lineHeight:1}}>{d.score>0?"+":""}{d.score.toFixed(0)}</div>
                  </div>
                </div>
                {/* Confidence bar — Oracle format */}
                <div style={{display:"flex",gap:14,marginTop:8,flexWrap:"wrap",fontFamily:"system-ui",fontSize:11,color:CL.dim}}>
                  <span>Confidence: <b style={{color:CL.acc}}>{d.confidence}/10</b> <span style={{fontStyle:"italic"}}>({confText(d.confidence)})</span></span>
                  <span>Convergence: <b style={{color:d.convergence>65?CL.grn:d.convergence>50?CL.acc:CL.red}}>{d.convergence}%</b></span>
                  <span>Signals: <b style={{color:CL.grn}}>▲{d.greenCount}</b> supportive / <b style={{color:CL.red}}>▼{d.redCount}</b> challenging</span>
                </div>
                {/* EXPANDED: Signal-by-signal breakdown */}
                {expanded===d.id&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${CL.bdr}`,animation:"fadeUp 0.3s ease"}}>
                    <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,fontFamily:"system-ui",marginBottom:6}}>SIGNAL BREAKDOWN</div>
                    {d.signals.map((s,j)=>(
                      <Bullet key={j} strong={s.text} color={s.type==="green"?CL.grn:s.type==="red"||s.type==="warning"?CL.red:CL.acc} conf={s.conf} val={s.val}>{s.detail}</Bullet>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CROSS-DOMAIN THEMES — exactly like "LIKELY WINNERS / LOSERS" */}
          <div style={SC.card}>
            <SH icon="🔗" title="CROSS-DOMAIN CONVERGENCE THEMES" sub="High-confidence directional calls that hold across multiple domains"/>
            <HR/>
            <div style={{fontSize:13,fontWeight:800,color:CL.grn,fontFamily:"system-ui",marginBottom:6}}>🟢 STRONGEST DOMAINS (Favorable for Action)</div>
            {data.domains.filter(d=>d.score>5).length>0?data.domains.filter(d=>d.score>5).map((d,i)=>(
              <Bullet key={d.id} strong={`${d.icon} ${d.name}`} color={CL.grn} conf={d.confidence}>{d.score>30?"Strongly supported":"Supported"} — {d.greenCount} positive signals, {d.convergence}% convergence. {d.signals.filter(s=>s.type==="green")[0]?.text||""}</Bullet>
            )):<Bullet color={CL.dim}>No domains show strongly favorable conditions today.</Bullet>}

            <div style={{height:10}}/>
            <div style={{fontSize:13,fontWeight:800,color:CL.red,fontFamily:"system-ui",marginBottom:6}}>🔴 WEAKEST DOMAINS (Caution / Avoid)</div>
            {data.domains.filter(d=>d.score<-5).length>0?data.domains.filter(d=>d.score<-5).sort((a,b)=>a.score-b.score).map((d,i)=>(
              <Bullet key={d.id} strong={`${d.icon} ${d.name}`} color={CL.red} conf={d.confidence}>{d.score<-30?"Strongly unfavorable":"Challenging"} — {d.redCount} caution signals, {d.convergence}% convergence. {d.signals.filter(s=>s.type==="red"||s.type==="warning")[0]?.text||""}</Bullet>
            )):<Bullet color={CL.dim}>No domains show strongly unfavorable conditions today.</Bullet>}
          </div>

          {/* KEY WATCHPOINTS — numbered list, bold + em-dash */}
          <div style={SC.card}>
            <SH icon="👁️" title="KEY WATCHPOINTS TODAY" sub="Factors that will shape how this day unfolds for you"/>
            {[
              ...(data.retros.length>0?[`${data.retros.map(r=>`**${r.name}**`).join(", ")} retrograde — ${data.retros.some(r=>r.name==="Mercury")?"contracts and communication especially disrupted. Double-check EVERYTHING before signing.":"action and initiative are sluggish. Review rather than initiate."}`]:[]),
              `**Moon Phase: ${data.mp.name}** — ${data.mp.energy} Power level: ${data.mp.power}/10`,
              ...(data.voc?["**Void of Course Moon** — Actions initiated now tend to fail or fizzle. If you can wait, wait."]:["**Moon is making aspects** — Active lunar energy supports decisions taken today."]),
              `**Element dominance: ${Object.entries(data.elements).sort((a,b)=>b[1]-a[1])[0][0]}** — Your natal chart leans ${Object.entries(data.elements).sort((a,b)=>b[1]-a[1])[0][0]}, coloring how you process today's energy`,
              `**${data.allAspects.length} active transit aspects** to your natal chart — ${data.allAspects.length>15?"Very busy sky, lots of activation":"Moderate activation level"}`,
              `**Strongest aspect:** ${data.allAspects[0]?`${data.allAspects[0].p1.name} ${data.allAspects[0].asp.name} ${data.allAspects[0].p2.name} (${data.allAspects[0].exact}% exact)`:"None"}`,
            ].map((wp,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${CL.bdr}33`,fontFamily:"system-ui",fontSize:12,lineHeight:1.6,color:CL.txt}}>
                <span style={{color:CL.acc,fontWeight:800,minWidth:18}}>{i+1}.</span>
                <span dangerouslySetInnerHTML={{__html:wp.replace(/\*\*(.*?)\*\*/g,`<b style="color:${CL.acc}">$1</b>`)}}/>
              </div>
            ))}
          </div>

          {/* ORACLE SELF-ASSESSMENT — the signature closer */}
          <div style={{...SC.card,borderColor:CL.pur+"30"}}>
            <SH icon="🔮" title="ORACLE SELF-ASSESSMENT" color={CL.pur}/>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:800,color:CL.grn,fontFamily:"system-ui",marginBottom:6}}>What I'm most confident about:</div>
              {data.domains.filter(d=>d.confidence>=6).slice(0,4).map(d=>(
                <Bullet key={d.id} color={CL.grn}>{d.icon} {d.name} is {d.score>0?"favorable":"challenging"} today ({d.confidence}/10) — {d.convergence}% signal convergence with {d.totalSignals} active signals</Bullet>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:800,color:CL.red,fontFamily:"system-ui",marginBottom:6}}>What I'm least confident about:</div>
              {data.domains.filter(d=>d.confidence<=5).length>0?data.domains.filter(d=>d.confidence<=5).slice(0,3).map(d=>(
                <Bullet key={d.id} color={CL.dim}>{d.icon} {d.name} — Mixed or weak signals ({d.confidence}/10), only {d.convergence}% convergence. Could go either way.</Bullet>
              )):<Bullet color={CL.dim}>All domains show moderate-to-high confidence today — unusual clarity.</Bullet>}
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:CL.acc,fontFamily:"system-ui",marginBottom:6}}>Biggest risks to this reading:</div>
              <Bullet color={CL.acc}>This reading uses simplified orbital calculations — exact planetary positions may differ by 1-2° from ephemeris data</Bullet>
              <Bullet color={CL.acc}>Birth time unknown — Rising sign and house placements are approximated from Sun position</Bullet>
              <Bullet color={CL.acc}>Free will overrides all cosmic signals — these are inclinations, not determinations</Bullet>
              {data.retros.length>0&&<Bullet color={CL.acc}>{data.retros.map(r=>r.name).join("/")} retrograde adds unpredictability — plans may shift unexpectedly</Bullet>}
            </div>
          </div>

          {/* FOOTER */}
          <div style={{textAlign:"center",padding:"10px 16px",fontSize:10,color:CL.mut,fontFamily:"system-ui",lineHeight:1.6}}>
            <i>Generated by Oracle v3 Personal Decision Framework</i><br/>
            <i>Reading is unique to your birth date — another person sees entirely different scores</i><br/>
            <i>"The stars incline, they do not compel."</i>
          </div>
        </>)}

        {/* ====== SHOULD I ====== */}
        {tab==="shouldi"&&(
          <div style={SC.card}>
            <SH icon="🤔" title="SHOULD I...?" sub={`Personal Decision Guide — ${fmtDL(new Date(targetDate))}`}/>
            {QUICK_QS.map(qd=>{
              const d=data.domains.find(x=>x.id===qd.dom);
              const answer=d.score>30?"YES — Strong cosmic support. Confidence "+d.confidence+"/10":d.score>10?"Likely YES — Favorable conditions. Confidence "+d.confidence+"/10":d.score>-10?"MIXED — Proceed with awareness. Confidence "+d.confidence+"/10":d.score>-30?"Probably NOT — Consider waiting. Confidence "+d.confidence+"/10":"NO — Strong signals against. Confidence "+d.confidence+"/10";
              return(
                <div key={qd.q} style={{background:CL.card2,borderRadius:12,padding:16,marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:16,fontWeight:700,fontFamily:"system-ui"}}>{qd.icon} {qd.q}</div>
                    <div style={{textAlign:"right",fontFamily:"system-ui"}}>
                      <div style={{fontSize:24,fontWeight:900,color:vColor(d.score)}}>{d.score>0?"+":""}{d.score.toFixed(0)}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:vColor(d.score),fontStyle:"italic",margin:"6px 0",fontFamily:"system-ui"}}>{answer}</div>
                  <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>Convergence: <b>{d.convergence}%</b> · Signals: <b style={{color:CL.grn}}>▲{d.greenCount}</b> / <b style={{color:CL.red}}>▼{d.redCount}</b></div>
                  <HR/>
                  {d.signals.slice(0,3).map((s,j)=>(
                    <Bullet key={j} strong={s.text} color={s.type==="green"?CL.grn:CL.red} conf={s.conf} val={s.val}>{s.detail}</Bullet>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ====== CALENDAR ====== */}
        {tab==="calendar"&&(
          <div style={SC.card}>
            <SH icon="📅" title="30-DAY PERSONAL COSMIC MAP" sub="Your unique energy landscape for the month ahead"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:12}}>
              {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:8,color:CL.dim,fontFamily:"system-ui",fontWeight:700}}>{d}</div>)}
              {Array.from({length:data.forecast[0].date.getDay()}).map((_,i)=><div key={"e"+i}/>)}
              {data.forecast.map((day,i)=>{
                const bg=vColor(day.overall);
                return(<div key={i} onClick={()=>{setTargetDate(day.date.toISOString().split("T")[0]);setTab("reading");}} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:8,cursor:"pointer",background:bg+"15",border:i===0?`2px solid ${CL.acc}`:`1px solid ${bg}20`}}>
                  <div style={{fontSize:11,fontWeight:i===0?800:500,fontFamily:"system-ui"}}>{day.date.getDate()}</div>
                  <div style={{fontSize:7,fontWeight:700,color:bg,fontFamily:"system-ui"}}>{day.overall>0?"+":""}{day.overall.toFixed(0)}</div>
                  <div style={{fontSize:7}}>{day.moonPhase.icon}</div>
                </div>);
              })}
            </div>
            {/* Daily detail */}
            <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>DAILY BREAKDOWN (14 days)</div>
            {data.forecast.slice(0,14).map((day,i)=>(
              <div key={i} onClick={()=>{setTargetDate(day.date.toISOString().split("T")[0]);setTab("reading");}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:i%2?"transparent":CL.card2,borderRadius:6,cursor:"pointer",marginBottom:2,fontFamily:"system-ui",fontSize:11}}>
                <div style={{minWidth:85,fontWeight:i===0?700:400,color:i===0?CL.acc:CL.txt}}>{fmtD(day.date)}{i===0?" ★":""}</div>
                <div style={{flex:1}}>
                  <div style={{height:5,background:CL.bdr,borderRadius:3,overflow:"hidden",position:"relative"}}>
                    <div style={{position:"absolute",left:"50%",width:1,height:"100%",background:CL.mut}}/>
                    <div style={{position:"absolute",left:day.overall>0?"50%":`${50+day.overall/2}%`,width:`${Math.abs(day.overall/2)}%`,height:"100%",background:vColor(day.overall),borderRadius:3}}/>
                  </div>
                </div>
                <span style={{fontSize:9}}>{day.moonPhase.icon}</span>
                <span style={{fontSize:9,color:CL.dim,minWidth:35}}>Best:{day.best.icon}</span>
                <span style={{fontSize:13,fontWeight:800,minWidth:38,textAlign:"right",color:vColor(day.overall)}}>{day.overall>0?"+":""}{day.overall.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}

        {/* ====== BEST DAYS ====== */}
        {tab==="bestdays"&&(
          <div style={SC.card}>
            <SH icon="⭐" title="OPTIMAL TIMING — Best & Worst Windows" sub="Next 30 days by domain — tap any day to read full analysis"/>
            {data.bestDays.map(bd=>(
              <div key={bd.domain.id} style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:8}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui",marginBottom:8}}>{bd.domain.icon} {bd.domain.name}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:CL.grn,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🟢 BEST WINDOWS</div>
                    {bd.top3.map((d,i)=>(<div key={i} onClick={()=>{setTargetDate(d.date.toISOString().split("T")[0]);setTab("reading");}} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:CL.grn+"0d",borderRadius:6,marginBottom:3,cursor:"pointer",fontFamily:"system-ui",fontSize:11}}>
                      <span>{fmtD(d.date)}</span>
                      <span style={{fontWeight:800,color:CL.grn}}>+{d.score.toFixed(0)} · {d.conf}/10</span>
                    </div>))}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:CL.red,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🔴 AVOID</div>
                    {bd.bottom3.map((d,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:CL.red+"0d",borderRadius:6,marginBottom:3,fontFamily:"system-ui",fontSize:11}}>
                      <span>{fmtD(d.date)}</span>
                      <span style={{fontWeight:800,color:CL.red}}>{d.score.toFixed(0)}</span>
                    </div>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== CHART ====== */}
        {tab==="chart"&&(
          <div style={SC.card}>
            <SH icon="🌌" title="NATAL CHART + CURRENT TRANSITS"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {["Natal","Transit"].map(type=>(
                <div key={type}>
                  <div style={{fontSize:10,color:type==="Natal"?CL.acc:CL.pur,letterSpacing:2,fontWeight:700,marginBottom:4,fontFamily:"system-ui"}}>{type.toUpperCase()} POSITIONS</div>
                  {(type==="Natal"?data.natal:data.transit).map(p=>(
                    <div key={p.name} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:11,background:CL.card2,borderRadius:5,marginBottom:2,fontFamily:"system-ui"}}>
                      <span style={{color:p.planet?.c}}>{p.planet?.sym} {p.name}{p.retro?" ℞":""}</span>
                      <span style={{color:p.sign.c}}>{p.sign.sym} {p.degree.toFixed(1)}° {p.sign.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <HR/>
            <div style={{fontSize:10,letterSpacing:2,color:CL.pnk,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>TOP TRANSIT ASPECTS TO YOUR CHART</div>
            {data.allAspects.slice(0,12).map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",background:i%2?"transparent":CL.card2,borderRadius:5,fontSize:11,fontFamily:"system-ui"}}>
                <span style={{fontSize:15,color:a.asp.c,minWidth:18}}>{a.asp.sym}</span>
                <span style={{flex:1}}><span style={{color:a.p1.planet?.c,fontWeight:600}}>{a.p1.name}</span> <span style={{color:CL.dim}}>{a.asp.name}</span> <span style={{color:a.p2.planet?.c,fontWeight:600}}>{a.p2.name}</span></span>
                <span style={{fontSize:9,color:CL.dim}}>{a.asp.nature}</span>
                <span style={{fontWeight:800,color:a.asp.c,minWidth:30,textAlign:"right"}}>{a.exact}%</span>
                <span style={{fontSize:9,color:CL.dim}}>exact</span>
              </div>
            ))}
          </div>
        )}
      </>)}
    </div>
  );
}
// Nav wrapper - adds back button for site context
export function OracleWithNav() {
  return (
    <>
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,6,13,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,27,58,0.6)"}}>
        <a href="/" style={{display:"flex",alignItems:"baseline",gap:2,textDecoration:"none"}}>
          <span style={{fontSize:9,color:"#6b6580",fontFamily:"Syncopate,sans-serif",fontWeight:700,letterSpacing:2}}>my</span>
          <span style={{fontSize:14,fontFamily:"Syncopate,sans-serif",fontWeight:700,letterSpacing:3,color:"#e8e4f0"}}>ORACLE</span>
        </a>
        <div style={{fontSize:9,color:"#6b6580",fontFamily:"Syncopate,sans-serif",letterSpacing:2}}>PERSONAL DECISION ENGINE</div>
        <a href="/pricing" style={{fontSize:9,color:"#9b7fe6",fontFamily:"Syncopate,sans-serif",letterSpacing:1,textDecoration:"none",border:"1px solid rgba(155,127,230,0.3)",padding:"6px 14px",borderRadius:8}}>UPGRADE →</a>
      </div>
      <div style={{paddingTop:52}}>
        <OraclePersonalV3 />
      </div>
    </>
  );
}
