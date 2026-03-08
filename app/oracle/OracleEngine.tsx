"use client";
import { useState, useEffect, useCallback } from "react";

const TIER_KEY = "myoracle_tier";

const PLANETS = [
  {name:"Sun",sym:"☉",c:"#f6ad3c"},{name:"Moon",sym:"☽",c:"#c4cdd4"},
  {name:"Mercury",sym:"☿",c:"#45d0c8"},{name:"Venus",sym:"♀",c:"#e879a0"},
  {name:"Mars",sym:"♂",c:"#e55050"},{name:"Jupiter",sym:"♃",c:"#9b7fe6"},
  {name:"Saturn",sym:"♄",c:"#7a8594"},{name:"Uranus",sym:"♅",c:"#38d6f5"},
  {name:"Neptune",sym:"♆",c:"#7c8cf5"},{name:"Pluto",sym:"♇",c:"#b366e0"},
];
const SIGNS = [
  {name:"Aries",sym:"♈",el:"fire",c:"#e55050",trait:"Initiative, courage"},
  {name:"Taurus",sym:"♉",el:"earth",c:"#3dbd7d",trait:"Stability, persistence"},
  {name:"Gemini",sym:"♊",el:"air",c:"#f6c23c",trait:"Curiosity, adaptability"},
  {name:"Cancer",sym:"♋",el:"water",c:"#c4cdd4",trait:"Nurturing, emotional depth"},
  {name:"Leo",sym:"♌",el:"fire",c:"#f6ad3c",trait:"Creativity, self-expression"},
  {name:"Virgo",sym:"♍",el:"earth",c:"#45d0c8",trait:"Analysis, refinement"},
  {name:"Libra",sym:"♎",el:"air",c:"#e879a0",trait:"Balance, harmony"},
  {name:"Scorpio",sym:"♏",el:"water",c:"#b366e0",trait:"Intensity, transformation"},
  {name:"Sagittarius",sym:"♐",el:"fire",c:"#9b7fe6",trait:"Adventure, wisdom"},
  {name:"Capricorn",sym:"♑",el:"earth",c:"#7a8594",trait:"Ambition, mastery"},
  {name:"Aquarius",sym:"♒",el:"air",c:"#38d6f5",trait:"Innovation, freedom"},
  {name:"Pisces",sym:"♓",el:"water",c:"#7c8cf5",trait:"Intuition, compassion"},
];
const ASPECTS = [
  {name:"Conjunction",angle:0,orb:8,sym:"☌",power:10,nature:"fusion",c:"#f6ad3c"},
  {name:"Sextile",angle:60,orb:5,sym:"⚹",power:4,nature:"opportunity",c:"#45d0c8"},
  {name:"Square",angle:90,orb:7,sym:"□",power:8,nature:"tension",c:"#e55050"},
  {name:"Trine",angle:120,orb:7,sym:"△",power:7,nature:"flow",c:"#3dbd7d"},
  {name:"Opposition",angle:180,orb:8,sym:"☍",power:9,nature:"polarity",c:"#e879a0"},
];
const DOMAINS = [
  {id:"career",name:"Career & Business",icon:"💼",rulers:["Sun","Saturn","Jupiter","Mars"],sub:"Launches, promotions, ventures, job changes"},
  {id:"love",name:"Love & Relationships",icon:"💕",rulers:["Venus","Moon","Jupiter"],sub:"Commitments, proposals, difficult conversations"},
  {id:"contracts",name:"Contracts & Signing",icon:"📜",rulers:["Mercury","Jupiter","Saturn"],sub:"Legal filings, negotiations, agreements"},
  {id:"travel",name:"Travel & Relocation",icon:"✈️",rulers:["Mercury","Jupiter","Moon"],sub:"Moving, big journeys, relocation"},
  {id:"health",name:"Health & Body",icon:"🌿",rulers:["Mars","Sun","Moon"],sub:"Surgery timing, new regimens, recovery"},
  {id:"creative",name:"Creative Projects",icon:"🎨",rulers:["Venus","Neptune","Sun","Mercury"],sub:"Art, writing, launches, performances"},
  {id:"learning",name:"Learning & Growth",icon:"📚",rulers:["Mercury","Jupiter","Saturn"],sub:"Courses, exams, certifications"},
  {id:"spiritual",name:"Spiritual & Inner Work",icon:"🧘",rulers:["Neptune","Moon","Pluto"],sub:"Retreats, therapy, meditation, healing"},
  {id:"financial",name:"Major Purchases",icon:"💰",rulers:["Venus","Jupiter","Saturn","Pluto"],sub:"Property, investments, salary negotiations"},
];

const TIERS = [
  {id:1,name:"Basic",price:"$9.99",color:"#6b6580",desc:"Surface readings across all domains"},
  {id:2,name:"Plus",price:"$29.99",color:"#9b7fe6",desc:"Deep dive into your 3 chosen domains"},
  {id:3,name:"Pro",price:"$79.99",color:"#f6ad3c",desc:"Full analysis — all 9 domains in detail"},
  {id:4,name:"Pro+",price:"$99.99",color:"#e879a0",desc:"Premium readings + Team mode"},
];

// ─── LANGUAGE ENGINE ────────────────────────────────────────────────────────
// Same data, different quality of expression per tier

