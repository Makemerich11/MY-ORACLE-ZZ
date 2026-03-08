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
  {id:1,name:"Basic",price:"$9.99",color:"#6b6580",desc:"Overview across all 9 domains"},
  {id:2,name:"Plus",price:"$29.99",color:"#9b7fe6",desc:"Deep dive into your 3 chosen areas"},
  {id:3,name:"Pro",price:"$79.99",color:"#f6ad3c",desc:"Full detailed analysis — all 9 domains"},
  {id:4,name:"Pro+",price:"$99.99",color:"#e879a0",desc:"Premium readings + Team mode"},
];

// ─── DOMAIN-SPECIFIC VERDICTS ────────────────────────────────────────────────
// Each domain has its own language — sounds different, feels real
const DOMAIN_LINES:any = {
  career: {
    great: ["Strong day to push forward at work — visibility and authority are on your side.", "Planetary support for career moves is high. Make that call, pitch that idea, step up.", "Leadership energy is strong today. People are watching — show up fully."],
    good:  ["Reasonable conditions for career progress. Not peak, but the door is open.", "Decent energy for work today. Focus on output, not politics.", "Momentum is available if you go after it. Mid-level effort yields solid results."],
    mixed: ["Mixed work energy — some friction alongside some opportunity. Pick your battles.", "Not the clearest day for major career moves. Better for planning than executing.", "Tread carefully with authority figures today. Collaboration beats confrontation."],
    bad:   ["Keep your head down at work today. Avoid confrontations or big announcements.", "Career energy is strained. Delay launches, skip the important meeting if you can.", "Not a day to make power moves. Lay low and prepare instead."],
    avoid: ["Strongly avoid major career decisions today. The timing is genuinely poor.", "Risk of professional setbacks if you push too hard now. Wait this one out."],
  },
  love: {
    great: ["Deep connection energy today — honest conversations land well, feelings are clear.", "A strong day for love. If you've been holding back, the timing to open up is now.", "Emotional warmth and receptivity are high. Relationships feel genuinely supportive."],
    good:  ["Good relational energy — a solid day for connection and honest exchange.", "Love and friendship feel lighter today. Small gestures go a long way.", "People around you are receptive. Good day for patching things up or deepening bonds."],
    mixed: ["Emotional signals are mixed. Listen more than you speak in relationships today.", "Proceed carefully with sensitive conversations — timing is everything.", "Love energy is present but unstable. Don't force resolution today."],
    bad:   ["High chance of miscommunication in relationships. Postpone the difficult talk.", "Emotional tension is elevated. Give yourself and others a little more space.", "Not a strong day for romantic or relational action. Hold the line."],
    avoid: ["Avoid major relationship decisions or confrontations today — the energy is genuinely against it.", "This is not the day to issue ultimatums or make permanent calls about relationships."],
  },
  contracts: {
    great: ["Excellent day to sign. Clarity, agreement energy, and follow-through are all strong.", "Mercury and Jupiter are both supportive — legal and contractual actions are well-timed.", "Put pen to paper today. The conditions for clean, binding agreements are unusually good."],
    good:  ["Reasonable day to negotiate or advance contractual matters. Read the fine print.", "Contractual energy is positive. Proceed, but keep documentation thorough.", "Decent conditions for advancing legal or business agreements."],
    mixed: ["Mixed signals for contracts. If you can delay signing by a day or two, consider it.", "Proceed with any agreements carefully today — re-read everything twice.", "Negotiation is possible but friction is likely. Build in extra time."],
    bad:   ["Avoid signing anything important today if possible. Miscommunication risk is elevated.", "Contract energy is poor — delays, disputes, or misunderstandings are more likely.", "Not the day for legal commitments. Things signed today may need revisiting."],
    avoid: ["Do not sign contracts today. Seriously — the planetary conditions are strongly against it.", "Mercury is working against clear communication and agreement. Postpone any signing."],
  },
  travel: {
    great: ["Green light for travel and movement. Plans made today tend to go smoothly.", "Strong energy for relocation decisions or booking big journeys. Move forward.", "The stars support physical movement today — new places, new perspectives."],
    good:  ["Good travel energy — minor hiccups possible but nothing derailing.", "Solid day to plan or book. Journeys started now have good momentum.", "Movement is favoured. Whether it's a trip or a move, energy supports it."],
    mixed: ["Travel plans may hit delays or changes today. Build in flexibility.", "Check bookings twice — mixed energy around transport and logistics.", "Not terrible for travel, but not ideal either. Go with a backup plan."],
    bad:   ["Delays and disruptions are more likely today. Avoid non-essential travel.", "Travel energy is poor — luggage issues, missed connections, last-minute changes.", "Rescheduling a trip? Today might not be the day to rebook it either."],
    avoid: ["Avoid travel decisions today if at all possible. Strong indicators of disruption.", "Do not make major relocation choices now. The timing is genuinely bad."],
  },
  health: {
    great: ["Strong vitality today — a great time to start a new health routine or regime.", "Physical energy is high and aligned. Decisions about your body made now tend to stick.", "Good day for health-related actions — new habits, medical consultations, lifestyle changes."],
    good:  ["Decent health energy. Momentum supports new habits if you start today.", "Reasonable conditions for body-related decisions. Trust your physical instincts.", "Good energy for exercise, clean eating, or starting something new health-wise."],
    mixed: ["Energy levels may be inconsistent today. Don't overcommit physically.", "Mixed health signals — rest is as valuable as action right now.", "Be gentle with your body today. Push and rest in equal measure."],
    bad:   ["Physical energy is low or unpredictable. Avoid elective procedures if possible.", "Not a strong day for health decisions. Recovery and rest are better uses of today.", "Fatigue or physical resistance is more likely. Honour your limits."],
    avoid: ["Strongly avoid major medical decisions or new health regimes today.", "Do not schedule surgery or major interventions now if you have any choice in the matter."],
  },
  creative: {
    great: ["Creative energy is exceptional today — make, build, write, perform. Don't overthink it.", "Venus and Neptune are opening a genuine creative channel. Use it.", "The best kind of creative day — ideas flow, execution feels easy. Go."],
    good:  ["Good creative conditions. The ideas won't all be gold, but output will be strong.", "Decent day to create. Show up and let the work happen.", "Creative momentum is available. Build on what you've already started."],
    mixed: ["Creative energy is present but inconsistent. Best for refining, not originating.", "Half a day of good creative flow — work while it's there, rest when it goes.", "Not a breakout creative day, but not blocked either. Steady work yields results."],
    bad:   ["Creative blocks are more likely today. Don't force the output.", "Save the important creative work for another day — this one is better for admin.", "Ideas may feel flat or uninspired. That's the energy, not a reflection of your ability."],
    avoid: ["Avoid launching creative work or publishing today. The timing will undercut the work.", "Strong creative blockage energy. Rest and gather ideas — don't force creation now."],
  },
  learning: {
    great: ["Outstanding day for study, exams, and learning. Your mind is sharp and receptive.", "Mercury is strongly supportive — information lands, retention is high. Learn hard today.", "This is the kind of day you want for an exam or major study session. Go all in."],
    good:  ["Good mental energy for learning and growth. Steady focus will yield solid results.", "Decent conditions for study. Not the sharpest day, but capable and clear.", "Information flows reasonably well today. A good session is there if you show up."],
    mixed: ["Focus may be inconsistent today. Break study into shorter, sharper sessions.", "Mixed mental energy — you'll have windows of clarity and moments of fog. Work the windows.", "Not a peak learning day, but not a lost one either. Revise rather than absorb new material."],
    bad:   ["Mental energy is scattered today. Complex learning may not stick well.", "Poor day for exams or important study. If possible, schedule these for another time.", "Cognitive fog or distraction is elevated. Keep tasks simple and expectations realistic."],
    avoid: ["Do not sit important exams today if you have a choice. The mental conditions are poor.", "Avoid starting new educational commitments now — retention and clarity are genuinely low."],
  },
  spiritual: {
    great: ["Deep inner access today — meditation, reflection, and healing work are all amplified.", "The veil is thin. Inner guidance is unusually clear. Make time for silence.", "Exceptional day for spiritual practice, therapy, or any inner work. Go deep."],
    good:  ["Good day for spiritual practice and inner reflection. The signals are supportive.", "Decent reflective energy — journaling, meditation, quiet time all feel rewarding.", "Something in you is ready to be heard today. Give it the space."],
    mixed: ["Spiritual energy is present but distracted. Short practices work better than long ones.", "Inner clarity comes in waves today. Sit with the uncertainty rather than forcing resolution.", "Not the deepest introspective day, but not closed either. Show up with openness."],
    bad:   ["Inner noise is elevated today. Meditation or deep reflection may feel frustrating.", "Not a strong day for spiritual decisions or major inner commitments.", "Rest the inner work today. The signal is weak — forcing it may create more confusion."],
    avoid: ["Avoid major spiritual commitments or healing decisions today. The energy is too distorted.", "This is a day to step back from deep inner work. Rest, recover, and try again soon."],
  },
  financial: {
    great: ["Strong conditions for financial decisions and major purchases. Jupiter supports expansion.", "The planetary weather supports financial commitment today. Move forward with confidence.", "Good day to negotiate, invest, or make a significant purchase. The stars back it."],
    good:  ["Reasonable financial conditions. Not peak, but supported enough to proceed.", "Decent energy for money decisions. Do your due diligence and move.", "Financial momentum is available today. Mid-sized commitments are well-supported."],
    mixed: ["Mixed financial signals. Good for research, less good for committing.", "Proceed with financial caution today — the picture isn't entirely clear.", "Some positive financial energy, but also some friction. Smaller moves are safer."],
    bad:   ["Financial energy is poor today. Avoid major purchases or investment decisions.", "Money decisions made today carry more risk. Delay if at all possible.", "Planetary pressure on financial matters — don't commit to anything you can't walk back."],
    avoid: ["Strongly avoid major financial commitments today. The timing is genuinely bad.", "Do not make significant investments or purchases now. Saturn is working against you."],
  },
};

