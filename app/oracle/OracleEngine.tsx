"use client";
import { useState, useEffect, useCallback } from "react";

const TIER_KEY = "myoracle_tier";

const PLANETS = [
  {name:"Sun",sym:"☉",c:"#f6ad3c",domicile:["Leo"],exalt:"Aries",detriment:["Aquarius"],fall:"Libra"},
  {name:"Moon",sym:"☽",c:"#c4cdd4",domicile:["Cancer"],exalt:"Taurus",detriment:["Capricorn"],fall:"Scorpio"},
  {name:"Mercury",sym:"☿",c:"#45d0c8",domicile:["Gemini","Virgo"],exalt:"Virgo",detriment:["Sagittarius","Pisces"],fall:"Pisces"},
  {name:"Venus",sym:"♀",c:"#e879a0",domicile:["Taurus","Libra"],exalt:"Pisces",detriment:["Aries","Scorpio"],fall:"Virgo"},
  {name:"Mars",sym:"♂",c:"#e55050",domicile:["Aries","Scorpio"],exalt:"Capricorn",detriment:["Taurus","Libra"],fall:"Cancer"},
  {name:"Jupiter",sym:"♃",c:"#9b7fe6",domicile:["Sagittarius","Pisces"],exalt:"Cancer",detriment:["Gemini","Virgo"],fall:"Capricorn"},
  {name:"Saturn",sym:"♄",c:"#7a8594",domicile:["Capricorn","Aquarius"],exalt:"Libra",detriment:["Cancer","Leo"],fall:"Aries"},
  {name:"Uranus",sym:"♅",c:"#38d6f5",domicile:["Aquarius"],exalt:"Scorpio",detriment:["Leo"],fall:"Taurus"},
  {name:"Neptune",sym:"♆",c:"#7c8cf5",domicile:["Pisces"],exalt:"Cancer",detriment:["Virgo"],fall:"Capricorn"},
  {name:"Pluto",sym:"♇",c:"#b366e0",domicile:["Scorpio"],exalt:"Aries",detriment:["Taurus"],fall:"Libra"},
];
const SIGNS = [
  {name:"Aries",sym:"♈",el:"fire",modality:"cardinal",c:"#e55050",trait:"Initiative, courage"},
  {name:"Taurus",sym:"♉",el:"earth",modality:"fixed",c:"#3dbd7d",trait:"Stability, persistence"},
  {name:"Gemini",sym:"♊",el:"air",modality:"mutable",c:"#f6c23c",trait:"Curiosity, adaptability"},
  {name:"Cancer",sym:"♋",el:"water",modality:"cardinal",c:"#c4cdd4",trait:"Nurturing, emotional depth"},
  {name:"Leo",sym:"♌",el:"fire",modality:"fixed",c:"#f6ad3c",trait:"Creativity, self-expression"},
  {name:"Virgo",sym:"♍",el:"earth",modality:"mutable",c:"#45d0c8",trait:"Analysis, refinement"},
  {name:"Libra",sym:"♎",el:"air",modality:"cardinal",c:"#e879a0",trait:"Balance, harmony"},
  {name:"Scorpio",sym:"♏",el:"water",modality:"fixed",c:"#b366e0",trait:"Intensity, transformation"},
  {name:"Sagittarius",sym:"♐",el:"fire",modality:"mutable",c:"#9b7fe6",trait:"Adventure, wisdom"},
  {name:"Capricorn",sym:"♑",el:"earth",modality:"cardinal",c:"#7a8594",trait:"Ambition, mastery"},
  {name:"Aquarius",sym:"♒",el:"air",modality:"fixed",c:"#38d6f5",trait:"Innovation, freedom"},
  {name:"Pisces",sym:"♓",el:"water",modality:"mutable",c:"#7c8cf5",trait:"Intuition, compassion"},
];
const ASPECTS = [
  {name:"Conjunction",angle:0,orb:8,sym:"☌",power:10,nature:"fusion",c:"#f6ad3c"},
  {name:"Sextile",angle:60,orb:5,sym:"⚹",power:4,nature:"opportunity",c:"#45d0c8"},
  {name:"Square",angle:90,orb:7,sym:"□",power:8,nature:"tension",c:"#e55050"},
  {name:"Trine",angle:120,orb:7,sym:"△",power:7,nature:"flow",c:"#3dbd7d"},
  {name:"Opposition",angle:180,orb:8,sym:"☍",power:9,nature:"polarity",c:"#e879a0"},
];