function getDomainVerdict(score:number, domName:string, tier:number, signals:any[], mp:any, retros:any[]):string {
  const positive = score > 10;
  const negative = score < -10;
  const neutral = !positive && !negative;
  const topSignal = signals[0];
  const retroNames = retros.map((r:any)=>r.name);

  if(tier === 1) {
    // Short, simple, direct
    if(score > 30) return `Good conditions for ${domName.toLowerCase()} today. Act with confidence.`;
    if(score > 10) return `Fairly supportive for ${domName.toLowerCase()}. Proceed thoughtfully.`;
    if(score > -10) return `Mixed signals for ${domName.toLowerCase()}. Use your own judgment.`;
    if(score > -30) return `Not the strongest day for ${domName.toLowerCase()}. Consider waiting.`;
    return `Avoid major ${domName.toLowerCase()} decisions today if possible.`;
  }

  if(tier === 2) {
    // 2-3 sentences with basic planetary context
    const moonNote = mp.name === "Full Moon" ? "The Full Moon heightens emotions and outcomes." : mp.name === "New Moon" ? "The New Moon supports fresh starts." : "";
    const retroNote = retroNames.includes("Mercury") && ["Contracts & Signing","Learning & Growth"].some(d=>d===domName) ? " Mercury retrograde adds communication risk — double-check everything." : "";
    if(score > 30) return `The planetary weather strongly supports ${domName.toLowerCase()} right now. ${topSignal ? `${topSignal.text} is the key driver.` : ""} ${moonNote}${retroNote} Move forward with intention.`;
    if(score > 10) return `Conditions lean in your favour for ${domName.toLowerCase()}. ${moonNote}${retroNote} There's positive momentum — act while it holds.`;
    if(score > -10) return `Signals are split for ${domName.toLowerCase()}. ${moonNote}${retroNote} If this decision can wait, a clearer window may be coming.`;
    if(score > -30) return `The sky isn't cooperating for ${domName.toLowerCase()} today. ${retroNote || moonNote} Patience is the wisest move.`;
    return `Strong indicators against major ${domName.toLowerCase()} actions now.${retroNote} Delay if at all possible — timing matters here.`;
  }

  if(tier === 3) {
    // Rich, detailed, planetary narrative
    const mainPlanet = topSignal?.text || "";
    const moonPhase = mp.name;
    const retroStr = retroNames.length > 0 ? `${retroNames.join(" and ")} ${retroNames.length > 1 ? "are" : "is"} retrograde, creating a review and reflection energy in the background.` : "No major planets are retrograde, lending clarity to forward movement.";
    if(score > 30) return `This is one of the stronger windows for ${domName.toLowerCase()} in recent weeks. The planetary alignment — particularly ${mainPlanet} — creates a channel of genuine support. The ${moonPhase} adds ${moonPhase.includes("Full")?"emotional peak energy and visibility":"building momentum"}. ${retroStr} If you've been waiting for the right moment, this reads as close to it. Commit with awareness, and trust your preparation.`;
    if(score > 10) return `The cosmic conditions are leaning favourably for ${domName.toLowerCase()}. ${mainPlanet} is the primary positive influence, offering ${topSignal?.detail||"supportive energy"}. The ${moonPhase} sets a ${moonPhase.includes("Wax")?"building, forward-moving":"reflective"} tone. ${retroStr} There's no perfect day — but this one tilts in your direction.`;
    if(score > -10) return `The signals for ${domName.toLowerCase()} are genuinely mixed today — roughly equal supportive and cautionary influences. ${mainPlanet ? `The strongest aspect is ${mainPlanet}, pulling ${topSignal?.type==="green"?"toward opportunity":"toward caution"}.` : ""} ${retroStr} This is a day for careful discernment rather than bold moves. If the decision is not time-sensitive, monitoring the next few days may reveal a clearer window.`;
    if(score > -30) return `The planetary configuration is working against ${domName.toLowerCase()} today. ${mainPlanet ? `${mainPlanet} is the central tension point.` : ""} ${retroStr} The ${moonPhase} compounds the ${moonPhase.includes("Wan")?"releasing, not initiating":"complex"} energy. This doesn't mean failure is certain — but the friction is real. If you must proceed, build in extra time, patience, and contingency.`;
    return `This is a notably difficult configuration for ${domName.toLowerCase()}. Multiple challenging signals converge — ${mainPlanet ? `led by ${mainPlanet}` : "across several planetary layers"}. ${retroStr} Acting now means swimming against a strong current. Unless circumstances make delay impossible, this is a day to observe, prepare, and hold your position.`;
  }

  // Tier 4 — premium, nuanced, almost oracular
  const mainPlanet = topSignal?.text || "";
  const moonPhase = mp.name;
  const retroStr = retroNames.length > 0 ? `${retroNames.join(" and ")} move${retroNames.length > 1?"":"s"} retrograde — a cosmic invitation to revisit rather than initiate.` : "";
  if(score > 30) return `The sky opens a genuine corridor for ${domName.toLowerCase()} today. ${mainPlanet} anchors the primary current of support, and the ${moonPhase} amplifies whatever you bring to this moment with intention. ${retroStr} What you commit to now has weight — the conditions will carry it forward. This is the kind of alignment that makes the difference between good timing and great timing. Move.`;
  if(score > 10) return `A favourable lean for ${domName.toLowerCase()} — not a perfect sky, but a willing one. The planetary support is real and measurable, with ${mainPlanet||"the active transit energies"} opening pathways that weren't available yesterday. The ${moonPhase} provides ${moonPhase.includes("Wax")?"an expansive, forward-pulling quality":"reflective depth that can sharpen your instincts"}. ${retroStr} Proceed with clarity about what you want — the conditions will meet you there.`;
  if(score > -10) return `The oracle sees balance — and balance asks for stillness before motion. For ${domName.toLowerCase()}, today's signals pull in two genuine directions. ${mainPlanet ? `The tension lives in ${mainPlanet}.` : ""} ${retroStr} The ${moonPhase} neither helps nor hinders — it witnesses. This is not a day that will carry you; it's a day that reflects exactly what you put in. Proceed only if you can bring your fullest clarity.`;
  if(score > -30) return `The planetary weather resists ${domName.toLowerCase()} today. This is not punishment — it is timing. ${mainPlanet ? `${mainPlanet} creates the central friction.` : ""} The ${moonPhase} reinforces a ${moonPhase.includes("Wan")?"releasing, not building":"complex and uncertain"} energy. ${retroStr} The wisest oracle knows when not to act. Hold what you've built. The window will return.`;
  return `The alignment is working against ${domName.toLowerCase()} with unusual force today. Several signals converge in the same cautionary direction — this is rare enough to take seriously. ${mainPlanet ? `The epicentre is ${mainPlanet}.` : ""} ${retroStr} Even the ${moonPhase} adds to the weight. If you can afford to wait, wait. If you cannot, then bring every resource you have, expect friction, and do not mistake stubbornness for courage.`;
}