function getDomainVerdict(score:number, domId:string, tier:number, signals:any[], retroNames:string[], voc:boolean):string {
  const lines = DOMAIN_LINES[domId] || DOMAIN_LINES.career;
  const bucket = score > 30 ? lines.great : score > 10 ? lines.good : score > -10 ? lines.mixed : score > -30 ? lines.bad : lines.avoid;
  // Pick line based on signal count so same domain gives different lines on different days
  const base = bucket[signals.length % bucket.length];

  if(tier === 1) return base;

  // Tier 2 — add one specific planetary note
  const topGreen = signals.find((s:any)=>s.type==="green");
  const topRed = signals.find((s:any)=>s.type==="red"||s.type==="warning");
  const extra = score > 0 && topGreen ? ` Key driver: ${topGreen.text}.` : score <= 0 && topRed ? ` Main concern: ${topRed.text}.` : "";
  const vocNote = voc ? " Void of Course Moon adds a note of caution — actions may not stick." : "";
  if(tier === 2) return base + extra + vocNote;

  // Tier 3 — full paragraph with all context
  const retroNote = retroNames.length > 0 ? ` ${retroNames.join(" and ")} ${retroNames.length>1?"are":"is"} retrograde — review rather than initiate.` : "";
  const signalSummary = signals.length > 0 ? ` There ${signals.length===1?"is 1 active signal":"are "+signals.length+" active signals"} shaping this area today — ${signals.filter((s:any)=>s.type==="green").length} supportive, ${signals.filter((s:any)=>s.type!=="green").length} cautionary.` : "";
  if(tier === 3) return base + extra + retroNote + vocNote + signalSummary;

  // Tier 4 — premium voice, more weight
  const allSignalText = signals.slice(0,2).map((s:any)=>s.text).join(" and ");
  const deepNote = allSignalText ? ` The active planetary forces — ${allSignalText} — are the core of this reading.` : "";
  return base + extra + retroNote + vocNote + deepNote + " Trust your preparation. The oracle reads the sky, not your limits.";
}