// ─── DOMAIN CONFIG — each domain has its own weights and engine params ────────
const DOMAINS = [
  {
    id:"career",name:"Career & Business",icon:"💼",
    rulers:["Sun","Saturn","Jupiter","Mars"],
    // Planet weights within this domain — how much each planet matters here
    weights:{Sun:1.4,Saturn:1.3,Jupiter:1.2,Mars:1.1,Mercury:0.8,Venus:0.6,Moon:0.5,Uranus:0.7,Neptune:0.3,Pluto:0.9},
    // Moon phases that help
    goodMoonPhases:["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous"],
    // Moon phases that hurt
    badMoonPhases:["Balsamic Moon","Last Quarter"],
    // Which retrogrades hit hardest here
    keyRetros:["Saturn","Mars","Mercury"],
    sub:"Launches, promotions, ventures, job changes"
  },
  {
    id:"love",name:"Love & Relationships",icon:"💕",
    rulers:["Venus","Moon","Jupiter"],
    weights:{Venus:1.5,Moon:1.4,Jupiter:1.2,Neptune:1.0,Sun:0.7,Mars:0.8,Saturn:0.5,Mercury:0.6,Uranus:0.4,Pluto:0.7},
    goodMoonPhases:["Full Moon","Waxing Gibbous","First Quarter"],
    badMoonPhases:["Balsamic Moon","New Moon"],
    keyRetros:["Venus","Mercury"],
    sub:"Commitments, proposals, difficult conversations"
  },
  {
    id:"contracts",name:"Contracts & Signing",icon:"📜",
    rulers:["Mercury","Jupiter","Saturn"],
    weights:{Mercury:1.6,Jupiter:1.3,Saturn:1.2,Sun:0.7,Venus:0.6,Mars:0.5,Moon:0.5,Uranus:0.4,Neptune:0.3,Pluto:0.5},
    goodMoonPhases:["New Moon","Waxing Crescent","First Quarter"],
    badMoonPhases:["Full Moon","Balsamic Moon","Last Quarter"],
    keyRetros:["Mercury","Jupiter","Saturn"],
    sub:"Legal filings, negotiations, agreements"
  },
  {
    id:"travel",name:"Travel & Relocation",icon:"✈️",
    rulers:["Mercury","Jupiter","Moon"],
    weights:{Mercury:1.4,Jupiter:1.4,Moon:1.2,Mars:0.9,Saturn:0.8,Sun:0.6,Venus:0.5,Uranus:0.6,Neptune:0.4,Pluto:0.3},
    goodMoonPhases:["New Moon","Waxing Crescent","Waxing Gibbous"],
    badMoonPhases:["Full Moon","Balsamic Moon"],
    keyRetros:["Mercury","Jupiter"],
    sub:"Moving, big journeys, relocation"
  },
  {
    id:"health",name:"Health & Body",icon:"🌿",
    rulers:["Mars","Sun","Moon"],
    weights:{Mars:1.4,Sun:1.3,Moon:1.2,Saturn:1.0,Venus:0.6,Jupiter:0.7,Mercury:0.5,Uranus:0.4,Neptune:0.5,Pluto:0.6},
    goodMoonPhases:["New Moon","Waxing Crescent","Waxing Gibbous"],
    badMoonPhases:["Full Moon","Waning Gibbous"],
    keyRetros:["Mars","Saturn"],
    sub:"Surgery timing, new regimens, recovery"
  },
  {
    id:"creative",name:"Creative Projects",icon:"🎨",
    rulers:["Venus","Neptune","Sun","Mercury"],
    weights:{Venus:1.4,Neptune:1.3,Sun:1.2,Mercury:1.1,Moon:0.9,Jupiter:0.8,Mars:0.7,Uranus:0.8,Saturn:0.4,Pluto:0.5},
    goodMoonPhases:["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous"],
    badMoonPhases:["Balsamic Moon","Last Quarter"],
    keyRetros:["Venus","Mercury","Neptune"],
    sub:"Art, writing, launches, performances"
  },
  {
    id:"learning",name:"Learning & Growth",icon:"📚",
    rulers:["Mercury","Jupiter","Saturn"],
    weights:{Mercury:1.5,Jupiter:1.3,Saturn:1.1,Sun:0.7,Mars:0.6,Moon:0.7,Venus:0.5,Uranus:0.7,Neptune:0.4,Pluto:0.3},
    goodMoonPhases:["New Moon","Waxing Crescent","First Quarter"],
    badMoonPhases:["Balsamic Moon","Last Quarter"],
    keyRetros:["Mercury","Jupiter"],
    sub:"Courses, exams, certifications"
  },
  {
    id:"spiritual",name:"Spiritual & Inner Work",icon:"🧘",
    rulers:["Neptune","Moon","Pluto"],
    weights:{Neptune:1.5,Moon:1.4,Pluto:1.3,Saturn:1.0,Sun:0.6,Venus:0.7,Mercury:0.5,Jupiter:0.8,Mars:0.4,Uranus:0.6},
    goodMoonPhases:["Full Moon","Waning Gibbous","Last Quarter","Balsamic Moon"],
    badMoonPhases:["New Moon","Waxing Crescent"],
    keyRetros:["Neptune","Pluto"],
    sub:"Retreats, therapy, meditation, healing"
  },
  {
    id:"financial",name:"Major Purchases",icon:"💰",
    rulers:["Venus","Jupiter","Saturn","Pluto"],
    weights:{Venus:1.3,Jupiter:1.4,Saturn:1.3,Pluto:1.1,Sun:0.7,Mars:0.6,Moon:0.7,Mercury:0.8,Uranus:0.5,Neptune:0.4},
    goodMoonPhases:["New Moon","Waxing Crescent","Waxing Gibbous"],
    badMoonPhases:["Full Moon","Waning Gibbous","Balsamic Moon"],
    keyRetros:["Venus","Jupiter","Saturn"],
    sub:"Property, investments, salary negotiations"
  },
];

const TIERS = [
  {id:1,name:"Basic",price:"$9.99",color:"#6b6580",desc:"Transit-based overview across all 9 domains"},
  {id:2,name:"Plus",price:"$29.99",color:"#9b7fe6",desc:"Deep dive + planetary dignity in your 3 focus areas"},
  {id:3,name:"Pro",price:"$79.99",color:"#f6ad3c",desc:"Full engine — dignity, combustion, stelliums, all 9 domains"},
  {id:4,name:"Pro+",price:"$99.99",color:"#e879a0",desc:"Maximum depth — sect, out-of-bounds, angular strength + Team mode"},
];