// ─── COMPUTATION ENGINE ─────────────────────────────────────────────────────
const mod360=(v:number)=>((v%360)+360)%360;
const Eng={
  T:(d:Date)=>{const y=d.getFullYear(),m=d.getMonth()+1,da=d.getDate(),a=Math.floor((14-m)/12),y1=y+4800-a,m1=m+12*a-3;return((da+Math.floor((153*m1+2)/5)+365*y1+Math.floor(y1/4)-Math.floor(y1/100)+Math.floor(y1/400)-32045)-2451545.0)/36525;},
  pos:(date:Date)=>{
    const T=Eng.T(date),d2=new Date(date);d2.setDate(d2.getDate()-1);const T2=Eng.T(d2);
    const R:any={Sun:280.4664567+360.0076983*T,Moon:218.3164477+481267.88123421*T,Mercury:252.2509+149472.6746*T,Venus:181.9798+58517.8157*T,Mars:355.4330+19140.2993*T,Jupiter:34.3515+3034.9057*T,Saturn:50.0774+1222.1138*T,Uranus:314.055+428.4677*T,Neptune:304.349+218.4862*T,Pluto:238.929+145.2078*T};
    const Y:any={Mercury:252.2509+149472.6746*T2,Venus:181.9798+58517.8157*T2,Mars:355.4330+19140.2993*T2,Jupiter:34.3515+3034.9057*T2,Saturn:50.0774+1222.1138*T2,Uranus:314.055+428.4677*T2,Neptune:304.349+218.4862*T2,Pluto:238.929+145.2078*T2};
    return Object.entries(R).map(([name,lng]:any)=>{const l=mod360(lng),sign=SIGNS[Math.floor(l/30)],planet=PLANETS.find(p=>p.name===name);let retro=false;if(Y[name]){let d=l-mod360(Y[name]);if(d>180)d-=360;if(d<-180)d+=360;retro=d<0;}return{name,lng:l,sign,degree:l%30,planet,retro};});
  },
  aspects:(p1:any[],p2:any[])=>{
    const f:any[]=[],seen=new Set();
    for(const a of p1)for(const b of p2){if(a.name===b.name)continue;let d=Math.abs(a.lng-b.lng);if(d>180)d=360-d;for(const asp of ASPECTS){const orb=Math.abs(d-asp.angle);if(orb<=asp.orb){const k=[a.name,b.name].sort().join("-")+asp.name;if(!seen.has(k)){seen.add(k);f.push({p1:a,p2:b,asp,orb:+orb.toFixed(1),strength:1-orb/asp.orb,exact:+((1-orb/asp.orb)*100).toFixed(0)});}}}}
    return f.sort((a,b)=>b.strength-a.strength);
  },
  moonPhase:(pos:any[])=>{
    const m=pos.find(p=>p.name==="Moon"),s=pos.find(p=>p.name==="Sun");if(!m||!s)return{name:"?",icon:"🌑",power:0,energy:""};
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
  voc:(pos:any[])=>{const m=pos.find(p=>p.name==="Moon");if(!m||m.degree<=27)return false;return !pos.some(p=>{if(p.name==="Moon")return false;let d=Math.abs(m.lng-p.lng);if(d>180)d=360-d;return ASPECTS.some(a=>Math.abs(d-a.angle)<=a.orb*0.4);});},
  scoreDomain:(dom:any,natal:any[],transit:any[],date:Date,tier:number,retros:any[])=>{
    const aspects=Eng.aspects(transit,natal);
    const rel=aspects.filter((a:any)=>dom.rulers.includes(a.p1.name)||dom.rulers.includes(a.p2.name));
    let score=0;const signals:any[]=[];
    rel.forEach((a:any)=>{let imp=a.strength*a.asp.power;const ben=["Venus","Jupiter","Sun"].includes(a.p1.name);
      if(["flow","opportunity","fusion"].includes(a.asp.nature)){if(ben)imp*=1.5;score+=imp;signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:+imp.toFixed(1),type:"green",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — supports action (${a.exact}% exact)`});}
      else{if(["Saturn","Mars","Pluto"].includes(a.p1.name))imp*=1.4;score-=imp;signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:-imp.toFixed(1),type:"red",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — caution advised (${a.exact}% exact)`});}});
    transit.filter(p=>p.retro&&dom.rulers.includes(p.name)).forEach(p=>{const pen=p.name==="Mercury"?-8:p.name==="Venus"?-6:p.name==="Mars"?-7:-4;score+=pen;signals.push({text:`${p.planet?.sym||""} ${p.name} Retrograde in ${p.sign.name}`,val:pen,type:"warning",conf:8,detail:p.name==="Mercury"?"Avoid signing — miscommunication risk high":p.name==="Venus"?"Re-evaluate, don't commit to new":p.name==="Mars"?"Frustrated energy — action may backfire":"Deep review phase"});});
    const mp=Eng.moonPhase(transit),waxing=["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous"].includes(mp.name);
    if(["career","contracts","creative","learning"].includes(dom.id)){if(waxing){score+=4;signals.push({text:`${mp.icon} ${mp.name} — Waxing Phase`,val:4,type:"green",conf:6,detail:"Building energy supports new initiatives"});}else{score-=3;signals.push({text:`${mp.icon} ${mp.name} — Waning Phase`,val:-3,type:"caution",conf:5,detail:"Releasing phase — better for completing than starting"});}}
    if(dom.id==="spiritual"&&["Full Moon","Waning Gibbous","Last Quarter"].includes(mp.name)){score+=5;signals.push({text:`${mp.icon} ${mp.name} supports inner work`,val:5,type:"green",conf:7,detail:"Heightened awareness for reflection"});}
    if(dom.id==="love"&&mp.name==="Full Moon"){score+=4;signals.push({text:`${mp.icon} Full Moon — emotional peak`,val:4,type:"green",conf:7,detail:"Feelings surface — powerful for honest connection"});}
    if(Eng.voc(transit)){score-=6;signals.push({text:"🚫 Void of Course Moon",val:-6,type:"warning",conf:7,detail:"Actions started now tend to fizzle"});}
    const hrs=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"],dayR=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"][date.getDay()],hR=hrs[(hrs.indexOf(dayR)+date.getHours())%7];
    if(dom.rulers.includes(hR)){score+=3;signals.push({text:`⏰ Planetary Hour of ${hR}`,val:3,type:"green",conf:4,detail:`Current hour ruled by ${hR}`});}
    const norm=Math.max(-100,Math.min(100,score*2.5));
    // Confidence: honest — based on signal count and strength, capped meaningfully
    const signalStrength=signals.reduce((s:number,x:any)=>s+Math.abs(x.val),0);
    const confidence=Math.min(92,Math.max(20,Math.round(30+signalStrength*1.8+signals.length*2)));
    const gn=signals.filter(s=>s.type==="green").length,rd=signals.filter(s=>s.type==="red"||s.type==="warning"||s.type==="caution").length;
    const verdict=getDomainVerdict(norm,dom.name,tier,signals,mp,retros);
    return{score:norm,signals:signals.sort((a:any,b:any)=>Math.abs(b.val)-Math.abs(a.val)),confidence,greenCount:gn,redCount:rd,totalSignals:signals.length,verdict,mp};
  },
};