// ─── COMPUTATION ENGINE ──────────────────────────────────────────────────────
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
  scoreDomain:(dom:any,natal:any[],transit:any[],date:Date,tier:number,retros:any[],voc:boolean)=>{
    const aspects=Eng.aspects(transit,natal);
    const rel=aspects.filter((a:any)=>dom.rulers.includes(a.p1.name)||dom.rulers.includes(a.p2.name));
    let rawScore=0;const signals:any[]=[];
    rel.forEach((a:any)=>{
      let imp=a.strength*a.asp.power;
      const ben=["Venus","Jupiter","Sun"].includes(a.p1.name);
      if(["flow","opportunity","fusion"].includes(a.asp.nature)){
        if(ben)imp*=1.5;rawScore+=imp;
        signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:+imp.toFixed(1),type:"green",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — supports action (${a.exact}% exact)`,strength:a.strength});
      } else {
        if(["Saturn","Mars","Pluto"].includes(a.p1.name))imp*=1.4;rawScore-=imp;
        signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:-imp.toFixed(1),type:"red",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — caution (${a.exact}% exact)`,strength:a.strength});
      }
    });
    retros.filter((p:any)=>dom.rulers.includes(p.name)).forEach((p:any)=>{
      const pen=p.name==="Mercury"?-8:p.name==="Venus"?-6:p.name==="Mars"?-7:-4;
      rawScore+=pen;
      signals.push({text:`${p.planet?.sym||""} ${p.name} Retrograde`,val:pen,type:"warning",conf:8,detail:p.name==="Mercury"?"Avoid signing — miscommunication risk":p.name==="Venus"?"Re-evaluate, don't commit":p.name==="Mars"?"Action may backfire":"Deep review phase",strength:0.8});
    });
    const mp=Eng.moonPhase(transit),waxing=["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous"].includes(mp.name);
    if(["career","contracts","creative","learning"].includes(dom.id)){
      if(waxing){rawScore+=4;signals.push({text:`${mp.icon} ${mp.name}`,val:4,type:"green",conf:6,detail:"Waxing phase — building energy",strength:0.5});}
      else{rawScore-=3;signals.push({text:`${mp.icon} ${mp.name}`,val:-3,type:"caution",conf:5,detail:"Waning phase — completing not starting",strength:0.4});}
    }
    if(dom.id==="spiritual"&&["Full Moon","Waning Gibbous","Last Quarter"].includes(mp.name)){rawScore+=5;signals.push({text:`${mp.icon} ${mp.name}`,val:5,type:"green",conf:7,detail:"Supports inner work",strength:0.6});}
    if(dom.id==="love"&&mp.name==="Full Moon"){rawScore+=4;signals.push({text:`${mp.icon} Full Moon`,val:4,type:"green",conf:7,detail:"Emotional peak — powerful for connection",strength:0.6});}
    if(voc){rawScore-=6;signals.push({text:"🚫 Void of Course Moon",val:-6,type:"warning",conf:7,detail:"Actions may not stick",strength:0.7});}
    const hrs=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"];
    const dayR=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"][date.getDay()];
    const hR=hrs[(hrs.indexOf(dayR)+date.getHours())%7];
    if(dom.rulers.includes(hR)){rawScore+=3;signals.push({text:`⏰ Planetary Hour of ${hR}`,val:3,type:"green",conf:4,detail:`Hour ruled by ${hR}`,strength:0.3});}

    const norm=Math.max(-100,Math.min(100,rawScore*2.5));

    // CONFIDENCE: genuinely variable — based on how strong and how many signals are present
    // Low signals + weak aspects = low confidence (20-40%)
    // Many strong signals all pointing same way = high confidence (70-85%)
    const gn=signals.filter(s=>s.type==="green");
    const rd=signals.filter(s=>s.type==="red"||s.type==="warning"||s.type==="caution");
    const totalSignalWeight=signals.reduce((s:number,x:any)=>s+Math.abs(x.val),0);
    const directionAgreement=gn.length+rd.length>0?Math.abs(gn.length-rd.length)/(gn.length+rd.length):0;
    // More signals + stronger agreement = higher confidence, but realistic ceiling
    const rawConf = 15 + (totalSignalWeight * 2.2) + (directionAgreement * 25) + (signals.length * 1.5);
    const confidence = Math.min(84, Math.max(18, Math.round(rawConf)));

    const retroNames=retros.map((r:any)=>r.name);
    const verdict=getDomainVerdict(norm,dom.id,tier,signals,retroNames,voc);
    return{score:norm,signals:signals.sort((a:any,b:any)=>Math.abs(b.val)-Math.abs(a.val)),confidence,greenCount:gn.length,redCount:rd.length,totalSignals:signals.length,verdict};
  },
};