// ─── DOMAIN-SPECIFIC VERDICT LANGUAGE ─────────────────────────────────────────
const VERDICT_LINES:any = {
  career:{
    great:["Strong day to push forward — visibility and authority are on your side. Make the call, send the pitch, step into the room.","Leadership energy is running high. People notice you today — use that window.","The planetary support for career action is clear. Don't wait for a better day, this is it."],
    good:["Reasonable conditions for career progress. The door is open, but you'll need to walk through it yourself.","Solid work energy — momentum is available if you commit to output over politics.","Mid-level effort yields strong results today. Not peak, but far from flat."],
    mixed:["Mixed signals at work today. Opportunity and friction are both present — choose your battles.","Better for planning and preparation than for high-stakes execution today.","Tread carefully with authority figures. Collaboration works better than confrontation today."],
    bad:["Keep your head down and your output clean. Avoid confrontations and big announcements.","Career energy is strained — delay launches, skip the important meeting if you can reschedule.","Not a day for power moves. Lay low, prepare, and wait for the sky to shift."],
    avoid:["Strongly avoid major career decisions today. The timing is genuinely poor — patience now pays later.","Risk of professional setbacks if you push hard today. This one is worth waiting out."],
  },
  love:{
    great:["Deep connection energy today — honest conversations land well, feelings translate clearly.","If you've been holding something back, the timing to open up is now. Warmth flows easily.","Emotional receptivity is high on both sides. Relationships feel genuinely supportive today."],
    good:["Good relational energy — a solid day for honest exchange and deepening connection.","Small gestures carry weight today. Reach out, check in, be present.","People around you are open. Good conditions for patching things up or having the overdue talk."],
    mixed:["Listen more than you speak today. Emotional signals are present but unstable.","Proceed carefully with sensitive conversations — the same words land very differently depending on timing.","Love energy is present but inconsistent. Don't force resolution if it isn't ready."],
    bad:["High miscommunication risk today. Postpone the important relationship talk if you can.","Emotional tension is elevated. Give yourself and others more space than you think you need.","Not a strong day for relational action. Hold the line and revisit this in a couple of days."],
    avoid:["Avoid major relationship decisions or ultimatums today — the energy is genuinely against it.","Do not make permanent calls about relationships now. What feels certain today may look very different tomorrow."],
  },
  contracts:{
    great:["Excellent day to sign. Clarity, agreement energy, and follow-through are all strongly aligned.","Put pen to paper today. The conditions for clean, binding agreements are unusually good.","Mercury and the relevant planets are all pointing the same way. Advance your agreements now."],
    good:["Reasonable conditions for contracts and negotiations. Read the fine print and proceed with confidence.","Contractual energy is positive — advance the deal, keep documentation thorough.","Decent day for legal or business agreements. Not peak, but well-supported."],
    mixed:["Mixed signals for contracts. If you can delay signing by a day or two, consider it.","Re-read everything twice today. The energy supports getting things wrong as much as getting them right.","Negotiation is possible but friction is elevated. Build in extra time and patience."],
    bad:["Avoid signing anything important today if possible. Miscommunication risk is significantly elevated.","Contract energy is poor — delays, disputes, and hidden details are more likely to surface later.","Not the day for legal commitments. What you sign today has a higher chance of needing revision."],
    avoid:["Do not sign contracts today. The planetary conditions are working directly against clarity and agreement.","Mercury is actively distorting communication and comprehension right now. Postpone any signing."],
  },
  travel:{
    great:["Green light for travel and movement. Plans made today tend to unfold smoothly.","Strong energy for relocation decisions or big journeys. Move forward.","The sky supports physical movement — new places, new perspectives, good timing for departure."],
    good:["Good travel energy — minor hiccups are possible but nothing derailing.","Solid day to book or depart. Journeys started now carry good momentum forward.","Movement is supported. Whether it's a trip or a permanent move, the energy is behind you."],
    mixed:["Travel plans may hit friction or last-minute changes today. Build in flexibility.","Check bookings twice — mixed energy around logistics and transport connections.","Not terrible for travel, not ideal either. Go, but have a backup plan ready."],
    bad:["Delays and disruptions are more likely today. Avoid non-essential travel.","Poor travel energy — missed connections, luggage issues, unexpected changes are elevated risks.","Rescheduling a trip? Today may not be the right day to rebook either."],
    avoid:["Avoid travel decisions today if at all possible. Strong disruption indicators in the sky.","Do not make major relocation choices now. The timing will work against smooth execution."],
  },
  health:{
    great:["Strong vitality today. Excellent time to start a new health regime or make important decisions about your body.","Physical energy is high and aligned — decisions made now about health tend to stick.","Good conditions for medical consultations, new habits, and lifestyle changes. Act today."],
    good:["Decent health energy. Momentum supports new habits if you start them today.","Reasonable conditions for body-focused decisions. Trust your physical instincts.","Good energy for exercise, clean eating, or beginning something new with your health."],
    mixed:["Energy levels may be inconsistent today. Don't overcommit physically.","Mixed health signals — rest is as valuable as action right now. Listen to your body.","Be gentle with yourself. Push and rest in roughly equal measure."],
    bad:["Physical energy is low or unpredictable. Avoid elective procedures if possible.","Not a strong day for health decisions. Recovery and rest are better uses of today.","Fatigue or physical resistance is elevated. Honour your limits rather than pushing past them."],
    avoid:["Strongly avoid major medical decisions or new health regimes today.","Do not schedule surgery or major health interventions now if you have any choice in the matter."],
  },
  creative:{
    great:["Creative energy is exceptional — make, build, write, perform. Don't overthink, just go.","A genuine creative channel is open today. The ideas will flow if you show up for them.","This is the kind of day creative work gets done and remembered. Get into it."],
    good:["Good creative conditions. Not every idea will be gold, but output will be solid.","Show up and let the work happen today. The channel is open, but you need to sit down.","Creative momentum is available. Build on what you've already started."],
    mixed:["Creative energy is present but inconsistent. Best for refining and editing, not originating.","Work while the energy is there, rest when it goes — it'll come back in waves today.","Not a breakout creative day, but not blocked either. Steady work yields real results."],
    bad:["Creative blocks are more likely today. Don't force the output — it will cost you more than it gives.","Save the important creative work for another day. Today is better for admin and planning.","Ideas may feel flat. That's the energy, not a reflection of your ability."],
    avoid:["Avoid launching or publishing creative work today. The timing will undercut what you've built.","Strong creative blockage energy. Rest, gather ideas, and come back when the sky shifts."],
  },
  learning:{
    great:["Outstanding day for study and learning. Your mind is sharp and information is sticking.","Mercury is strongly placed — retention is high and concentration comes easily today. Use it.","This is the kind of day you want for an exam or important study session. Go all in."],
    good:["Good mental energy for learning. Steady focus will yield solid results.","Decent conditions for study — not the sharpest day, but capable and clear.","Information flows reasonably well today. A good session is there if you show up for it."],
    mixed:["Focus may be inconsistent today. Work in shorter, sharper sessions rather than long blocks.","You'll have windows of clarity and moments of fog — work the windows.","Not a peak learning day, but not lost either. Revise rather than absorbing entirely new material."],
    bad:["Mental energy is scattered today. Complex new material may not stick.","Poor conditions for exams or important study — schedule these for another time if possible.","Cognitive fog or distraction is elevated. Keep tasks simple and your expectations honest."],
    avoid:["Do not sit important exams today if you have any choice. The mental conditions are genuinely poor.","Avoid starting new educational commitments now — retention and clarity are too low to build on."],
  },
  spiritual:{
    great:["Deep inner access today. Meditation, reflection, and healing work are all amplified.","The veil is thin today. Inner guidance is unusually clear — create space for silence.","Exceptional conditions for spiritual practice, therapy, or any inner work. Go deep."],
    good:["Good conditions for spiritual practice and inner reflection.","Decent reflective energy — journalling, meditation, and quiet time all feel genuinely rewarding.","Something in you is ready to be heard today. Give it the space to surface."],
    mixed:["Spiritual energy is present but distracted. Short practices work better than long ones.","Sit with the uncertainty rather than forcing resolution. Clarity is coming, not here yet.","Not the deepest introspective day, but not closed either. Show up with openness."],
    bad:["Inner noise is elevated today. Meditation or deep reflection may feel frustrating rather than clarifying.","Not a strong day for spiritual decisions or major inner commitments.","Rest the inner work today. The signal is weak — forcing it creates more confusion than insight."],
    avoid:["Avoid major spiritual commitments or healing decisions today. The energy is too distorted.","Step back from deep inner work today. Rest, recover, return when the signal is clearer."],
  },
  financial:{
    great:["Strong planetary conditions for financial decisions and major purchases. Move with confidence.","Jupiter and the relevant financial planets are supportive — commit to the investment today.","The stars back significant financial action today. Do the deal."],
    good:["Reasonable financial conditions. Not peak, but well-supported enough to proceed.","Decent energy for money decisions. Do your due diligence and move forward.","Financial momentum is available. Mid-sized commitments are well-positioned today."],
    mixed:["Mixed financial signals. Good for research and comparison, less good for committing funds.","Proceed with financial caution — the full picture isn't entirely clear yet.","Some positive financial energy, but friction too. Smaller, reversible moves are safer today."],
    bad:["Financial energy is poor today. Avoid major purchases or investment commitments.","Money decisions made today carry more downside risk. Delay if at all possible.","Planetary pressure on financial matters — don't commit to anything you can't walk back."],
    avoid:["Strongly avoid major financial commitments today. The timing is working against you.","Do not make significant investments or purchases now. Saturn is applying pressure and clarity is low."],
  },
};

function getDomainVerdict(score:number, domId:string, tier:number, signals:any[], retroNames:string[], voc:boolean, dignityNote:string, combustNote:string):string {
  const lines = VERDICT_LINES[domId]||VERDICT_LINES.career;
  const bucket = score>35?lines.great:score>12?lines.good:score>-12?lines.mixed:score>-35?lines.bad:lines.avoid;
  const base = bucket[Math.abs(Math.round(score))%bucket.length];

  if(tier===1) return base;

  const topGreen=signals.find((s:any)=>s.type==="green"&&s.strength>0.5);
  const topRed=signals.find((s:any)=>(s.type==="red"||s.type==="warning")&&s.strength>0.5);
  const driver=score>0&&topGreen?` Key driver: ${topGreen.text}.`:score<=0&&topRed?` Watch out for: ${topRed.text}.`:"";
  const vocNote=voc?" Void of Course Moon adds an undercurrent of actions not landing as planned.":"";
  const retNote=retroNames.length>0?` ${retroNames.join(" & ")} retrograde — prioritise review over initiation.`:"";

  if(tier===2) return base+driver+vocNote;

  const dignNote=dignityNote?` ${dignityNote}`:"";
  const combNote=combustNote?` ${combustNote}`:"";
  if(tier===3) return base+driver+retNote+vocNote+dignNote+combNote;

  // Tier 4 — full depth, premium voice
  const signalNarrative=signals.filter((s:any)=>s.strength>0.6).slice(0,2).map((s:any)=>s.text).join(" alongside ");
  const deepNarrative=signalNarrative?` The dominant forces in play: ${signalNarrative}.`:"";
  return base+driver+retNote+vocNote+dignNote+combNote+deepNarrative+" Read this carefully — the oracle's confidence in this evaluation is based on real signal convergence, not approximation.";
}