// ─── TEAM SCORING ───────────────────────────────────────────────────────────
function scoreTeamMember(dob:string, targetDate:string, tier:number) {
  const bDate=new Date(dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
  const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
  const retros=transit.filter((p:any)=>p.retro);
  const mp=Eng.moonPhase(transit);
  const domains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros)}));
  const overall=domains.reduce((s:number,d:any)=>s+d.score,0)/domains.length;
  const topDomain=domains.reduce((b:any,x:any)=>x.score>b.score?x:b,domains[0]);
  const bottomDomain=domains.reduce((b:any,x:any)=>x.score<b.score?x:b,domains[0]);
  const confidence=Math.min(92,Math.max(20,Math.round(domains.reduce((s:number,d:any)=>s+d.confidence,0)/domains.length)));
  return{overall,confidence,topDomain,bottomDomain,mp,retros,domains};
}

// ─── STYLING ────────────────────────────────────────────────────────────────
const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};
const vColor=(s:number)=>s>30?CL.grn:s>10?"#7ddba3":s>-10?CL.acc:s>-30?"#e5a0a0":CL.red;
const vLabel=(s:number)=>s>30?"Excellent":s>10?"Favorable":s>-10?"Mixed":s>-30?"Caution":"Avoid";
const fmtD=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fmtDL=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

// Confidence pill — replaces big number
const ConfPill=({confidence,score}:{confidence:number,score:number})=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,minWidth:70}}>
    <div style={{fontSize:11,fontWeight:800,color:vColor(score),fontFamily:"system-ui",letterSpacing:0.5}}>{vLabel(score)}</div>
    <div style={{background:`${vColor(score)}18`,border:`1px solid ${vColor(score)}40`,borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700,fontFamily:"system-ui",color:vColor(score),whiteSpace:"nowrap"}}>
      {confidence}% confidence
    </div>
  </div>
);