// ─── STYLING ─────────────────────────────────────────────────────────────────
const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};
const vColor=(s:number)=>s>30?CL.grn:s>10?"#7ddba3":s>-10?CL.acc:s>-30?"#e5a0a0":CL.red;
const vLabel=(s:number)=>s>30?"Excellent":s>10?"Favorable":s>-10?"Mixed":s>-30?"Caution":"Avoid";
const fmtD=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fmtDL=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

const ConfPill=({confidence,score}:{confidence:number,score:number})=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
    <div style={{fontSize:11,fontWeight:800,color:vColor(score),fontFamily:"system-ui"}}>{vLabel(score)}</div>
    <div style={{background:`${vColor(score)}18`,border:`1px solid ${vColor(score)}50`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,fontFamily:"system-ui",color:vColor(score),whiteSpace:"nowrap"}}>
      {confidence}% confidence
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

// ─── TODAY'S SNAPSHOT — the simple "do this / avoid this" card ───────────────
const TodaySnapshot=({domains,mp,voc,retros}:any)=>{
  const doList=domains.filter((d:any)=>d.score>10).slice(0,4);
  const avoidList=domains.filter((d:any)=>d.score<-5).slice(0,4);
  const neutralList=domains.filter((d:any)=>d.score>=-5&&d.score<=10);
  return(
    <div style={{background:`linear-gradient(160deg,#0a0818,#0f0d1e)`,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}}>
      <SH icon="⚡" title="TODAY AT A GLANCE" sub="What to lean into — and what to leave alone"/>

      {/* DO THIS */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:800,color:CL.grn,fontFamily:"system-ui",letterSpacing:1,marginBottom:8}}>✅ LEAN INTO TODAY</div>
        {doList.length>0?doList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:`${CL.grn}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.grn}`}}>
            <span style={{fontSize:16}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim,marginTop:1}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.grn,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{d.confidence}% conf</div>
          </div>
        )):(
          <div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly favoured areas today — a day for steady, careful work.</div>
        )}
      </div>

      {/* AVOID */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:800,color:CL.red,fontFamily:"system-ui",letterSpacing:1,marginBottom:8}}>🚫 HOLD OFF ON</div>
        {avoidList.length>0?avoidList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:`${CL.red}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.red}`}}>
            <span style={{fontSize:16}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim,marginTop:1}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.red,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{d.confidence}% conf</div>
          </div>
        )):(
          <div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly unfavoured areas — the sky is relatively balanced today.</div>
        )}
      </div>

      {/* NEUTRAL */}
      {neutralList.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:800,color:CL.acc,fontFamily:"system-ui",letterSpacing:1,marginBottom:6}}>⚖️ USE JUDGMENT</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {neutralList.map((d:any)=>(
              <div key={d.id} style={{background:`${CL.acc}10`,border:`1px solid ${CL.acc}30`,borderRadius:20,padding:"4px 12px",fontFamily:"system-ui",fontSize:11,color:CL.acc}}>
                {d.icon} {d.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <HR/>
      {/* Quick sky notes */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <div style={{background:CL.card2,borderRadius:8,padding:"5px 10px",fontSize:10,fontFamily:"system-ui",color:CL.dim}}>
          {mp.icon} <b style={{color:CL.txt}}>{mp.name}</b>
        </div>
        {voc&&<div style={{background:`${CL.red}15`,borderRadius:8,padding:"5px 10px",fontSize:10,fontFamily:"system-ui",color:CL.red}}>🚫 Void of Course Moon</div>}
        {retros.map((r:any)=>(
          <div key={r.name} style={{background:`${CL.acc}15`,borderRadius:8,padding:"5px 10px",fontSize:10,fontFamily:"system-ui",color:CL.acc}}>
            {r.planet?.sym} {r.name} ℞
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
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

  useEffect(()=>{const s=localStorage.getItem(TIER_KEY);if(s)setTier(parseInt(s));},[]);
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
      const allDomains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros,voc)})).sort((a:any,b:any)=>b.score-a.score);
      const domains=tier===2?allDomains.filter((d:any)=>selectedDomains.includes(d.id)):allDomains;
      const overall=domains.reduce((s:number,d:any)=>s+d.score,0)/domains.length;
      const overallConf=Math.min(84,Math.max(18,Math.round(domains.reduce((s:number,d:any)=>s+d.confidence,0)/domains.length)));
      const totalGreen=domains.reduce((s:number,d:any)=>s+d.greenCount,0);
      const totalRed=domains.reduce((s:number,d:any)=>s+d.redCount,0);
      const forecast:any[]=[];
      for(let i=0;i<30;i++){const fd=new Date(tDate);fd.setDate(fd.getDate()+i);const dt=Eng.pos(fd);const fvoc=Eng.voc(dt);const fRetros=dt.filter((p:any)=>p.retro);const ds=DOMAINS.map(dm=>({...dm,...Eng.scoreDomain(dm,natal,dt,fd,tier,fRetros,fvoc)}));const avg=ds.reduce((s:number,x:any)=>s+x.score,0)/ds.length;const best=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);forecast.push({date:fd,overall:avg,best,moonPhase:Eng.moonPhase(dt),domains:ds});}
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
    setTeamMembers(updated);setNewMemberName("");setNewMemberDob("");
    const scores=updated.map((m:any)=>{
      const bDate=new Date(m.dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
      const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
      const voc=Eng.voc(transit),retros=transit.filter((p:any)=>p.retro);
      const ds=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros,voc)}));
      const overall=ds.reduce((s:number,d:any)=>s+d.score,0)/ds.length;
      const topDomain=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);
      const bottomDomain=ds.reduce((b:any,x:any)=>x.score<b.score?x:b,ds[0]);
      const confidence=Math.min(84,Math.max(18,Math.round(ds.reduce((s:number,d:any)=>s+d.confidence,0)/ds.length)));
      return{...m,overall,confidence,topDomain,bottomDomain};
    });
    setTeamData(scores);
  };

  const removeTeamMember=(id:number)=>{
    const updated=teamMembers.filter((m:any)=>m.id!==id);
    setTeamMembers(updated);setTeamData(updated.map((m:any)=>{
      const bDate=new Date(m.dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
      const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
      const voc=Eng.voc(transit),retros=transit.filter((p:any)=>p.retro);
      const ds=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros,voc)}));
      const overall=ds.reduce((s:number,d:any)=>s+d.score,0)/ds.length;
      const topDomain=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);
      const bottomDomain=ds.reduce((b:any,x:any)=>x.score<b.score?x:b,ds[0]);
      const confidence=Math.min(84,Math.max(18,Math.round(ds.reduce((s:number,d:any)=>s+d.confidence,0)/ds.length)));
      return{...m,overall,confidence,topDomain,bottomDomain};
    }));
  };

  const getAiReading=async()=>{
    if(!data)return;setAiLoading(true);setAiReading("");
    const summary=`Tier: ${tier}. Date: ${targetDate}. Overall: ${data.overall.toFixed(0)}. Top: ${data.domains[0].name} (${data.domains[0].score.toFixed(0)}). Bottom: ${data.domains[data.domains.length-1].name} (${data.domains[data.domains.length-1].score.toFixed(0)}). Moon: ${data.mp.name}. Retrogrades: ${data.retros.map((r:any)=>r.name).join(",")||"none"}. VOC: ${data.voc}.`;
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

  const toggleDomain=(id:string)=>{
    if(selectedDomains.includes(id)){if(selectedDomains.length>1)setSelectedDomains(prev=>prev.filter(d=>d!==id));}
    else if(selectedDomains.length<3)setSelectedDomains(prev=>[...prev,id]);
  };

  const tierInfo=TIERS.find(t=>t.id===tier)||TIERS[0];

  return(
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"'Georgia','Palatino',serif",padding:"10px 14px",maxWidth:720,margin:"0 auto"}}>
      <style>{`@keyframes glow{0%,100%{text-shadow:0 0 15px #f6ad3c44}50%{text-shadow:0 0 30px #f6ad3c88,0 0 60px #9b7fe644}}input[type="date"],input[type="text"]{font-family:system-ui}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}*{box-sizing:border-box}`}</style>

      {/* HEADER */}
      <div style={{textAlign:"center",padding:"18px 0 10px"}}>
        <div style={{fontSize:10,letterSpacing:6,color:CL.pur,fontWeight:700,fontFamily:"system-ui"}}>ORACLE v3</div>
        <h1 style={{fontSize:24,fontWeight:400,margin:"4px 0",fontStyle:"italic",background:`linear-gradient(135deg,${CL.acc},${CL.pnk},${CL.pur})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 5s ease infinite"}}>Personal Decision Oracle</h1>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:8,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",letterSpacing:1}}>PLAN:</span>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>selectTier(t.id)} style={{background:tier===t.id?`${t.color}20`:"transparent",color:tier===t.id?t.color:CL.mut,border:`1px solid ${tier===t.id?t.color:CL.bdr}`,borderRadius:20,padding:"3px 12px",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"system-ui",letterSpacing:1}}>
              {t.name}
            </button>
          ))}
        </div>
        <div style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",marginTop:3}}>{tierInfo.desc}</div>
      </div>

      {/* TIER 2 DOMAIN SELECTOR */}
      {tier===2&&(
        <div style={{...SC.card,borderColor:CL.pur+"40"}}>
          <SH icon="🎯" title="YOUR 3 FOCUS AREAS" sub="Pick exactly 3 domains for your deep reading" color={CL.pur}/>
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

      {/* INPUTS */}
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
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",marginBottom:10}}>
          <TB id="reading" label="Full Reading" icon="🔮"/>
          <TB id="shouldi" label="Should I...?" icon="🤔"/>
          <TB id="calendar" label="30-Day" icon="📅"/>
          <TB id="bestdays" label="Best Days" icon="⭐"/>
          <TB id="chart" label="Chart" icon="🌌"/>
          {tier===4&&<TB id="team" label="Team" icon="👥"/>}
        </div>

        {/* ══ FULL READING ══ */}
        {tab==="reading"&&(<>

          {/* TODAY AT A GLANCE — always first */}
          <TodaySnapshot domains={data.allDomains} mp={data.mp} voc={data.voc} retros={data.retros}/>

          {/* Overall metrics */}
          <div style={{...SC.card,background:`linear-gradient(150deg,${CL.card},${data.overall>15?"#0d1a10":data.overall<-15?"#1a0d0d":"#1a1708"})`}}>
            <SH icon="🎯" title="OVERALL READING" sub={fmtDL(new Date(targetDate))} color={vColor(data.overall)}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
              {[
                {label:"OVERALL",value:vLabel(data.overall),color:vColor(data.overall),sub:data.overall>0?`+${data.overall.toFixed(0)} net score`:`${data.overall.toFixed(0)} net score`},
                {label:"CONFIDENCE",value:`${data.overallConf}%`,color:CL.acc,sub:"How decisive the signals are"},
                {label:"SIGNALS",value:`▲${data.totalGreen} / ▼${data.totalRed}`,color:data.totalGreen>data.totalRed?CL.grn:CL.red,sub:`${data.totalGreen} for · ${data.totalRed} against`},
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

          {/* AI interpretation */}
          <div style={{...SC.card,borderColor:CL.pur+"40"}}>
            <SH icon="✨" title="ORACLE AI INTERPRETATION" color={CL.pur}
              sub={tier===1?"Overview reading":tier===2?"Focused on your 3 domains":tier===3?"Full detailed narrative":"Premium Oracle voice"}/>
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
            <SH icon="📋" title="DOMAIN BREAKDOWN" sub={tier===2?"Your 3 focus areas":"All 9 domains — tap any for signal detail"}/>
            {data.domains.map((d:any)=>(
              <div key={d.id} style={{background:CL.card2,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",borderLeft:`4px solid ${vColor(d.score)}`}} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{d.icon} {d.name}</div>
                    <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:1}}>{d.sub}</div>
                  </div>
                  <ConfPill confidence={d.confidence} score={d.score}/>
                </div>
                <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.7,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {d.verdict}
                </div>
                {expanded===d.id&&tier>=2&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${CL.bdr}`}}>
                    <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,fontFamily:"system-ui",marginBottom:6}}>SIGNAL BREAKDOWN — {d.totalSignals} active signals</div>
                    {d.signals.map((s:any,j:number)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"5px 0",borderBottom:`1px solid ${CL.bdr}20`}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"system-ui",fontSize:11.5,fontWeight:700,color:s.type==="green"?CL.grn:s.type==="red"||s.type==="warning"?CL.red:CL.acc}}>{s.text}</div>
                          <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim}}>{s.detail}</div>
                        </div>
                        <div style={{fontWeight:800,fontSize:11,color:s.val>0?CL.grn:CL.red,fontFamily:"system-ui",flexShrink:0}}>{s.val>0?"+":""}{s.val}</div>
                      </div>
                    ))}
                  </div>
                )}
                {expanded===d.id&&tier===1&&(
                  <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${CL.bdr}`,fontFamily:"system-ui",fontSize:11,color:CL.dim,textAlign:"center"}}>
                    Signal breakdown available on Plus and above
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {/* ══ SHOULD I ══ */}
        {tab==="shouldi"&&(
          <div style={SC.card}>
            <SH icon="🤔" title="SHOULD I...?" sub={fmtDL(new Date(targetDate))}/>
            {DOMAINS.filter((d:any)=>tier===2?selectedDomains.includes(d.id):true).map((qd:any)=>{
              const d=data.allDomains.find((x:any)=>x.id===qd.id);if(!d)return null;
              const answer=d.score>30?"Yes — strongly supported":d.score>10?"Likely yes — conditions lean your way":d.score>-10?"Use judgment — it could go either way":d.score>-30?"Probably not — consider waiting":"No — the conditions are against this now";
              return(
                <div key={qd.id} style={{background:CL.card2,borderRadius:12,padding:16,marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{qd.icon} {qd.name}</div>
                    <ConfPill confidence={d.confidence} score={d.score}/>
                  </div>
                  <div style={{fontSize:13,color:vColor(d.score),fontWeight:700,fontFamily:"system-ui",marginBottom:6}}>{answer}</div>
                  <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.7}}>{d.verdict}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ CALENDAR ══ */}
        {tab==="calendar"&&(
          <div style={SC.card}>
            <SH icon="📅" title="30-DAY COSMIC MAP"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:12}}>
              {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:8,color:CL.dim,fontFamily:"system-ui",fontWeight:700}}>{d}</div>)}
              {Array.from({length:data.forecast[0].date.getDay()}).map((_,i)=><div key={"e"+i}/>)}
              {data.forecast.map((day:any,i:number)=>{
                const bg=vColor(day.overall);
                return(<div key={i} onClick={()=>{setTargetDate(day.date.toISOString().split("T")[0]);setTab("reading");}} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:8,cursor:"pointer",background:bg+"15",border:i===0?`2px solid ${CL.acc}`:`1px solid ${bg}20`}}>
                  <div style={{fontSize:11,fontWeight:700,fontFamily:"system-ui"}}>{day.date.getDate()}</div>
                  <div style={{fontSize:7,fontWeight:700,color:bg,fontFamily:"system-ui"}}>{vLabel(day.overall).slice(0,3)}</div>
                  <div style={{fontSize:7}}>{day.moonPhase.icon}</div>
                </div>);
              })}
            </div>
            {data.forecast.slice(0,14).map((day:any,i:number)=>(
              <div key={i} onClick={()=>{setTargetDate(day.date.toISOString().split("T")[0]);setTab("reading");}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:i%2?"transparent":CL.card2,borderRadius:6,cursor:"pointer",marginBottom:2,fontFamily:"system-ui",fontSize:11}}>
                <div style={{minWidth:85,fontWeight:i===0?700:400,color:i===0?CL.acc:CL.txt}}>{fmtD(day.date)}{i===0?" ★":""}</div>
                <div style={{flex:1,height:5,background:CL.bdr,borderRadius:3,overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",left:"50%",width:1,height:"100%",background:CL.mut}}/>
                  <div style={{position:"absolute",left:day.overall>0?"50%":`${50+day.overall/2}%`,width:`${Math.abs(day.overall/2)}%`,height:"100%",background:vColor(day.overall),borderRadius:3}}/>
                </div>
                <span style={{fontSize:9}}>{day.moonPhase.icon}</span>
                <span style={{fontSize:11,fontWeight:700,minWidth:55,textAlign:"right",color:vColor(day.overall)}}>{vLabel(day.overall)}</span>
              </div>
            ))}
          </div>
        )}

        {/* ══ BEST DAYS ══ */}
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
                      <span>{fmtD(d.date)}</span><span style={{fontWeight:800,color:CL.grn}}>{d.conf}% conf</span>
                    </div>))}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:CL.red,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🔴 AVOID</div>
                    {bd.bottom3.map((d:any,i:number)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:CL.red+"0d",borderRadius:6,marginBottom:3,fontFamily:"system-ui",fontSize:11}}>
                      <span>{fmtD(d.date)}</span><span style={{fontWeight:800,color:CL.red}}>{vLabel(d.score)}</span>
                    </div>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ CHART ══ */}
        {tab==="chart"&&(
          <div style={SC.card}>
            <SH icon="🌌" title="NATAL CHART + CURRENT TRANSITS"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
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

        {/* ══ TEAM (Tier 4) ══ */}
        {tab==="team"&&tier===4&&(
          <div style={SC.card}>
            <SH icon="👥" title="TEAM ORACLE" sub="Combined cosmic reading for your group" color={CL.pnk}/>
            {teamMembers.length<5?(
              <div style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginBottom:8}}>Add team member ({teamMembers.length}/5 free · extra members $19.99/mo each)</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input type="text" value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} placeholder="Name" style={{flex:1,minWidth:100,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <input type="date" value={newMemberDob} onChange={e=>setNewMemberDob(e.target.value)} style={{flex:1,minWidth:130,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <button onClick={addTeamMember} disabled={!newMemberName||!newMemberDob} style={{background:`linear-gradient(135deg,${CL.pnk},${CL.pur})`,color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",opacity:!newMemberName||!newMemberDob?0.4:1}}>+ Add</button>
                </div>
              </div>
            ):(
              <div style={{background:`${CL.grn}15`,border:`1px solid ${CL.grn}30`,borderRadius:8,padding:"8px 14px",fontSize:11,color:CL.grn,fontFamily:"system-ui",marginBottom:12}}>✓ Team full (5/5)</div>
            )}
            {teamData.map((m:any)=>(
              <div key={m.id} style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:8,borderLeft:`4px solid ${vColor(m.overall)}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{m.name}</div>
                    <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginTop:2}}>Best: <b style={{color:CL.grn}}>{m.topDomain.icon} {m.topDomain.name}</b> · Challenged: <b style={{color:CL.red}}>{m.bottomDomain.icon} {m.bottomDomain.name}</b></div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <ConfPill confidence={m.confidence} score={m.overall}/>
                    <button onClick={()=>removeTeamMember(m.id)} style={{background:"transparent",border:"none",color:CL.dim,cursor:"pointer",fontSize:14}}>✕</button>
                  </div>
                </div>
                <div style={{fontSize:12,color:CL.txt,fontFamily:"system-ui",lineHeight:1.65,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {m.overall>20?`${m.name} is in strong shape today — high energy, good momentum. Put them front and centre.`:m.overall>0?`${m.name} is steady today — solid in a supporting role, good for collaboration.`:m.overall>-20?`${m.name} has some headwinds today. Better behind the scenes than leading externally.`:`${m.name}'s energy is challenged today. Protect them from high-pressure situations.`}
                </div>
              </div>
            ))}
            {teamData.length>1&&(
              <div style={{...SC.card,marginTop:4,borderColor:CL.pnk+"40"}}>
                <SH icon="🔗" title="TEAM RANKING TODAY" color={CL.pnk} sub="Who leads, who supports, who holds back"/>
                {[...teamData].sort((a:any,b:any)=>b.overall-a.overall).map((m:any,i:number)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${CL.bdr}30`}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`${vColor(m.overall)}20`,border:`2px solid ${vColor(m.overall)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:vColor(m.overall),fontFamily:"system-ui",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,fontFamily:"system-ui"}}>{m.name}</div>
                      <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>{i===0?"🌟 Lead role today":i===teamData.length-1?"🌿 Rest & support today":"⚖️ Collaborative role"}</div>
                    </div>
                    <ConfPill confidence={m.confidence} score={m.overall}/>
                  </div>
                ))}
              </div>
            )}
            {teamData.length===0&&<div style={{textAlign:"center",padding:"30px",color:CL.dim,fontFamily:"system-ui",fontSize:12}}>Add your first team member to begin.</div>}
          </div>
        )}
      </>)}

      <div style={{textAlign:"center",padding:"20px 0 10px",fontSize:10,color:CL.mut,fontFamily:"system-ui"}}>
        <i>"The stars incline, they do not compel."</i>
      </div>
    </div>
  );
}