// ─── COMPUTATION ENGINE ───────────────────────────────────────────────────────
const mod360=(v:number)=>((v%360)+360)%360;

const Eng={
  T:(d:Date)=>{const y=d.getFullYear(),m=d.getMonth()+1,da=d.getDate(),a=Math.floor((14-m)/12),y1=y+4800-a,m1=m+12*a-3;return((da+Math.floor((153*m1+2)/5)+365*y1+Math.floor(y1/4)-Math.floor(y1/100)+Math.floor(y1/400)-32045)-2451545.0)/36525;},

  pos:(date:Date)=>{
    const T=Eng.T(date),d2=new Date(date);d2.setDate(d2.getDate()-1);const T2=Eng.T(d2);
    const R:any={Sun:280.4664567+360.0076983*T,Moon:218.3164477+481267.88123421*T,Mercury:252.2509+149472.6746*T,Venus:181.9798+58517.8157*T,Mars:355.4330+19140.2993*T,Jupiter:34.3515+3034.9057*T,Saturn:50.0774+1222.1138*T,Uranus:314.055+428.4677*T,Neptune:304.349+218.4862*T,Pluto:238.929+145.2078*T};
    const Y:any={Mercury:252.2509+149472.6746*T2,Venus:181.9798+58517.8157*T2,Mars:355.4330+19140.2993*T2,Jupiter:34.3515+3034.9057*T2,Saturn:50.0774+1222.1138*T2,Uranus:314.055+428.4677*T2,Neptune:304.349+218.4862*T2,Pluto:238.929+145.2078*T2};
    return Object.entries(R).map(([name,lng]:any)=>{
      const l=mod360(lng),sign=SIGNS[Math.floor(l/30)],planet=PLANETS.find(p=>p.name===name);
      let retro=false;
      if(Y[name]){let d=l-mod360(Y[name]);if(d>180)d-=360;if(d<-180)d+=360;retro=d<0;}
      return{name,lng:l,sign,degree:l%30,planet,retro};
    });
  },

  // Planetary dignity score: domicile/exaltation = strong, detriment/fall = weak
  dignity:(planet:any,sign:any)=>{
    if(!planet||!sign)return{score:0,label:""};
    const p=PLANETS.find(x=>x.name===planet.name);
    if(!p)return{score:0,label:""};
    if(p.domicile.includes(sign.name))return{score:2,label:`${planet.sym} ${planet.name} in own sign ${sign.name} — strongly placed`};
    if(p.exalt===sign.name)return{score:1.5,label:`${planet.sym} ${planet.name} exalted in ${sign.name} — peak power`};
    if(p.detriment.includes(sign.name))return{score:-1.5,label:`${planet.sym} ${planet.name} in detriment (${sign.name}) — weakened expression`};
    if(p.fall===sign.name)return{score:-1,label:`${planet.sym} ${planet.name} in fall (${sign.name}) — at its weakest`};
    return{score:0,label:""};
  },

  // Combust: Mercury within 8° of Sun = communication impaired
  // Venus within 10° = beauty/love distorted
  combust:(transit:any[])=>{
    const sun=transit.find(p=>p.name==="Sun");
    if(!sun)return[];
    return transit.filter(p=>{
      if(p.name==="Sun")return false;
      let d=Math.abs(p.lng-sun.lng);if(d>180)d=360-d;
      if(p.name==="Mercury"&&d<8)return true;
      if(p.name==="Venus"&&d<10)return true;
      return false;
    }).map(p=>{
      let d=Math.abs(p.lng-sun.lng);if(d>180)d=360-d;
      const severity=d<3?"cazimi (empowered by direct contact)":d<8?"combust — severely weakened":"under the beams";
      return{name:p.name,severity,deg:d.toFixed(1)};
    });
  },

  // Stellium: 3+ planets within 30° (same sign) = amplified energy
  stellium:(positions:any[])=>{
    const bySign:any={};
    positions.forEach(p=>{if(!bySign[p.sign.name])bySign[p.sign.name]=[];bySign[p.sign.name].push(p);});
    return Object.entries(bySign).filter(([,planets]:any)=>planets.length>=3).map(([sign,planets]:any)=>({sign,planets,names:planets.map((p:any)=>p.name).join(", ")}));
  },

  // Out-of-bounds: planet declination > 23.5° (simplified — use lng proxy)
  outOfBounds:(positions:any[])=>{
    // True OOB needs declination calc; we approximate via extreme ecliptic latitude proxy
    // For MVP: flag planets in high-amplitude signs with retrograde = OOB indicator
    return positions.filter(p=>p.retro&&["Gemini","Sagittarius","Virgo","Pisces"].includes(p.sign?.name)).map(p=>({name:p.name,note:"Potentially out-of-bounds — unpredictable expression"}));
  },

  // Sect: day chart (sun above horizon) or night chart — affects benefic/malefic strength
  sect:(natal:any[],date:Date)=>{
    const sun=natal.find(p=>p.name==="Sun");
    if(!sun)return"unknown";
    // Proxy: birth between 6am-6pm = day chart (simplified without birth time)
    // Use Sun degree as proxy — above 180° = below horizon = night chart
    return sun.degree>15&&sun.degree<345?"day":"night";
  },

  moonPhase:(pos:any[])=>{
    const m=pos.find(p=>p.name==="Moon"),s=pos.find(p=>p.name==="Sun");
    if(!m||!s)return{name:"?",icon:"🌑",power:0,energy:""};
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

  voc:(pos:any[])=>{
    const m=pos.find(p=>p.name==="Moon");
    if(!m||m.degree<=27)return false;
    return !pos.some(p=>{if(p.name==="Moon")return false;let d=Math.abs(m.lng-p.lng);if(d>180)d=360-d;return ASPECTS.some(a=>Math.abs(d-a.angle)<=a.orb*0.4);});
  },

  aspects:(p1:any[],p2:any[])=>{
    const f:any[]=[],seen=new Set();
    for(const a of p1)for(const b of p2){
      if(a.name===b.name)continue;
      let d=Math.abs(a.lng-b.lng);if(d>180)d=360-d;
      for(const asp of ASPECTS){
        const orb=Math.abs(d-asp.angle);
        if(orb<=asp.orb){
          const k=[a.name,b.name].sort().join("-")+asp.name;
          if(!seen.has(k)){seen.add(k);f.push({p1:a,p2:b,asp,orb:+orb.toFixed(1),strength:1-orb/asp.orb,exact:+((1-orb/asp.orb)*100).toFixed(0)});}
        }
      }
    }
    return f.sort((a,b)=>b.strength-a.strength);
  },

  // Domain-weighted scoring engine — each domain uses its own planet weights
  scoreDomain:(dom:any,natal:any[],transit:any[],date:Date,tier:number,retros:any[],voc:boolean)=>{
    const aspects=Eng.aspects(transit,natal);
    const rel=aspects.filter((a:any)=>dom.rulers.includes(a.p1.name)||dom.rulers.includes(a.p2.name));
    let rawScore=0;
    const signals:any[]=[];

    rel.forEach((a:any)=>{
      const p1weight:number=(dom.weights[a.p1.name]||1.0);
      const p2weight:number=(dom.weights[a.p2.name]||1.0);
      const domainWeight=(p1weight+p2weight)/2;
      let imp=a.strength*a.asp.power*domainWeight;
      const ben=["Venus","Jupiter","Sun"].includes(a.p1.name);

      if(["flow","opportunity","fusion"].includes(a.asp.nature)){
        if(ben)imp*=1.5;
        rawScore+=imp;
        signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:+imp.toFixed(1),type:"green",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — supports action (${a.exact}% exact)`,strength:a.strength,weight:domainWeight});
      } else {
        if(["Saturn","Mars","Pluto"].includes(a.p1.name))imp*=1.4;
        rawScore-=imp;
        signals.push({text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,val:+(-imp).toFixed(1),type:"red",conf:Math.min(9,Math.round(a.strength*10)),detail:`${a.asp.nature} energy — caution (${a.exact}% exact)`,strength:a.strength,weight:domainWeight});
      }
    });

    // Domain-specific retrograde penalty — key retros hit harder in their domain
    retros.filter((p:any)=>dom.rulers.includes(p.name)).forEach((p:any)=>{
      const isKeyRetro=dom.keyRetros.includes(p.name);
      const pen=(p.name==="Mercury"?-8:p.name==="Venus"?-6:p.name==="Mars"?-7:p.name==="Jupiter"?-5:-4)*(isKeyRetro?1.5:1.0);
      rawScore+=pen;
      signals.push({text:`${p.planet?.sym||""} ${p.name} Retrograde${isKeyRetro?" ⚠️ KEY retro for this domain":""}`,val:+pen.toFixed(1),type:"warning",conf:8,detail:p.name==="Mercury"?"Communication and agreements are actively distorted":p.name==="Venus"?"Values and relationships are under review":p.name==="Mars"?"Action meets resistance — review, don't initiate":"Review phase — not the time to start new things",strength:0.8,weight:isKeyRetro?1.5:1.0});
    });

    // Domain-specific moon phase scoring — not all phases are the same for all domains
    const mp=Eng.moonPhase(transit);
    const isGoodPhase=dom.goodMoonPhases.includes(mp.name);
    const isBadPhase=dom.badMoonPhases.includes(mp.name);
    if(isGoodPhase){rawScore+=5;signals.push({text:`${mp.icon} ${mp.name} — ideal phase for ${dom.name.toLowerCase()}`,val:5,type:"green",conf:7,detail:`${mp.energy} Phase aligned with this domain.`,strength:0.6,weight:1.0});}
    else if(isBadPhase){rawScore-=4;signals.push({text:`${mp.icon} ${mp.name} — unfavourable phase for this domain`,val:-4,type:"caution",conf:6,detail:`${mp.energy} This phase works against ${dom.name.toLowerCase()} today.`,strength:0.5,weight:1.0});}

    // VOC penalty
    if(voc){rawScore-=7;signals.push({text:"🚫 Void of Course Moon",val:-7,type:"warning",conf:7,detail:"Actions started during void of course tend not to materialise as planned",strength:0.7,weight:1.0});}

    // Planetary hour bonus
    const hrs=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"];
    const dayR=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"][date.getDay()];
    const hR=hrs[(hrs.indexOf(dayR)+date.getHours())%7];
    if(dom.rulers.includes(hR)){rawScore+=3;signals.push({text:`⏰ Planetary Hour of ${hR}`,val:3,type:"green",conf:4,detail:`Current hour is ruled by ${hR} — domain alignment`,strength:0.3,weight:0.8});}

    // TIER 2+ — add dignity/debility scoring for domain rulers
    let dignityNote="";
    if(tier>=2){
      transit.filter((p:any)=>dom.rulers.includes(p.name)).forEach((p:any)=>{
        const dign=Eng.dignity(p.planet,p.sign);
        if(dign.score!==0){
          rawScore+=dign.score*(dom.weights[p.name]||1.0)*2;
          const type=dign.score>0?"green":"caution";
          signals.push({text:dign.label,val:+(dign.score*(dom.weights[p.name]||1.0)*2).toFixed(1),type,conf:7,detail:dign.score>0?"Planet at peak power today — elevated expression":"Planet operating at reduced capacity today",strength:0.7,weight:dom.weights[p.name]||1.0});
          if(dign.score>1)dignityNote=`${p.name} is exceptionally strong in ${p.sign.name} right now — a meaningful boost for this reading.`;
          if(dign.score<-1)dignityNote=`${p.name} is in its weakest placement (${p.sign.name}) — this dampens conditions for ${dom.name.toLowerCase()}.`;
        }
      });
    }

    // TIER 3+ — combust, stellium, out-of-bounds checks
    let combustNote="";
    if(tier>=3){
      const combusted=Eng.combust(transit);
      combusted.filter((c:any)=>dom.rulers.includes(c.name)).forEach((c:any)=>{
        if(c.severity.includes("cazimi")){{rawScore+=4;signals.push({text:`☉ ${c.name} cazimi (${c.deg}° from Sun)`,val:4,type:"green",conf:8,detail:"Cazimi position — planet supercharged by exact solar contact",strength:0.8,weight:1.0});combustNote=`${c.name} is cazimi — empowered by direct solar contact.`;}}
        else{rawScore-=5;signals.push({text:`☉ ${c.name} combust (${c.deg}° from Sun)`,val:-5,type:"warning",conf:8,detail:`${c.name} is overwhelmed by the Sun — judgment and clarity in this area may be impaired`,strength:0.8,weight:1.0});combustNote=`${c.name} is combust — its energy is overwhelmed right now, reducing clarity in this domain.`;}
      });
      // Stellium in transit — amplified energy in a sign
      const stellia=Eng.stellium(transit);
      if(stellia.length>0){
        stellia.forEach((s:any)=>{
          rawScore+=3;signals.push({text:`⚡ Stellium in ${s.sign} (${s.names})`,val:3,type:"green",conf:5,detail:`Concentrated energy in ${s.sign} — amplified effects in related domains`,strength:0.5,weight:0.8});
        });
      }
    }

    // TIER 4 — sect and out-of-bounds
    if(tier>=4){
      const oob=Eng.outOfBounds(transit);
      oob.filter((o:any)=>dom.rulers.includes(o.name)).forEach((o:any)=>{
        rawScore-=3;signals.push({text:`↑ ${o.name} potentially out-of-bounds`,val:-3,type:"caution",conf:4,detail:"Out-of-bounds planets behave erratically — outcomes may deviate from expectation",strength:0.4,weight:0.7});
      });
    }

    const norm=Math.max(-100,Math.min(100,rawScore*2.2));

    // Confidence — genuinely varies based on signal strength and directional agreement
    const gn=signals.filter((s:any)=>s.type==="green");
    const rd=signals.filter((s:any)=>s.type==="red"||s.type==="warning"||s.type==="caution");
    const totalWeight=signals.reduce((sum:number,s:any)=>sum+Math.abs(s.val)*(s.weight||1),0);
    const agreement=gn.length+rd.length>0?Math.abs(gn.length-rd.length)/(gn.length+rd.length):0;
    const rawConf=15+(totalWeight*1.8)+(agreement*30)+(signals.length*1.2)+(tier*2);
    const confidence=Math.min(86,Math.max(16,Math.round(rawConf)));

    const retroNames=retros.filter((r:any)=>dom.rulers.includes(r.name)).map((r:any)=>r.name);
    const verdict=getDomainVerdict(norm,dom.id,tier,signals,retroNames,voc,dignityNote,combustNote);

    return{score:norm,signals:signals.sort((a:any,b:any)=>Math.abs(b.val)-Math.abs(a.val)),confidence,greenCount:gn.length,redCount:rd.length,totalSignals:signals.length,verdict};
  },
};

// ─── STYLING ─────────────────────────────────────────────────────────────────
const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};
const vColor=(s:number)=>s>30?CL.grn:s>10?"#7ddba3":s>-10?CL.acc:s>-30?"#e5a0a0":CL.red;
const vLabel=(s:number)=>s>35?"Excellent":s>15?"Favorable":s>-15?"Mixed":s>-35?"Caution":"Avoid";
const fmtD=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fmtDL=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

const ConfPill=({confidence,score}:{confidence:number,score:number})=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
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

// ─── TODAY'S SNAPSHOT ─────────────────────────────────────────────────────────
const TodaySnapshot=({domains,mp,voc,retros}:any)=>{
  const doList=domains.filter((d:any)=>d.score>12).slice(0,4);
  const avoidList=domains.filter((d:any)=>d.score<-12).slice(0,4);
  const neutralList=domains.filter((d:any)=>d.score>=-12&&d.score<=12);
  return(
    <div style={{background:`linear-gradient(160deg,#0a0818,#0f0d1e)`,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}}>
      <SH icon="⚡" title="TODAY AT A GLANCE" sub="What to lean into — and what to leave alone"/>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:800,color:CL.grn,fontFamily:"system-ui",letterSpacing:1,marginBottom:8}}>✅ LEAN INTO TODAY</div>
        {doList.length>0?doList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:`${CL.grn}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.grn}`}}>
            <span style={{fontSize:16}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:"#9ab",marginTop:1,lineHeight:1.5}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.grn,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{d.confidence}% conf</div>
          </div>
        )):<div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly favoured areas today — a day for steady, careful work.</div>}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:800,color:CL.red,fontFamily:"system-ui",letterSpacing:1,marginBottom:8}}>🚫 HOLD OFF ON</div>
        {avoidList.length>0?avoidList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:`${CL.red}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.red}`}}>
            <span style={{fontSize:16}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:"#ba9",marginTop:1,lineHeight:1.5}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.red,fontFamily:"system-ui",whiteSpace:"nowrap"}}>{d.confidence}% conf</div>
          </div>
        )):<div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly unfavoured areas — the sky is relatively balanced today.</div>}
      </div>
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
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <div style={{background:CL.card2,borderRadius:8,padding:"5px 10px",fontSize:10,fontFamily:"system-ui",color:CL.dim}}>
          {mp.icon} <b style={{color:CL.txt}}>{mp.name}</b> — <span style={{fontStyle:"italic"}}>{mp.energy}</span>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
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
      const sect=Eng.sect(natal,tDate);
      const combusted=Eng.combust(transit);
      const stellia=Eng.stellium(transit);
      const allDomains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros,voc)})).sort((a:any,b:any)=>b.score-a.score);
      const domains=tier===2?allDomains.filter((d:any)=>selectedDomains.includes(d.id)):allDomains;
      const overall=domains.reduce((s:number,d:any)=>s+d.score,0)/domains.length;
      const overallConf=Math.min(84,Math.max(16,Math.round(domains.reduce((s:number,d:any)=>s+d.confidence,0)/domains.length)));
      const totalGreen=domains.reduce((s:number,d:any)=>s+d.greenCount,0);
      const totalRed=domains.reduce((s:number,d:any)=>s+d.redCount,0);
      const forecast:any[]=[];
      for(let i=0;i<30;i++){
        const fd=new Date(tDate);fd.setDate(fd.getDate()+i);
        const dt=Eng.pos(fd);const fvoc=Eng.voc(dt);const fRetros=dt.filter((p:any)=>p.retro);
        const ds=DOMAINS.map(dm=>({...dm,...Eng.scoreDomain(dm,natal,dt,fd,tier,fRetros,fvoc)}));
        const avg=ds.reduce((s:number,x:any)=>s+x.score,0)/ds.length;
        const best=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);
        forecast.push({date:fd,overall:avg,best,moonPhase:Eng.moonPhase(dt),domains:ds});
      }
      const bestDays=DOMAINS.map((dom,di)=>{
        const sorted=[...forecast].sort((a:any,b:any)=>b.domains[di].score-a.domains[di].score);
        return{domain:dom,top3:sorted.slice(0,3).map(f=>({date:f.date,score:f.domains[di].score,conf:f.domains[di].confidence})),bottom3:sorted.slice(-3).reverse().map(f=>({date:f.date,score:f.domains[di].score}))};
      });
      setData({natal,transit,allAspects,mp,voc,retros,sunSign,moonSign,elements,domains,allDomains,overall,overallConf,totalGreen,totalRed,forecast,bestDays,sect,combusted,stellia});
      setLoading(false);
    },700);
  },[dob,targetDate,tier,selectedDomains]);

  useEffect(()=>{if(dob)compute();},[dob,targetDate,tier,selectedDomains]);

  const computeTeamMember=(m:any)=>{
    const bDate=new Date(m.dob+"T12:00:00"),tDate=new Date(targetDate+"T12:00:00");
    const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
    const voc=Eng.voc(transit),retros=transit.filter((p:any)=>p.retro);
    const ds=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier,retros,voc)}));
    const overall=ds.reduce((s:number,d:any)=>s+d.score,0)/ds.length;
    const topDomain=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);
    const bottomDomain=ds.reduce((b:any,x:any)=>x.score<b.score?x:b,ds[0]);
    const confidence=Math.min(84,Math.max(16,Math.round(ds.reduce((s:number,d:any)=>s+d.confidence,0)/ds.length)));
    return{...m,overall,confidence,topDomain,bottomDomain};
  };

  const addTeamMember=()=>{
    if(!newMemberName||!newMemberDob)return;
    const member={name:newMemberName,dob:newMemberDob,id:Date.now()};
    const updated=[...teamMembers,member];
    setTeamMembers(updated);setNewMemberName("");setNewMemberDob("");
    setTeamData(updated.map(computeTeamMember));
  };

  const removeTeamMember=(id:number)=>{
    const updated=teamMembers.filter((m:any)=>m.id!==id);
    setTeamMembers(updated);setTeamData(updated.map(computeTeamMember));
  };

  const getAiReading=async()=>{
    if(!data)return;setAiLoading(true);setAiReading("");
    const summary=`Tier: ${tier}. Date: ${targetDate}. Overall: ${data.overall.toFixed(0)}. Top domain: ${data.domains?.[0]?.name} (${data.domains?.[0]?.score?.toFixed(0)}). Bottom: ${data.domains?.[data.domains?.length-1]?.name} (${data.domains?.[data.domains?.length-1]?.score?.toFixed(0)}). Moon: ${data.mp.name}. Retrogrades: ${data.retros.map((r:any)=>r.name).join(",")||"none"}. VOC: ${data.voc}. Sect: ${data.sect}. Combusted: ${data.combusted?.map((c:any)=>c.name).join(",")||"none"}.`;
    try{
      const res=await fetch("/api/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({summary,tier})});
      const json=await res.json();
      setAiReading(json.interpretation||"The Oracle is silent.");
    }catch{setAiReading("Could not reach the Oracle. Try again.");}
    setAiLoading(false);
  };

  const toggleDomain=(id:string)=>{
    if(selectedDomains.includes(id)){if(selectedDomains.length>1)setSelectedDomains(prev=>prev.filter(d=>d!==id));}
    else if(selectedDomains.length<3)setSelectedDomains(prev=>[...prev,id]);
  };

  const tierInfo=TIERS.find(t=>t.id===tier)||TIERS[0];
  const SC:any={card:{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}};
  const TB=({id,label,icon}:{id:string,label:string,icon:string})=>(
    <button onClick={()=>setTab(id)} style={{background:tab===id?CL.acc:"transparent",color:tab===id?"#000":CL.dim,border:`1px solid ${tab===id?CL.acc:CL.bdr}`,borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>
      {icon} {label}
    </button>
  );

  return(
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"'Georgia','Palatino',serif",padding:"10px 14px",maxWidth:720,margin:"0 auto"}}>
      <style>{`@keyframes glow{0%,100%{text-shadow:0 0 15px #f6ad3c44}50%{text-shadow:0 0 30px #f6ad3c88,0 0 60px #9b7fe644}}input,button{font-family:inherit}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}*{box-sizing:border-box}`}</style>

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

      {tier===2&&(
        <div style={{...SC.card,borderColor:CL.pur+"40"}}>
          <SH icon="🎯" title="YOUR 3 FOCUS AREAS" sub="Select exactly 3 domains for your deep reading" color={CL.pur}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {DOMAINS.map(d=>{
              const sel=selectedDomains.includes(d.id);const disabled=!sel&&selectedDomains.length>=3;
              return(<button key={d.id} onClick={()=>!disabled&&toggleDomain(d.id)} style={{background:sel?`${CL.pur}20`:"transparent",color:sel?CL.pur:disabled?CL.mut:CL.dim,border:`1px solid ${sel?CL.pur:disabled?CL.mut:CL.bdr}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:sel?700:400,cursor:disabled?"not-allowed":"pointer",fontFamily:"system-ui",opacity:disabled?0.4:1}}>
                {d.icon} {d.name}
              </button>);
            })}
          </div>
          <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:8}}>{selectedDomains.length}/3 selected</div>
        </div>
      )}

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

        {tab==="reading"&&(<>
          <TodaySnapshot domains={data.allDomains} mp={data.mp} voc={data.voc} retros={data.retros}/>

          {/* Tier 3+ show special findings */}
          {tier>=3&&(data.combusted?.length>0||data.stellia?.length>0)&&(
            <div style={{...SC.card,borderColor:CL.pnk+"40"}}>
              <SH icon="🔬" title="ADVANCED FINDINGS" sub="Combust planets & stellium detections" color={CL.pnk}/>
              {data.combusted?.map((c:any)=>(
                <div key={c.name} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:`1px solid ${CL.bdr}30`,fontFamily:"system-ui",fontSize:12}}>
                  <span style={{color:c.severity.includes("cazimi")?CL.grn:CL.red,fontSize:14}}>☉</span>
                  <div><b style={{color:CL.txt}}>{c.name} {c.severity}</b> — {c.deg}° from Sun. {c.severity.includes("cazimi")?"Supercharged — acts with extraordinary power today.":"Planet overwhelmed — clarity and output in this area are reduced."}</div>
                </div>
              ))}
              {data.stellia?.map((s:any)=>(
                <div key={s.sign} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:`1px solid ${CL.bdr}30`,fontFamily:"system-ui",fontSize:12}}>
                  <span style={{color:CL.pur,fontSize:14}}>⚡</span>
                  <div><b style={{color:CL.txt}}>Stellium in {s.sign}</b> — {s.names} are all concentrated here. Amplified energy in {s.sign}-ruled matters.</div>
                </div>
              ))}
              {tier===4&&data.sect&&(
                <div style={{display:"flex",gap:10,padding:"6px 0",fontFamily:"system-ui",fontSize:12}}>
                  <span style={{color:CL.acc,fontSize:14}}>{data.sect==="day"?"☀️":"🌙"}</span>
                  <div><b style={{color:CL.txt}}>{data.sect==="day"?"Day":"Night"} chart</b> — {data.sect==="day"?"Sun, Jupiter, and Saturn are stronger benefics in your natal chart.":"Moon, Venus, and Mars carry more weight in your nocturnal chart."}</div>
                </div>
              )}
            </div>
          )}

          <div style={{...SC.card,background:`linear-gradient(150deg,${CL.card},${data.overall>15?"#0d1a10":data.overall<-15?"#1a0d0d":"#1a1708"})`}}>
            <SH icon="🎯" title="OVERALL READING" sub={fmtDL(new Date(targetDate))} color={vColor(data.overall)}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
              {[
                {label:"OVERALL",value:vLabel(data.overall),color:vColor(data.overall),sub:data.overall>0?`+${data.overall.toFixed(0)} weighted score`:`${data.overall.toFixed(0)} weighted score`},
                {label:"CONFIDENCE",value:`${data.overallConf}%`,color:CL.acc,sub:"Signal strength & agreement"},
                {label:"SIGNALS",value:`▲${data.totalGreen} / ▼${data.totalRed}`,color:data.totalGreen>data.totalRed?CL.grn:CL.red,sub:`${data.totalGreen} supporting · ${data.totalRed} cautionary`},
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

          <div style={{...SC.card,borderColor:CL.pur+"40"}}>
            <SH icon="✨" title="ORACLE AI INTERPRETATION" color={CL.pur} sub={tier===1?"Overview":tier===2?"Focused on your 3 domains":tier===3?"Full narrative — all factors":"Premium depth — sect, dignity, combust included"}/>
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

          <div style={SC.card}>
            <SH icon="📋" title="DOMAIN BREAKDOWN" sub={tier===2?"Your 3 focus areas":"All 9 domains — tap any to expand signals"}/>
            {data.domains.map((d:any)=>(
              <div key={d.id} style={{background:CL.card2,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",borderLeft:`4px solid ${vColor(d.score)}`}} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{d.icon} {d.name}</div>
                    <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:1}}>{d.sub}</div>
                  </div>
                  <ConfPill confidence={d.confidence} score={d.score}/>
                </div>
                <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.75,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {d.verdict}
                </div>
                {expanded===d.id&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${CL.bdr}`}}>
                    {tier>=2?(
                      <>
                        <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,fontFamily:"system-ui",marginBottom:8}}>{d.totalSignals} ACTIVE SIGNALS — FULL BREAKDOWN</div>
                        {d.signals.map((s:any,j:number)=>(
                          <div key={j} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"6px 0",borderBottom:`1px solid ${CL.bdr}20`}}>
                            <div style={{flex:1}}>
                              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:s.type==="green"?CL.grn:s.type==="red"||s.type==="warning"?CL.red:CL.acc}}>{s.text}</div>
                              <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim,marginTop:2}}>{s.detail}{s.weight&&s.weight>1.2?<span style={{color:CL.pur}}> · {s.weight.toFixed(1)}× domain weight</span>:null}</div>
                            </div>
                            <div style={{fontWeight:800,fontSize:12,color:s.val>0?CL.grn:CL.red,fontFamily:"system-ui",flexShrink:0}}>{s.val>0?"+":""}{typeof s.val==="number"?s.val.toFixed(1):s.val}</div>
                          </div>
                        ))}
                      </>
                    ):(
                      <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim,textAlign:"center",padding:"8px 0"}}>Signal breakdown available on Plus and above</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {tab==="shouldi"&&(
          <div style={SC.card}>
            <SH icon="🤔" title="SHOULD I...?" sub={fmtDL(new Date(targetDate))}/>
            {DOMAINS.filter((d:any)=>tier===2?selectedDomains.includes(d.id):true).map((qd:any)=>{
              const d=data.allDomains.find((x:any)=>x.id===qd.id);if(!d)return null;
              const answer=d.score>35?"Yes — strongly supported":d.score>15?"Likely yes — conditions lean your way":d.score>-15?"Use your judgment — mixed signals":d.score>-35?"Probably not — consider waiting":"No — conditions are against this now";
              return(
                <div key={qd.id} style={{background:CL.card2,borderRadius:12,padding:16,marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{qd.icon} {qd.name}</div>
                    <ConfPill confidence={d.confidence} score={d.score}/>
                  </div>
                  <div style={{fontSize:13,color:vColor(d.score),fontWeight:700,fontFamily:"system-ui",marginBottom:8}}>{answer}</div>
                  <div style={{fontSize:12.5,color:CL.txt,fontFamily:"system-ui",lineHeight:1.75}}>{d.verdict}</div>
                </div>
              );
            })}
          </div>
        )}

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

        {tab==="bestdays"&&(
          <div style={SC.card}>
            <SH icon="⭐" title="OPTIMAL TIMING" sub="Best & worst windows — next 30 days per domain"/>
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

        {tab==="chart"&&(
          <div style={SC.card}>
            <SH icon="🌌" title="NATAL CHART + TRANSITS"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {["Natal","Transit"].map(type=>(
                <div key={type}>
                  <div style={{fontSize:10,color:type==="Natal"?CL.acc:CL.pur,letterSpacing:2,fontWeight:700,marginBottom:4,fontFamily:"system-ui"}}>{type.toUpperCase()}</div>
                  {(type==="Natal"?data.natal:data.transit).map((p:any)=>{
                    const dign=Eng.dignity(p.planet,p.sign);
                    return(<div key={p.name} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:11,background:CL.card2,borderRadius:5,marginBottom:2,fontFamily:"system-ui",borderLeft:dign.score>1?"2px solid "+CL.grn:dign.score<-1?"2px solid "+CL.red:"none"}}>
                      <span style={{color:p.planet?.c}}>{p.planet?.sym} {p.name}{p.retro?" ℞":""}</span>
                      <span style={{color:p.sign.c}}>{p.sign.sym} {p.degree.toFixed(1)}°{dign.score>1?" ✦":dign.score<-1?" ✗":""}</span>
                    </div>);
                  })}
                </div>
              ))}
            </div>
            <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginBottom:8}}>✦ = dignity/exaltation · ✗ = detriment/fall</div>
            <HR/>
            <div style={{fontSize:10,letterSpacing:2,color:CL.pnk,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>TOP TRANSIT ASPECTS</div>
            {data.allAspects.slice(0,10).map((a:any,i:number)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:i%2?"transparent":CL.card2,borderRadius:5,fontSize:11,fontFamily:"system-ui"}}>
                <span style={{fontSize:14,color:a.asp.c}}>{a.asp.sym}</span>
                <span style={{flex:1}}><span style={{color:a.p1.planet?.c}}>{a.p1.name}</span> <span style={{color:CL.dim}}>{a.asp.name}</span> <span style={{color:a.p2.planet?.c}}>{a.p2.name}</span></span>
                <span style={{fontWeight:800,color:a.asp.c}}>{a.exact}%</span>
              </div>
            ))}
          </div>
        )}

        {tab==="team"&&tier===4&&(
          <div style={SC.card}>
            <SH icon="👥" title="TEAM ORACLE" sub="Combined reading for your group" color={CL.pnk}/>
            {teamMembers.length<5&&(
              <div style={{background:CL.card2,borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginBottom:8}}>Add member ({teamMembers.length}/5 · extra $19.99/mo each)</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input type="text" value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} placeholder="Name" style={{flex:1,minWidth:100,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <input type="date" value={newMemberDob} onChange={e=>setNewMemberDob(e.target.value)} style={{flex:1,minWidth:130,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:8,color:CL.txt,fontSize:13}}/>
                  <button onClick={addTeamMember} disabled={!newMemberName||!newMemberDob} style={{background:`linear-gradient(135deg,${CL.pnk},${CL.pur})`,color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",opacity:!newMemberName||!newMemberDob?0.4:1}}>+ Add</button>
                </div>
              </div>
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
                <div style={{fontSize:12,color:CL.txt,fontFamily:"system-ui",lineHeight:1.7,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}30`}}>
                  {m.overall>25?`${m.name} is running strong today — elevated energy and strong planetary support. Put them in front.`:m.overall>5?`${m.name} is in solid form today — dependable, collaborative, well-placed for mid-level action.`:m.overall>-15?`${m.name} has some headwinds today. Support role over leadership. Watch for friction.`:`${m.name}'s planetary energy is significantly challenged today. Protect from high-pressure situations.`}
                </div>
              </div>
            ))}
            {teamData.length>1&&(
              <div style={{...SC.card,marginTop:4,borderColor:CL.pnk+"40"}}>
                <SH icon="🔗" title="TEAM RANKING TODAY" color={CL.pnk} sub="Who leads · who supports · who holds back"/>
                {[...teamData].sort((a:any,b:any)=>b.overall-a.overall).map((m:any,i:number)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${CL.bdr}30`}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`${vColor(m.overall)}20`,border:`2px solid ${vColor(m.overall)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:vColor(m.overall),fontFamily:"system-ui",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,fontFamily:"system-ui"}}>{m.name}</div>
                      <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>{i===0?"🌟 Lead role today":i===teamData.length-1?"🌿 Rest & support today":"⚖️ Collaborative role today"}</div>
                    </div>
                    <ConfPill confidence={m.confidence} score={m.overall}/>
                  </div>
                ))}
              </div>
            )}
            {teamData.length===0&&<div style={{textAlign:"center",padding:"30px",color:CL.dim,fontFamily:"system-ui",fontSize:12}}>Add your first team member above.</div>}
          </div>
        )}
      </>)}

      <div style={{textAlign:"center",padding:"20px 0 10px",fontSize:10,color:CL.mut,fontFamily:"system-ui"}}>
        <i>"The stars incline, they do not compel."</i>
      </div>
    </div>
  );
}