const Bullet=({children,color,strong}:any)=>(
  <div style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${CL.bdr}30`,alignItems:"flex-start"}}>
    <span style={{color:color||CL.dim,fontSize:13,marginTop:1,flexShrink:0}}>•</span>
    <div style={{flex:1,fontSize:12.5,lineHeight:1.65,fontFamily:"system-ui",color:CL.txt}}>
      {strong?<b style={{color:color||CL.txt}}>{strong}</b>:null}{strong?" — ":""}{children}
    </div>
  </div>
);

const SH=({icon,title,sub,color}:any)=>(
  <div style={{marginBottom:12}}>
    <div style={{fontSize:10,letterSpacing:3,color:color||CL.acc,fontWeight:700,fontFamily:"system-ui"}}>{icon}</div>
    <div style={{fontSize:16,fontWeight:800,color:CL.txt,fontFamily:"system-ui",marginTop:2}}>{title}</div>
    {sub&&<div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui"}}>{sub}</div>}
  </div>
);
const HR=()=><div style={{height:1,background:CL.bdr,margin:"12px 0"}}/>;

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function OracleEngine() {
  const [dob,setDob]=useState("");
  const [targetDate,setTargetDate]=useState(new Date().toISOString().split("T")[0]);
  const [tab,setTab]=useState("reading");
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState<string|null>(null);
  const [tier,setTier]=useState(1);
  const [selectedDomains,setSelectedDomains]=useState<string[]>(["career","love","financial"]);
  const [teamMembers,setTeamMembers]=useState<any[]>([]);
  const [newMemberName,setNewMemberName]=useState("");
  const [newMemberDob,setNewMemberDob]=useState("");
  const [teamData,setTeamData]=useState<any[]>([]);
  const [aiReading,setAiReading]=useState("");
  const [aiLoading,setAiLoading]=useState(false);

  useEffect(()=>{
    const saved=localStorage.getItem(TIER_KEY);
    if(saved)setTier(parseInt(saved));
  },[]);

  const selectTier=(t:number)=>{setTier(t);localStorage.setItem(TIER_KEY,String(t));};

  const compute=useCallback(()=>{
    if(!dob)return;setLoading(true);
    setTimeout(()=>{
      const bDate=new Date(dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
      const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
      const allAspects=Eng.aspects(transit,natal);
      const mp=Eng.moonPhase(transit),voc=Eng.voc(transit);
      const retros=transit.filter((p:any)=>p.retro);
      const sunSign=natal.find((p:any)=>p.name==="Sun").sign;
      const moonSign=natal.find((p:any)=>p.name==="Moon").sign;
      const elements:any={fire:0,earth:0,air:0,water:0};natal.forEach((p:any)=>{if(p.sign)elements[p.sign.el]++;});
      const allDomains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros)})).sort((a:any,b:any)=>b.score-a.score);
      // Tier 2: only show selected domains
      const domains=tier===2?allDomains.filter(d=>selectedDomains.includes(d.id)):allDomains;
      const overall=domains.reduce((s:number,d:any)=>s+d.score,0)/domains.length;
      const overallConf=Math.min(92,Math.max(20,Math.round(domains.reduce((s:number,d:any)=>s+d.confidence,0)/domains.length)));
      const totalGreen=domains.reduce((s:number,d:any)=>s+d.greenCount,0);
      const totalRed=domains.reduce((s:number,d:any)=>s+d.redCount,0);
      const forecast:any[]=[];
      for(let i=0;i<30;i++){const fd=new Date(tDate);fd.setDate(fd.getDate()+i);const dt=Eng.pos(fd);const ds=DOMAINS.map(dm=>({...dm,...Eng.scoreDomain(dm,natal,dt,fd,tier,retros)}));const avg=ds.reduce((s:number,x:any)=>s+x.score,0)/ds.length;const best=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);forecast.push({date:fd,overall:avg,best,moonPhase:Eng.moonPhase(dt),domains:ds});}
      const bestDays=DOMAINS.map((dom,di)=>{const sorted=[...forecast].sort((a:any,b:any)=>b.domains[di].score-a.domains[di].score);return{domain:dom,top3:sorted.slice(0,3).map(f=>({date:f.date,score:f.domains[di].score,conf:f.domains[di].confidence})),bottom3:sorted.slice(-3).reverse().map(f=>({date:f.date,score:f.domains[di].score}))};});
      setData({natal,transit,allAspects,mp,voc,retros,sunSign,moonSign,elements,domains,allDomains,overall,overallConf,totalGreen,totalRed,forecast,bestDays});
      setLoading(false);
    },600);
  },[dob,targetDate,tier,selectedDomains]);

  useEffect(()=>{if(dob)compute();},[dob,targetDate,tier,selectedDomains]);

  const addTeamMember=()=>{
    if(!newMemberName||!newMemberDob)return;
    const member={name:newMemberName,dob:newMemberDob,id:Date.now()};
    const updated=[...teamMembers,member];
    setTeamMembers(updated);
    setNewMemberName("");setNewMemberDob("");
    // Compute team scores
    const scores=updated.map(m=>({...m,...scoreTeamMember(m.dob,targetDate,tier)}));
    setTeamData(scores);
  };

  const removeTeamMember=(id:number)=>{
    const updated=teamMembers.filter(m=>m.id!==id);
    setTeamMembers(updated);
    setTeamData(updated.map(m=>({...m,...scoreTeamMember(m.dob,targetDate,tier)})));
  };

  useEffect(()=>{
    if(teamMembers.length>0){
      setTeamData(teamMembers.map(m=>({...m,...scoreTeamMember(m.dob,targetDate,tier)})));
    }
  },[targetDate,tier]);

  const getAiReading=async()=>{
    if(!data)return;setAiLoading(true);setAiReading("");
    const summary=`Date: ${targetDate}, Overall score: ${data.overall.toFixed(0)}, Top domain: ${data.domains[0].name} (${data.domains[0].score.toFixed(0)}), Bottom domain: ${data.domains[data.domains.length-1].name} (${data.domains[data.domains.length-1].score.toFixed(0)}), Moon: ${data.mp.name}, Retrogrades: ${data.retros.map((r:any)=>r.name).join(",")||"none"}, VOC: ${data.voc}, Tier: ${tier}`;
    try{
      const res=await fetch("/api/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({summary,tier})});
      const json=await res.json();
      setAiReading(json.interpretation||"The Oracle is silent.");
    }catch{setAiReading("Could not reach the Oracle. Try again.");}
    setAiLoading(false);
  };

  const SC:any={card:{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}};
  const TB=({id,label,icon}:{id:string,label:string,icon:string})=>(
    <button onClick={()=>setTab(id)} style={{background:tab===id?CL.acc:"transparent",color:tab===id?"#000":CL.dim,border:`1px solid ${tab===id?CL.acc:CL.bdr}`,borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>
      {icon} {label}
    </button>
  );

  const tierInfo=TIERS.find(t=>t.id===tier)||TIERS[0];

  const toggleDomain=(id:string)=>{
    if(selectedDomains.includes(id)){if(selectedDomains.length>1)setSelectedDomains(prev=>prev.filter(d=>d!==id));}
    else if(selectedDomains.length<3)setSelectedDomains(prev=>[...prev,id]);
  };

  return(
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"'Georgia','Palatino',serif",padding:"10px 14px",maxWidth:720,margin:"0 auto"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{text-shadow:0 0 15px #f6ad3c44}50%{text-shadow:0 0 30px #f6ad3c88,0 0 60px #9b7fe644}}input[type="date"],input[type="text"]{font-family:system-ui}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}*{box-sizing:border-box}`}</style>

      {/* HEADER */}
      <div style={{textAlign:"center",padding:"18px 0 10px"}}>
        <div style={{fontSize:10,letterSpacing:6,color:CL.pur,fontWeight:700,fontFamily:"system-ui"}}>ORACLE v3</div>
        <h1 style={{fontSize:24,fontWeight:400,margin:"4px 0",fontStyle:"italic",background:`linear-gradient(135deg,${CL.acc},${CL.pnk},${CL.pur})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 5s ease infinite"}}>Personal Decision Oracle</h1>
        {/* Tier switcher */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:8,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",letterSpacing:1}}>PLAN:</span>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>selectTier(t.id)} style={{background:tier===t.id?`${t.color}20`:"transparent",color:tier===t.id?t.color:CL.mut,border:`1px solid ${tier===t.id?t.color:CL.bdr}`,borderRadius:20,padding:"3px 12px",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"system-ui",letterSpacing:1,transition:"all 0.15s"}}>
              {t.name}
            </button>
          ))}
        </div>
        <div style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",marginTop:3,fontStyle:"italic"}}>{tierInfo.desc}</div>
      </div>

      {/* TIER 2 — DOMAIN SELECTOR */}
      {tier===2&&(
        <div style={{...SC.card,borderColor:CL.pur+"40"}}>
          <SH icon="🎯" title="YOUR 3 FOCUS AREAS" sub="Choose exactly 3 domains for your deep reading" color={CL.pur}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {DOMAINS.map(d=>{
              const sel=selectedDomains.includes(d.id);
              const disabled=!sel&&selectedDomains.length>=3;
              return(<button key={d.id} onClick={()=>!disabled&&toggleDomain(d.id)} style={{background:sel?`${CL.pur}20`:"transparent",color:sel?CL.pur:disabled?CL.mut:CL.dim,border:`1px solid ${sel?CL.pur:disabled?CL.mut:CL.bdr}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:sel?700:400,cursor:disabled?"not-allowed":"pointer",fontFamily:"system-ui",opacity:disabled?0.4:1}}>
                {d.icon} {d.name}
              </button>);
            })}
          </div>
          <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:8}}>{selectedDomains.length}/3 selected</div>
        </div>
      )}

      {/* DOB + DATE */}
      <div style={{...SC.card,background:`linear-gradient(160deg,${CL.card},#120e24)`,borderColor:CL.pur+"50"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:1,minWidth:140}}>
            <label style={{fontSize:9,color:CL.dim,display:"block",marginBottom:3,fontFamily:"system-ui",letterSpacing:1}}>DATE OF BIRTH</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{width:"100%",padding:"10px 12px",background:CL.card2,border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:15}}/>
          </div>
          <div style={{flex:1,minWidth:140}}>
            <label style={{fontSize:9,color:CL.dim,display:"block",marginBottom:3,fontFamily:"system-ui",letterSpacing:1}}>DATE TO ANALYSE</label>
            <input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} style={{width:"100%",padding:"10px 12px",background:CL.card2,border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:15}}/>
          </div>
          <button onClick={compute} disabled={!dob||loading} style={{background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:10,padding:"11px 24px",fontSize:12,fontWeight:800,cursor:!dob?"not-allowed":"pointer",opacity:!dob?0.4:1,fontFamily:"system-ui",letterSpacing:1}}>
            {loading?"✨ Computing...":"🔮 Consult Oracle"}
          </button>
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
          {tier===4&&<TB id="team" label="Team" icon="👥"/>}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    FULL READING                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="reading"&&(<>

          {/* Situation */}
          <div style={SC.card}>
            <SH icon="📊" title="SITUATION ASSESSMENT" sub={`Reading for ${fmtDL(new Date(targetDate))}`}/>
            <Bullet strong={`${data.sunSign.sym} Sun in ${data.sunSign.name}`}>Your core identity — {data.sunSign.trait.toLowerCase()}</Bullet>
            <Bullet strong={`${data.moonSign.sym} Moon in ${data.moonSign.name}`}>Your emotional nature and instinct patterns</Bullet>
            <Bullet strong={`${data.mp.icon} ${data.mp.name}`}>{data.mp.energy}</Bullet>
            {data.voc&&<Bullet strong="🚫 Void of Course Moon" color={CL.red}>Actions started now tend to not go as planned. Delay if possible.</Bullet>}
            {data.retros.map((r:any)=><Bullet key={r.name} strong={`${r.planet?.sym} ${r.name} Retrograde`} color={CL.acc}>{r.name==="Mercury"?"Contracts and communication disrupted — double-check everything":r.name==="Venus"?"Values under review — not ideal for new commitments":r.name==="Mars"?"Action frustrated — don't force outcomes":"Deep review energy, not initiation"}</Bullet>)}
          </div>

          {/* Overall verdict */}
          <div style={{...SC.card,background:`linear-gradient(150deg,${CL.card},${data.overall>15?"#0d1a10":data.overall<-15?"#1a0d0d":"#1a1708"})`}}>
            <SH icon="🎯" title="OVERALL VERDICT" color={vColor(data.overall)}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
              {[
                {label:"OVERALL",value:vLabel(data.overall),color:vColor(data.overall),sub:data.overall>0?`+${data.overall.toFixed(0)} weighted score`:`${data.overall.toFixed(0)} weighted score`},
                {label:"CONFIDENCE",value:`${data.overallConf}%`,color:CL.acc,sub:"Based on signal strength and count"},
                {label:"SIGNALS",value:`▲${data.totalGreen} / ▼${data.totalRed}`,color:data.totalGreen>data.totalRed?CL.grn:CL.red,sub:`${data.totalGreen} supportive vs ${data.totalRed} challenging`},
                {label:"MOON",value:data.mp.icon,color:CL.cyn,sub:data.mp.name},
              ].map(m=>(
                <div key={m.label} style={{background:CL.card2,borderRadius:10,padding:12,borderTop:`2px solid ${m.color}`}}>
                  <div style={{fontSize:8,letterSpacing:2,color:CL.dim,fontFamily:"system-ui",fontWeight:700}}>{m.label}</div>
                  <div style={{fontSize:m.label==="MOON"?28:18,fontWeight:900,color:m.color,fontFamily:"system-ui",margin:"4px 0",lineHeight:1}}>{m.value}</div>
                  <div style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",lineHeight:1.4}}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI reading — all tiers but language quality scales */}
          <div style={{...SC.card,borderColor:CL.pur+"40"}}>
            <SH icon="✨" title="ORACLE AI INTERPRETATION" color={CL.pur}
              sub={tier===1?"Overview reading":tier===2?"Focused on your 3 domains":tier===3?"Full detailed analysis":"Premium Oracle voice — full narrative"}/>
            {aiReading?(
              <div>
                <div style={{fontSize:13,lineHeight:1.9,color:CL.txt,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{aiReading}</div>
                <button onClick={()=>setAiReading("")} style={{marginTop:10,background:"transparent",border:`1px solid ${CL.bdr}`,borderRadius:8,padding:"6px 14px",fontSize:10,color:CL.dim,cursor:"pointer",fontFamily:"system-ui"}}>↩ New reading</button>
              </div>
            ):(
              <button onClick={getAiReading} disabled={aiLoading} style={{background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:10,padding:"12px 28px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",letterSpacing:1,width:"100%",opacity:aiLoading?0.6:1}}>
                {aiLoading?"✨ The Oracle speaks...":"✨ Get AI Oracle Interpretation"}
              </button>
            )}
          </div>

          {/* Domain by domain */}
          <div style={SC.card}>
            <SH icon="📋" title="DOMAIN ANALYSIS"
              sub={tier===2?`Your 3 focus areas — deep reading`:"All 9 domains — tap any for signal detail"}/>
            {data.domains.map((d:any)=>(
              <div key={d.id} style={{background:CL.card2,borderRadius:12,padding:"14px 16px",marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`,cursor:"pointer"}} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{d.icon} {d.name}</div>
                    <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:1}}>{d.sub}</div>
                  </div>
                  <ConfPill confidence={d.confidence} score={d.score}/>
                </div>

                {/* Verdict text — quality scales with tier */}
                <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.7,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {d.verdict}
                </div>

                {/* Signal detail — expanded, shown on tiers 2+ */}
                {expanded===d.id&&tier>=2&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${CL.bdr}`,animation:"fadeUp 0.3s ease"}}>
                    <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,fontFamily:"system-ui",marginBottom:6}}>SIGNAL BREAKDOWN</div>
                    {d.signals.map((s:any,j:number)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:`1px solid ${CL.bdr}20`,gap:10}}>
                        <div style={{flex:1,fontFamily:"system-ui",fontSize:11.5,lineHeight:1.5,color:s.type==="green"?CL.grn:s.type==="red"||s.type==="warning"?CL.red:CL.acc}}>
                          <b>{s.text}</b><br/>
                          <span style={{color:CL.dim,fontSize:11}}>{s.detail}</span>
                        </div>
                        <div style={{fontWeight:800,fontSize:11,color:s.val>0?CL.grn:CL.red,fontFamily:"system-ui",flexShrink:0}}>
                          {s.val>0?"+":""}{s.val}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {expanded===d.id&&tier===1&&(
                  <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${CL.bdr}`,fontFamily:"system-ui",fontSize:11,color:CL.dim,textAlign:"center"}}>
                    Upgrade to Plus or above to see full signal breakdown
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    SHOULD I                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="shouldi"&&(
          <div style={SC.card}>
            <SH icon="🤔" title="SHOULD I...?" sub={fmtDL(new Date(targetDate))}/>
            {DOMAINS.filter(d=>tier===2?selectedDomains.includes(d.id):true).map(qd=>{
              const d=data.allDomains.find((x:any)=>x.id===qd.id);
              if(!d)return null;
              const answer=d.score>30?"Yes — conditions are strongly in your favour":d.score>10?"Likely yes — the timing leans your way":d.score>-10?"Mixed — could go either way. Use your judgment":d.score>-30?"Not ideal — consider waiting for a better window":"Not recommended — the conditions are working against this";
              return(
                <div key={qd.id} style={{background:CL.card2,borderRadius:12,padding:16,marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{qd.icon} {qd.name}</div>
                    <ConfPill confidence={d.confidence} score={d.score}/>
                  </div>
                  <div style={{fontSize:13,color:vColor(d.score),fontStyle:"italic",margin:"8px 0",fontFamily:"system-ui"}}>{answer}</div>
                  <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.7}}>{d.verdict}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    30-DAY CALENDAR                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="calendar"&&(
          <div style={SC.card}>
            <SH icon="📅" title="30-DAY PERSONAL COSMIC MAP" sub="Your energy landscape for the month ahead"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:12}}>
              {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:8,color:CL.dim,fontFamily:"system-ui",fontWeight:700}}>{d}</div>)}
              {Array.from({length:data.forecast[0].date.getDay()}).map((_,i)=><div key={"e"+i}/>)}
              {data.forecast.map((day:any,i:number)=>{
                const bg=vColor(day.overall);
                return(<div key={i} onClick={()=>{setTargetDate(day.date.toISOString().split("T")[0]);setTab("reading");}} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:8,cursor:"pointer",background:bg+"15",border:i===0?`2px solid ${CL.acc}`:`1px solid ${bg}20`}}>
                  <div style={{fontSize:11,fontWeight:700,fontFamily:"system-ui"}}>{day.date.getDate()}</div>
                  <div style={{fontSize:7,fontWeight:700,color:bg,fontFamily:"system-ui"}}>{day.overall>0?"+":""}{day.overall.toFixed(0)}</div>
                  <div style={{fontSize:7}}>{day.moonPhase.icon}</div>
                </div>);
              })}
            </div>
            <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>DAILY BREAKDOWN (14 days)</div>
            {data.forecast.slice(0,14).map((day:any,i:number)=>(
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
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",minWidth:60}}>
                  <span style={{fontSize:11,fontWeight:800,color:vColor(day.overall)}}>{vLabel(day.overall)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    BEST DAYS                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="bestdays"&&(
          <div style={SC.card}>
            <SH icon="⭐" title="OPTIMAL TIMING" sub="Best & worst windows — next 30 days by domain"/>
            {data.bestDays.filter((bd:any)=>tier===2?selectedDomains.includes(bd.domain.id):true).map((bd:any)=>(
              <div key={bd.domain.id} style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:8}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui",marginBottom:8}}>{bd.domain.icon} {bd.domain.name}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:CL.grn,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🟢 BEST WINDOWS</div>
                    {bd.top3.map((d:any,i:number)=>(<div key={i} onClick={()=>{setTargetDate(d.date.toISOString().split("T")[0]);setTab("reading");}} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:CL.grn+"0d",borderRadius:6,marginBottom:3,cursor:"pointer",fontFamily:"system-ui",fontSize:11}}>
                      <span>{fmtD(d.date)}</span>
                      <span style={{fontWeight:800,color:CL.grn}}>{d.conf}% conf</span>
                    </div>))}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:CL.red,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🔴 AVOID</div>
                    {bd.bottom3.map((d:any,i:number)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:CL.red+"0d",borderRadius:6,marginBottom:3,fontFamily:"system-ui",fontSize:11}}>
                      <span>{fmtD(d.date)}</span>
                      <span style={{fontWeight:800,color:CL.red}}>{vLabel(d.score)}</span>
                    </div>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    CHART                                */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="chart"&&(
          <div style={SC.card}>
            <SH icon="🌌" title="NATAL CHART + CURRENT TRANSITS"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {["Natal","Transit"].map(type=>(
                <div key={type}>
                  <div style={{fontSize:10,color:type==="Natal"?CL.acc:CL.pur,letterSpacing:2,fontWeight:700,marginBottom:4,fontFamily:"system-ui"}}>{type.toUpperCase()}</div>
                  {(type==="Natal"?data.natal:data.transit).map((p:any)=>(
                    <div key={p.name} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:11,background:CL.card2,borderRadius:5,marginBottom:2,fontFamily:"system-ui"}}>
                      <span style={{color:p.planet?.c}}>{p.planet?.sym} {p.name}{p.retro?" ℞":""}</span>
                      <span style={{color:p.sign.c}}>{p.sign.sym} {p.degree.toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <HR/>
            <div style={{fontSize:10,letterSpacing:2,color:CL.pnk,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>TOP ASPECTS</div>
            {data.allAspects.slice(0,10).map((a:any,i:number)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:i%2?"transparent":CL.card2,borderRadius:5,fontSize:11,fontFamily:"system-ui"}}>
                <span style={{fontSize:14,color:a.asp.c}}>{a.asp.sym}</span>
                <span style={{flex:1}}><span style={{color:a.p1.planet?.c}}>{a.p1.name}</span> <span style={{color:CL.dim}}>{a.asp.name}</span> <span style={{color:a.p2.planet?.c}}>{a.p2.name}</span></span>
                <span style={{fontWeight:800,color:a.asp.c}}>{a.exact}% exact</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    TEAM (Tier 4 only)                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tab==="team"&&tier===4&&(<>
          <div style={SC.card}>
            <SH icon="👥" title="TEAM ORACLE" sub="Add up to 5 people — combined cosmic reading for your group" color={CL.pnk}/>

            {/* Add member */}
            {teamMembers.length<5?(
              <div style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginBottom:8}}>Add a team member ({teamMembers.length}/5 — free · 6th+ person $19.99/mo each)</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input type="text" value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} placeholder="Name" style={{flex:1,minWidth:100,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <input type="date" value={newMemberDob} onChange={e=>setNewMemberDob(e.target.value)} style={{flex:1,minWidth:130,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <button onClick={addTeamMember} disabled={!newMemberName||!newMemberDob} style={{background:`linear-gradient(135deg,${CL.pnk},${CL.pur})`,color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",opacity:!newMemberName||!newMemberDob?0.4:1}}>
                    + Add
                  </button>
                </div>
              </div>
            ):(
              <div style={{background:`${CL.grn}15`,border:`1px solid ${CL.grn}30`,borderRadius:8,padding:"8px 14px",fontSize:11,color:CL.grn,fontFamily:"system-ui",marginBottom:12}}>
                ✓ Team full (5/5) — additional members from $19.99/mo each
              </div>
            )}

            {/* Team member cards */}
            {teamData.length>0&&teamData.map((m:any,i:number)=>(
              <div key={m.id} style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:8,borderLeft:`4px solid ${vColor(m.overall)}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui",color:CL.txt}}>{m.name}</div>
                    <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginTop:2}}>
                      Best domain today: <b style={{color:CL.grn}}>{m.topDomain.icon} {m.topDomain.name}</b> · Challenging: <b style={{color:CL.red}}>{m.bottomDomain.icon} {m.bottomDomain.name}</b>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <ConfPill confidence={m.confidence} score={m.overall}/>
                    <button onClick={()=>removeTeamMember(m.id)} style={{background:"transparent",border:"none",color:CL.dim,cursor:"pointer",fontSize:14,padding:"2px 6px"}}>✕</button>
                  </div>
                </div>
                <div style={{fontSize:12,color:CL.txt,fontFamily:"system-ui",lineHeight:1.65,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {m.overall>20
                    ?`${m.name} is in a strong position today — a natural day to be visible, lead conversations, and take initiative. Their energy in ${m.topDomain.name.toLowerCase()} is particularly high.`
                    :m.overall>0
                    ?`${m.name} has mixed but leaning positive energy. Good in support roles today — better to collaborate than to lead independently.`
                    :m.overall>-20
                    ?`${m.name} carries some headwinds today. Better to work behind the scenes, support others, and avoid high-stakes decisions.`
                    :`${m.name}'s energy is challenged today. Keep them in a holding pattern — not the day for them to be front-facing or making major calls.`}
                </div>
              </div>
            ))}

            {/* Combined team reading */}
            {teamData.length>1&&(
              <div style={{...SC.card,marginTop:4,borderColor:CL.pnk+"40"}}>
                <SH icon="🔗" title="COMBINED TEAM READING" color={CL.pnk} sub="Who leads today, who holds back"/>
                {[...teamData].sort((a:any,b:any)=>b.overall-a.overall).map((m:any,i:number)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${CL.bdr}30`}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`${vColor(m.overall)}20`,border:`2px solid ${vColor(m.overall)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:vColor(m.overall),fontFamily:"system-ui",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,fontFamily:"system-ui"}}>{m.name}</div>
                      <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>{i===0?"🌟 Lead today — highest energy, most momentum":i===teamData.length-1?"🌿 Rest & support today — let others carry the load":"⚖️ Supporting role — strong in collaboration"}</div>
                    </div>
                    <ConfPill confidence={m.confidence} score={m.overall}/>
                  </div>
                ))}
                <div style={{marginTop:12,fontSize:12,color:CL.dim,fontFamily:"system-ui",lineHeight:1.7,fontStyle:"italic"}}>
                  The optimal team day is when your highest-energy person leads external interactions, your mid-energy members handle execution, and your challenged members focus on internal or administrative work.
                </div>
              </div>
            )}

            {teamData.length===0&&(
              <div style={{textAlign:"center",padding:"30px",color:CL.dim,fontFamily:"system-ui",fontSize:12}}>
                Add your first team member above to begin the combined reading.
              </div>
            )}
          </div>
        </>)}
      </>)}

      <div style={{textAlign:"center",padding:"20px 0 10px",fontSize:10,color:CL.mut,fontFamily:"system-ui",lineHeight:1.6}}>
        <i>Generated by Oracle v3 Personal Decision Framework</i><br/>
        <i>"The stars incline, they do not compel."</i>
      </div>
    </div>
  );
}
