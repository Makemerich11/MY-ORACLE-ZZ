"use client";
import { useState, useEffect, useCallback } from "react";

const TIER_KEY = "myoracle_tier";

// ─────────────────────────────────────────────────────────────────────────────
// PLANET & SIGN DATA
// ─────────────────────────────────────────────────────────────────────────────
const PLANETS = [
  {name:"Sun",sym:"☉",c:"#f6ad3c",nature:"benefic",dignity:{Leo:2,Aries:1.5}},
  {name:"Moon",sym:"☽",c:"#c4cdd4",nature:"neutral",dignity:{Cancer:2,Taurus:1.5}},
  {name:"Mercury",sym:"☿",c:"#45d0c8",nature:"neutral",dignity:{Gemini:2,Virgo:2,Aquarius:1.2}},
  {name:"Venus",sym:"♀",c:"#e879a0",nature:"benefic",dignity:{Taurus:2,Libra:2,Pisces:1.5}},
  {name:"Mars",sym:"♂",c:"#e55050",nature:"malefic",dignity:{Aries:2,Capricorn:1.5,Scorpio:1.3}},
  {name:"Jupiter",sym:"♃",c:"#9b7fe6",nature:"benefic",dignity:{Sagittarius:2,Pisces:2,Cancer:1.5}},
  {name:"Saturn",sym:"♄",c:"#7a8594",nature:"malefic",dignity:{Capricorn:2,Aquarius:1.8,Libra:1.3}},
  {name:"Uranus",sym:"♅",c:"#38d6f5",nature:"neutral",dignity:{Aquarius:1.5}},
  {name:"Neptune",sym:"♆",c:"#7c8cf5",nature:"neutral",dignity:{Pisces:1.5}},
  {name:"Pluto",sym:"♇",c:"#b366e0",nature:"malefic",dignity:{Scorpio:1.5}},
];
const SIGNS = [
  {name:"Aries",sym:"♈",el:"fire",mod:"cardinal",c:"#e55050",trait:"Initiative, courage"},
  {name:"Taurus",sym:"♉",el:"earth",mod:"fixed",c:"#3dbd7d",trait:"Stability, persistence"},
  {name:"Gemini",sym:"♊",el:"air",mod:"mutable",c:"#f6c23c",trait:"Curiosity, adaptability"},
  {name:"Cancer",sym:"♋",el:"water",mod:"cardinal",c:"#c4cdd4",trait:"Nurturing, emotional depth"},
  {name:"Leo",sym:"♌",el:"fire",mod:"fixed",c:"#f6ad3c",trait:"Creativity, self-expression"},
  {name:"Virgo",sym:"♍",el:"earth",mod:"mutable",c:"#45d0c8",trait:"Analysis, refinement"},
  {name:"Libra",sym:"♎",el:"air",mod:"cardinal",c:"#e879a0",trait:"Balance, harmony"},
  {name:"Scorpio",sym:"♏",el:"water",mod:"fixed",c:"#b366e0",trait:"Intensity, transformation"},
  {name:"Sagittarius",sym:"♐",el:"fire",mod:"mutable",c:"#9b7fe6",trait:"Adventure, wisdom"},
  {name:"Capricorn",sym:"♑",el:"earth",mod:"cardinal",c:"#7a8594",trait:"Ambition, mastery"},
  {name:"Aquarius",sym:"♒",el:"air",mod:"fixed",c:"#38d6f5",trait:"Innovation, freedom"},
  {name:"Pisces",sym:"♓",el:"water",mod:"mutable",c:"#7c8cf5",trait:"Intuition, compassion"},
];
const MAJOR_ASPECTS = [
  {name:"Conjunction",angle:0,orb:8,sym:"☌",power:10,nature:"amplify",c:"#f6ad3c"},
  {name:"Sextile",angle:60,orb:5,sym:"⚹",power:4,nature:"opportunity",c:"#45d0c8"},
  {name:"Square",angle:90,orb:7,sym:"□",power:8,nature:"tension",c:"#e55050"},
  {name:"Trine",angle:120,orb:7,sym:"△",power:7,nature:"flow",c:"#3dbd7d"},
  {name:"Opposition",angle:180,orb:8,sym:"☍",power:9,nature:"polarity",c:"#e879a0"},
];
const MINOR_ASPECTS = [
  {name:"Semisextile",angle:30,orb:2,sym:"⌂",power:2,nature:"mild",c:"#6b6580"},
  {name:"Semisquare",angle:45,orb:2,sym:"∠",power:3,nature:"friction",c:"#e5a0a0"},
  {name:"Sesquiquadrate",angle:135,orb:2,sym:"⊡",power:3,nature:"friction",c:"#e5a0a0"},
  {name:"Quincunx",angle:150,orb:3,sym:"⚻",power:4,nature:"adjustment",c:"#9b7fe6"},
];
const TIERS = [
  {id:1,name:"Basic",price:"$9.99",color:"#6b6580",desc:"Overview across all 9 domains"},
  {id:2,name:"Plus",price:"$29.99",color:"#9b7fe6",desc:"Deep dive into your 3 chosen areas"},
  {id:3,name:"Pro",price:"$79.99",color:"#f6ad3c",desc:"Full detailed analysis + minor aspects"},
  {id:4,name:"Pro+",price:"$99.99",color:"#e879a0",desc:"Full synthesis + midpoints + team mode"},
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN DEFINITIONS — each with its own scoring weights and rules
// ─────────────────────────────────────────────────────────────────────────────
const DOMAINS:any[] = [
  {
    id:"career",name:"Career & Business",icon:"💼",
    sub:"Launches, promotions, ventures, job changes",
    rulers:["Sun","Saturn","Jupiter","Mars"],
    // How much each transiting planet matters for THIS domain (multiplier)
    planetWeights:{Sun:1.8,Jupiter:1.6,Saturn:1.5,Mars:1.4,Mercury:0.8,Venus:0.6,Moon:0.9,Pluto:1.3,Uranus:1.0,Neptune:0.5},
    // Domain-specific retrograde penalties
    retroPenalty:{Mercury:-4,Mars:-10,Saturn:-7,Jupiter:-5},
    // Moon phase bonuses unique to this domain
    moonBonus:{
      "New Moon":+6,     // Strong — new beginnings in career
      "Waxing Crescent":+4,
      "First Quarter":+3,
      "Waxing Gibbous":+5,
      "Full Moon":-2,    // Not ideal — too much emotion
      "Waning Gibbous":-1,
      "Last Quarter":-4,
      "Balsamic Moon":-6,
    },
    bestSign:"Capricorn", // When Saturn or Sun is in this sign, bonus
    verdicts:{
      great:["This is a power day professionally. Visibility, authority, and forward momentum are all working in your favour. Move on the big thing.","Strong career conditions — the planetary support for professional action is unusually clear today. Push the important initiative.","Excellent professional energy. Your efforts land harder and your presence reads as more authoritative. Use it."],
      good:["Decent career conditions today. Not peak, but the door is open — show up with intention and you'll find traction.","Reasonable professional momentum. Mid-level effort yields solid results. Good day for steady progress.","Career energy is supportive. Launch smaller initiatives, have useful conversations, build momentum."],
      mixed:["Career energy is split today — some green lights, some friction. Choose your battles carefully and avoid forcing major announcements.","Mixed professional signals. Better for internal work and planning than external-facing moves.","Tread carefully with authority figures or high-stakes presentations today. Collaborative work is better than solo pushes."],
      bad:["Keep your head down professionally today. Avoid confrontations, postpone big announcements, and focus on execution over strategy.","Career energy is strained. Delay launches, skip the important pitch if you can, and protect your reputation.","Not a day to make power moves at work. The planets are working against visibility and authority."],
      avoid:["Strongly avoid major career decisions or public moves today. The timing is genuinely poor and could set things back.","Do not launch, announce, or push for promotion today. Wait for clearer conditions — they're coming."],
    },
  },
  {
    id:"love",name:"Love & Relationships",icon:"💕",
    sub:"Commitments, proposals, difficult conversations",
    rulers:["Venus","Moon","Jupiter"],
    planetWeights:{Venus:2.0,Moon:1.8,Jupiter:1.4,Neptune:1.2,Sun:0.9,Mars:0.8,Saturn:0.7,Mercury:0.6,Pluto:1.1,Uranus:0.8},
    retroPenalty:{Venus:-12,Mercury:-5,Mars:-6,Neptune:-4},
    moonBonus:{
      "New Moon":+3,
      "Waxing Crescent":+4,
      "First Quarter":+2,
      "Waxing Gibbous":+5,
      "Full Moon":+8,    // Full Moon is exceptional for love
      "Waning Gibbous":+2,
      "Last Quarter":-3,
      "Balsamic Moon":-5,
    },
    bestSign:"Libra",
    verdicts:{
      great:["Deep connection energy today — emotional availability is high and honest conversations land well. If you've been waiting for the right moment, this is it.","Venus is strong and the conditions for love are genuinely rare. A proposal, a difficult truth, a reconnection — all supported.","Relationship energy is unusually warm today. People feel more reachable, more open. Use this."],
      good:["Good relational conditions — a solid day for meaningful exchange and honest conversation.","Love and friendship feel lighter and more receptive today. Small gestures carry extra weight.","People around you are open. Good day for patching things up, deepening a bond, or finally saying something important."],
      mixed:["Emotional signals are mixed. Listen more than you speak in close relationships today — you may not have the full picture.","Proceed carefully with sensitive conversations — timing is everything, and today's energy can amplify misunderstandings.","Love energy is present but unstable. Don't force resolution. Let things breathe."],
      bad:["High chance of miscommunication in relationships. Postpone the difficult conversation if at all possible.","Emotional tension is elevated today. Give yourself and others a bit more space than usual.","Not a strong day for romantic action or important relationship moves. The energy is reactive."],
      avoid:["Avoid major relationship decisions or confrontations today — the planetary conditions are genuinely working against you.","Do not issue ultimatums or make permanent relationship calls today. Wait for Venus to clear."],
    },
  },
  {
    id:"contracts",name:"Contracts & Signing",icon:"📜",
    sub:"Legal filings, negotiations, agreements, deals",
    rulers:["Mercury","Jupiter","Saturn"],
    planetWeights:{Mercury:2.2,Jupiter:1.6,Saturn:1.5,Sun:0.7,Venus:0.5,Mars:0.8,Moon:0.6,Pluto:0.9,Uranus:1.1,Neptune:0.4},
    retroPenalty:{Mercury:-18,Saturn:-10,Jupiter:-8,Mars:-5},// Mercury rx is CATASTROPHIC here
    moonBonus:{
      "New Moon":+2,
      "Waxing Crescent":+3,
      "First Quarter":+4, // Good — decisive action
      "Waxing Gibbous":+3,
      "Full Moon":-4,    // Too emotional for contracts
      "Waning Gibbous":-3,
      "Last Quarter":-6,
      "Balsamic Moon":-8,
    },
    bestSign:"Gemini",
    verdicts:{
      great:["Excellent day to sign. Mercury, Jupiter, and Saturn are all supportive — clarity, expansion, and structure are aligned. Put pen to paper.","The conditions for clean, binding agreements are unusually good today. Proceed with confidence.","Legal and contractual energy is exceptional. Negotiate hard, sign what's ready, advance all outstanding agreements."],
      good:["Reasonable day to advance contractual matters. Read everything carefully but the fundamentals are supportive.","Decent contract energy. Good day to negotiate, exchange drafts, or move things along.","Conditions support contractual action today. Not the best day of the month, but far better than average."],
      mixed:["Mixed signals for signing. If you can delay by a day or two, consider it — but if you must proceed, go line-by-line.","Proceed with any agreements carefully today. Build in extra review time and have counsel check the details.","Negotiation is possible but friction is more likely than usual. Expect delays and counter-offers."],
      bad:["Avoid signing anything important today if possible. Miscommunication and misunderstanding risk is elevated.","Poor contract energy — delays, disputes, and things you missed on first read are all more likely.","Things signed today may need revisiting. If the deal can wait, let it wait."],
      avoid:["Do not sign contracts today. Seriously — the planetary conditions, especially Mercury, are strongly against clean agreements.","This is not the day for legal commitments. The risk of disputes, errors, or misaligned expectations is genuinely high."],
    },
  },
  {
    id:"travel",name:"Travel & Relocation",icon:"✈️",
    sub:"Moving house, big journeys, relocation decisions",
    rulers:["Mercury","Jupiter","Moon"],
    planetWeights:{Mercury:1.6,Jupiter:1.8,Moon:1.5,Mars:1.0,Saturn:1.2,Sun:0.8,Venus:0.7,Uranus:1.3,Neptune:0.6,Pluto:0.5},
    retroPenalty:{Mercury:-12,Jupiter:-7,Moon:0,Saturn:-5,Mars:-6},
    moonBonus:{
      "New Moon":+5,     // Good for new journeys
      "Waxing Crescent":+4,
      "First Quarter":+3,
      "Waxing Gibbous":+2,
      "Full Moon":+1,
      "Waning Gibbous":-2,
      "Last Quarter":-5,
      "Balsamic Moon":-7, // Very bad for travel
    },
    bestSign:"Sagittarius",
    verdicts:{
      great:["Green light for travel and movement today. Plans made now tend to go smoothly — book it, pack it, go.","Strong travel energy — journeys started today carry good momentum and arrive with minimal drama.","The stars support physical movement and relocation decisions. Act on the travel plan you've been holding."],
      good:["Good travel conditions — minor hiccups possible but nothing derailing today.","Solid day to plan, book, or depart. Movement energy is with you.","Travel is favoured. Whether it's a journey or a move, the energy supports forward motion."],
      mixed:["Travel plans may hit delays or changes today. Build in flexibility and don't over-schedule.","Check bookings twice — mixed energy around transport and logistics.","Not ideal travel conditions, but not blocked either. Go with a solid backup plan."],
      bad:["Delays and disruptions are more likely than usual today. Avoid non-essential travel.","Travel energy is poor — expect friction around transport, bookings, or last-minute changes.","If you have flexibility, reschedule. If not, leave extra time for everything."],
      avoid:["Avoid travel decisions and departures today if at all possible. Strong indicators of disruption and misdirection.","Do not make relocation choices today. The planetary conditions are genuinely unfavourable for decisive moves."],
    },
  },
  {
    id:"health",name:"Health & Body",icon:"🌿",
    sub:"Surgery timing, new regimens, recovery, lifestyle changes",
    rulers:["Mars","Sun","Moon"],
    planetWeights:{Mars:1.8,Sun:1.6,Moon:1.7,Saturn:1.3,Jupiter:1.0,Venus:0.6,Mercury:0.5,Pluto:1.2,Uranus:0.9,Neptune:0.7},
    retroPenalty:{Mars:-12,Sun:0,Saturn:-7,Pluto:-5},
    moonBonus:{
      "New Moon":+6,    // Best for starting new health routines
      "Waxing Crescent":+5,
      "First Quarter":+3,
      "Waxing Gibbous":+4,
      "Full Moon":+1,   // High energy but also emotional
      "Waning Gibbous":+2, // Good for detox/release
      "Last Quarter":+3,   // Good for releasing bad habits
      "Balsamic Moon":-3,  // Rest, not new starts
    },
    bestSign:"Virgo",
    verdicts:{
      great:["Strong vitality today — an excellent time to start a new health routine, schedule a procedure, or make a serious body commitment. The energy is behind you.","Physical energy is high and aligned. Decisions about your body made today have staying power.","The best kind of health day — vitality is clear, willpower is accessible, and new habits started now tend to stick."],
      good:["Decent health energy today. Momentum supports new habits if you begin now.","Reasonable conditions for body-related decisions. Trust your physical instincts today.","Good energy for exercise, clean eating, or beginning something new health-wise."],
      mixed:["Energy levels may be inconsistent today. Don't over-commit physically — work with what's there.","Mixed health signals — rest is as valuable as action right now.","Be gentle with your body today. Push and rest in equal measure, and don't schedule anything too intense."],
      bad:["Physical energy is low or unpredictable. Avoid elective procedures and major new commitments if possible.","Not a strong day for health decisions. Recovery and rest are better uses of your energy today.","Fatigue or physical resistance is more likely. Honour your limits — don't force the output."],
      avoid:["Strongly avoid scheduling surgery or starting major new health regimes today.","Do not make significant medical or lifestyle decisions now. Wait for Mars and the Sun to clear this pattern."],
    },
  },
  {
    id:"creative",name:"Creative Projects",icon:"🎨",
    sub:"Art, writing, launches, performances, publishing",
    rulers:["Venus","Neptune","Sun","Mercury"],
    planetWeights:{Venus:1.8,Neptune:1.7,Sun:1.5,Mercury:1.3,Moon:1.2,Jupiter:1.1,Mars:0.9,Saturn:0.7,Uranus:1.4,Pluto:0.8},
    retroPenalty:{Mercury:-6,Venus:-10,Neptune:-4,Mars:-4},
    moonBonus:{
      "New Moon":+7,    // Exceptional for creative beginnings
      "Waxing Crescent":+5,
      "First Quarter":+4,
      "Waxing Gibbous":+5,
      "Full Moon":+6,   // Full Moon can be creative peak too
      "Waning Gibbous":+1,
      "Last Quarter":-3,
      "Balsamic Moon":-4,
    },
    bestSign:"Pisces",
    verdicts:{
      great:["Creative energy is exceptional today — make, build, write, perform. Don't overthink, just output. This is a rare alignment.","Venus and Neptune are opening a genuine creative channel. Whatever you make today will carry an unusual quality of life.","The best kind of creative day. Ideas arrive complete, execution feels effortless, and the work itself is better than usual. Go."],
      good:["Good creative conditions. Show up and let the work happen — it won't all be gold but the seam is there.","Decent creative momentum today. Build on what you've already started, or launch something new.","Creative energy is available and supportive. Lean into it — this is a better day than most for making things."],
      mixed:["Creative energy is present but inconsistent. Best for refinement and editing rather than originating from scratch.","Half a day of good creative flow — work while it's there, don't push when it drops.","Not a breakout creative day, but not blocked either. Show up, do the work, lower your expectations slightly."],
      bad:["Creative blocks are more likely today. Don't force the output — forced work now tends to need heavy rewriting later.","Better day for admin and logistics than creation. Save the important creative work for when the sky clears.","Ideas may feel flat. That's the energy, not you. Rest and gather — don't mistake the weather for your ability."],
      avoid:["Avoid launching or publishing creative work today. The timing will undercut the work itself.","Strong creative blockage in the planetary picture. Rest, absorb, be an audience today. Create tomorrow."],
    },
  },
  {
    id:"learning",name:"Learning & Growth",icon:"📚",
    sub:"Courses, exams, study, certifications, mentoring",
    rulers:["Mercury","Jupiter","Saturn"],
    planetWeights:{Mercury:2.0,Jupiter:1.6,Saturn:1.4,Sun:0.9,Moon:0.8,Mars:0.7,Venus:0.5,Uranus:1.1,Neptune:0.6,Pluto:0.5},
    retroPenalty:{Mercury:-14,Jupiter:-7,Saturn:-6},
    moonBonus:{
      "New Moon":+5,
      "Waxing Crescent":+4,
      "First Quarter":+6, // Best — sharp, focused decision energy
      "Waxing Gibbous":+3,
      "Full Moon":-2,    // Too much distraction
      "Waning Gibbous":-1,
      "Last Quarter":-4,
      "Balsamic Moon":-6,
    },
    bestSign:"Gemini",
    verdicts:{
      great:["Outstanding day for study, exams, and learning. Mercury and Jupiter are aligned — your mind is unusually sharp, retention is high, and insight comes more easily. Learn hard today.","Cognitive conditions are excellent. This is the kind of day you want for an exam, an important lesson, or any intensive learning effort.","The best kind of mental day. New information lands clearly and sticks. Push whatever knowledge project you're working on."],
      good:["Good mental energy for study and growth today. Steady focus will yield solid results.","Decent conditions for learning. Information flows reasonably well — a productive study session is there if you show up.","Reasonable learning conditions. Not the sharpest day, but more than capable for focused work."],
      mixed:["Focus may be inconsistent today. Break your study into shorter, sharper sessions rather than long blocks.","Mixed mental energy — windows of clarity interspersed with fog. Work the windows.","Not a peak learning day, but not a lost one. Revise and consolidate rather than absorbing lots of new material."],
      bad:["Mental energy is scattered today. Complex new learning may not stick well.","Poor day for exams or important study sessions if you have the choice to reschedule.","Cognitive fog or distraction is elevated. Keep tasks simple and lower your expectations of output today."],
      avoid:["Do not sit important exams today if you have any choice in the matter. Mercury is working against clear thinking.","Avoid starting new educational commitments now — retention is genuinely poor and confusion is likely."],
    },
  },
  {
    id:"spiritual",name:"Spiritual & Inner Work",icon:"🧘",
    sub:"Retreats, therapy, meditation, healing, deep reflection",
    rulers:["Neptune","Moon","Pluto"],
    planetWeights:{Neptune:2.0,Moon:1.8,Pluto:1.6,Saturn:1.0,Jupiter:1.2,Sun:0.8,Venus:0.9,Mercury:0.6,Mars:0.5,Uranus:1.1},
    retroPenalty:{Neptune:-5,Pluto:-6,Moon:0,Saturn:-4},
    moonBonus:{
      "New Moon":+4,
      "Waxing Crescent":+2,
      "First Quarter":+1,
      "Waxing Gibbous":+3,
      "Full Moon":+9,    // Full Moon is exceptional for inner work
      "Waning Gibbous":+7,
      "Last Quarter":+6, // Strong — releasing, completing cycles
      "Balsamic Moon":+8, // Perfect for spiritual work
    },
    bestSign:"Pisces",
    verdicts:{
      great:["Deep inner access today — meditation, reflection, and healing work are all unusually amplified. The veil is thin. Make time for silence.","Neptune and the Moon are opening a rare channel inward. This is a day for therapy, deep journaling, spiritual practice, or simply sitting with what's true.","Exceptional day for inner work. Insight arrives easily, emotional clarity is available, and whatever you're working through has more light on it today."],
      good:["Good day for spiritual practice and inner reflection. The signals are supportive — show up to your practice.","Decent reflective energy today. Journaling, meditation, quiet time — all feel rewarding.","Something in you is ready to be heard today. Give it the space."],
      mixed:["Spiritual energy is present but distracted. Short practices work better than long immersive ones.","Inner clarity comes in waves today. Sit with the uncertainty rather than forcing resolution.","Not the deepest introspective day, but open. Gentle practice over intense inquiry."],
      bad:["Inner noise is elevated today. Meditation or deep reflection may feel more frustrating than settling.","Not a strong day for spiritual commitments or deep inner work. Surface-level rest is the medicine.","The signal is weak today. Don't force insight — it will come when the sky clears."],
      avoid:["Avoid major spiritual or healing commitments today. The energy is too distorted for deep work.","This is a day to step back from inner work. Rest, recover, and return when Neptune's picture is cleaner."],
    },
  },
  {
    id:"financial",name:"Major Purchases",icon:"💰",
    sub:"Property, vehicles, investments, salary negotiations",
    rulers:["Venus","Jupiter","Saturn","Pluto"],
    planetWeights:{Jupiter:1.8,Venus:1.7,Saturn:1.6,Pluto:1.4,Sun:0.8,Mars:0.7,Mercury:0.9,Moon:0.6,Uranus:1.2,Neptune:0.4},
    retroPenalty:{Venus:-10,Jupiter:-8,Saturn:-9,Mercury:-6,Pluto:-7},
    moonBonus:{
      "New Moon":+4,
      "Waxing Crescent":+4,
      "First Quarter":+5, // Good — decisive
      "Waxing Gibbous":+4,
      "Full Moon":-3,    // Emotional spending risk
      "Waning Gibbous":-2,
      "Last Quarter":-5,
      "Balsamic Moon":-7, // Worst for financial commitment
    },
    bestSign:"Capricorn",
    verdicts:{
      great:["Strong conditions for financial decisions and major purchases today. Jupiter and Saturn are both supportive — expansion and structure are aligned. Move forward with confidence.","The planetary weather supports financial commitment today. This is one of the stronger days this month for investments, negotiations, or large purchases.","Good day to negotiate, invest, or commit financially. The signals are clear and supportive."],
      good:["Reasonable financial conditions today. Do your due diligence and proceed — the fundamentals are supportive.","Decent energy for money decisions. Not peak, but well above the baseline. Mid-sized commitments are well-supported.","Financial momentum is available. Research, negotiate, and advance what's ready."],
      mixed:["Mixed financial signals today. Good for research and planning, less good for committing to large numbers.","Proceed with financial caution — the picture isn't entirely clear. Smaller moves are safer than large ones.","Some positive financial energy, some friction. Go with what you've already researched — don't start new due diligence today."],
      bad:["Financial energy is poor today. Avoid major purchases, investments, or salary negotiations if possible.","Money decisions made today carry elevated risk. Delay if you can — there are better days ahead.","Planetary pressure on financial matters today. Don't sign, don't transfer, don't commit to anything you can't walk back."],
      avoid:["Strongly avoid major financial commitments today. Saturn and Venus are both working against clear-headed financial judgment.","Do not make significant investments or large purchases now. The timing is genuinely bad and the risk of overpaying or under-researching is high."],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const mod360=(v:number)=>((v%360)+360)%360;

const Eng={
  T:(d:Date)=>{
    const y=d.getFullYear(),m=d.getMonth()+1,da=d.getDate();
    const a=Math.floor((14-m)/12),y1=y+4800-a,m1=m+12*a-3;
    return((da+Math.floor((153*m1+2)/5)+365*y1+Math.floor(y1/4)-Math.floor(y1/100)+Math.floor(y1/400)-32045)-2451545.0)/36525;
  },
  pos:(date:Date)=>{
    const T=Eng.T(date),d2=new Date(date);d2.setDate(d2.getDate()-1);const T2=Eng.T(d2);
    const R:any={
      Sun:280.4664567+360.0076983*T,Moon:218.3164477+481267.88123421*T,
      Mercury:252.2509+149472.6746*T,Venus:181.9798+58517.8157*T,
      Mars:355.4330+19140.2993*T,Jupiter:34.3515+3034.9057*T,
      Saturn:50.0774+1222.1138*T,Uranus:314.055+428.4677*T,
      Neptune:304.349+218.4862*T,Pluto:238.929+145.2078*T
    };
    const Y:any={
      Mercury:252.2509+149472.6746*T2,Venus:181.9798+58517.8157*T2,
      Mars:355.4330+19140.2993*T2,Jupiter:34.3515+3034.9057*T2,
      Saturn:50.0774+1222.1138*T2,Uranus:314.055+428.4677*T2,
      Neptune:304.349+218.4862*T2,Pluto:238.929+145.2078*T2
    };
    return Object.entries(R).map(([name,lng]:any)=>{
      const l=mod360(lng),sign=SIGNS[Math.floor(l/30)];
      const planet=PLANETS.find(p=>p.name===name);
      let retro=false;
      if(Y[name]){let d=l-mod360(Y[name]);if(d>180)d-=360;if(d<-180)d+=360;retro=d<0;}
      const dignityMult=(planet?.dignity as any)?.[sign?.name]||1.0;
      return{name,lng:l,sign,degree:l%30,planet,retro,dignityMult};
    });
  },

  // Progressed Moon (secondary progression — moves ~1° per month, adds personalised layer)
  progressedMoon:(natal:any[],years:number)=>{
    const natalMoon=natal.find((p:any)=>p.name==="Moon");
    if(!natalMoon)return natalMoon;
    const progressedLng=mod360(natalMoon.lng+years*13.18);// ~13.18°/year = 1.1°/mo
    return{...natalMoon,lng:progressedLng,sign:SIGNS[Math.floor(progressedLng/30)],degree:progressedLng%30,progressed:true};
  },

  // Midpoint calculation (Tier 4) — sensitive natal midpoints activated by transits
  midpoints:(natal:any[])=>{
    const mps:any[]=[];
    for(let i=0;i<natal.length;i++){
      for(let j=i+1;j<natal.length;j++){
        const a=natal[i].lng,b=natal[j].lng;
        let mp=mod360((a+b)/2);
        const mp2=mod360(mp+180); // Also the anti-midpoint
        mps.push({name:`${natal[i].name}/${natal[j].name}`,lng:mp,planets:[natal[i].name,natal[j].name]});
        mps.push({name:`${natal[i].name}/${natal[j].name}(anti)`,lng:mp2,planets:[natal[i].name,natal[j].name]});
      }
    }
    return mps;
  },

  aspects:(p1:any[],p2:any[],includeMinor=false)=>{
    const aspects=includeMinor?[...MAJOR_ASPECTS,...MINOR_ASPECTS]:MAJOR_ASPECTS;
    const f:any[]=[],seen=new Set();
    for(const a of p1)for(const b of p2){
      if(a.name===b.name)continue;
      let d=Math.abs(a.lng-b.lng);if(d>180)d=360-d;
      for(const asp of aspects){
        const orb=Math.abs(d-asp.angle);
        if(orb<=asp.orb){
          const k=[a.name,b.name].sort().join("-")+asp.name;
          if(!seen.has(k)){
            seen.add(k);
            f.push({p1:a,p2:b,asp,orb:+orb.toFixed(1),strength:1-orb/asp.orb,exact:+((1-orb/asp.orb)*100).toFixed(0)});
          }
        }
      }
    }
    return f.sort((a,b)=>b.strength-a.strength);
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
    return !pos.some(p=>{
      if(p.name==="Moon")return false;
      let d=Math.abs(m.lng-p.lng);if(d>180)d=360-d;
      return MAJOR_ASPECTS.some(a=>Math.abs(d-a.angle)<=a.orb*0.4);
    });
  },

  // ─── DOMAIN SCORING ENGINE ───────────────────────────────────────────────
  // This is where each domain gets genuinely different treatment
  scoreDomain:(dom:any,natal:any[],transit:any[],date:Date,tier:number)=>{
    const includeMinor=tier>=3;
    const aspects=Eng.aspects(transit,natal,includeMinor);
    const mp=Eng.moonPhase(transit);
    const voc=Eng.voc(transit);
    const retros=transit.filter((p:any)=>p.retro);

    let rawScore=0;
    const signals:any[]=[];

    // ── 1. Aspect scoring with domain-specific planet weights ──
    const relAspects=aspects.filter((a:any)=>dom.rulers.includes(a.p1.name)||dom.rulers.includes(a.p2.name));
    relAspects.forEach((a:any)=>{
      // Domain-specific weight for this planet
      const pw1=(dom.planetWeights[a.p1.name]||0.7);
      const pw2=(dom.planetWeights[a.p2.name]||0.7);
      const maxPw=Math.max(pw1,pw2);

      // Dignity multiplier — planet in its best sign hits harder
      const dignityBonus=a.p1.dignityMult>1?` (dignified ×${a.p1.dignityMult.toFixed(1)})`:"";
      
      let imp=a.strength*a.asp.power*maxPw;

      const isBenefic=PLANETS.find(p=>p.name===a.p1.name)?.nature==="benefic";
      const isMalefic=PLANETS.find(p=>p.name===a.p1.name)?.nature==="malefic";
      const isFlow=["flow","opportunity","amplify"].includes(a.asp.nature);
      const isTension=["tension","polarity","friction","adjustment"].includes(a.asp.nature);

      if(isFlow){
        if(isBenefic)imp*=1.6;     // Benefic planet in easy aspect = very good
        if(isMalefic)imp*=0.6;     // Malefic in easy aspect = muted good
        imp*=a.p1.dignityMult||1;  // Better if planet dignified
        rawScore+=imp;
        signals.push({
          text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}${dignityBonus}`,
          val:+imp.toFixed(1),type:"green",conf:Math.min(9,Math.round(a.strength*10)),
          detail:`${a.asp.nature} aspect — ${a.exact}% exact · supports ${dom.name.toLowerCase()}`
        });
      } else if(isTension) {
        if(isMalefic)imp*=1.5;     // Malefic planet in hard aspect = very bad
        if(isBenefic)imp*=0.7;     // Benefic in hard aspect = muted bad
        rawScore-=imp;
        signals.push({
          text:`${a.p1.planet?.sym||""} ${a.p1.name} ${a.asp.name} natal ${a.p2.name}`,
          val:-imp.toFixed(1),type:"red",conf:Math.min(9,Math.round(a.strength*10)),
          detail:`${a.asp.nature} aspect — ${a.exact}% exact · friction for ${dom.name.toLowerCase()}`
        });
      }
    });

    // Also include important transits to non-ruler natal planets (less weight)
    const backgroundAspects=aspects.filter((a:any)=>!dom.rulers.includes(a.p1.name)&&!dom.rulers.includes(a.p2.name)).slice(0,3);
    backgroundAspects.forEach((a:any)=>{
      const pw=(dom.planetWeights[a.p1.name]||0.5)*0.3; // Much lower weight
      let imp=a.strength*a.asp.power*pw;
      const isFlow=["flow","opportunity"].includes(a.asp.nature);
      if(isFlow){rawScore+=imp;}else{rawScore-=imp;}
    });

    // ── 2. Retrograde penalties — domain-specific severity ──
    retros.forEach((p:any)=>{
      const pen=(dom.retroPenalty as any)[p.name]||0;
      if(pen!==0){
        rawScore+=pen;
        signals.push({
          text:`${p.planet?.sym||""} ${p.name} Retrograde in ${p.sign.name}`,
          val:pen,type:"warning",conf:9,
          detail:p.name==="Mercury"&&(dom.id==="contracts"||dom.id==="learning")?
            "CRITICAL — Mercury ℞ is severely disruptive for this domain. Delay if at all possible.":
            p.name==="Venus"&&(dom.id==="love"||dom.id==="financial")?
            "Venus ℞ — relationships and finances under heavy review. Avoid new commitments.":
            `${p.name} retrograde — reconsider rather than initiate in this area`
        });
      }
    });

    // ── 3. Moon phase — domain-specific bonuses ──
    const moonBonusVal=(dom.moonBonus as any)[mp.name]||0;
    if(moonBonusVal!==0){
      rawScore+=moonBonusVal;
      signals.push({
        text:`${mp.icon} ${mp.name}`,val:moonBonusVal,
        type:moonBonusVal>0?"green":"caution",conf:6,
        detail:moonBonusVal>3?`${mp.name} is particularly supportive for ${dom.name.toLowerCase()} today`:
               moonBonusVal>0?`${mp.name} lends mild support for this area`:
               moonBonusVal<-4?`${mp.name} is unfavourable for ${dom.name.toLowerCase()} — delay if possible`:
               `${mp.name} slightly challenges this area`
      });
    }

    // ── 4. Void of Course — affects all domains but differently ──
    if(voc){
      const vocPenalty=dom.id==="contracts"?-10:dom.id==="financial"?-8:dom.id==="career"?-7:-5;
      rawScore+=vocPenalty;
      signals.push({text:"🚫 Void of Course Moon",val:vocPenalty,type:"warning",conf:7,detail:"Moon is between signs — actions started now tend to fizzle or go nowhere"});
    }

    // ── 5. Tier 2+: Progressed Moon activation ──
    if(tier>=2){
      const dobApprox=natal[0]?.lng; // rough proxy
      const years=(date.getTime()-new Date(1990,0,1).getTime())/(1000*60*60*24*365.25); // rough years from epoch
      const progMoon=Eng.progressedMoon(natal,years%30);
      if(progMoon){
        const aspToNatal=Eng.aspects([progMoon],natal,false).slice(0,3);
        aspToNatal.filter((a:any)=>dom.rulers.includes(a.p2.name)).forEach((a:any)=>{
          const imp=a.strength*a.asp.power*0.5;// Progressed aspects are subtle but real
          if(["flow","opportunity"].includes(a.asp.nature)){
            rawScore+=imp;
            signals.push({text:`🌙 Progressed Moon ${a.asp.name} natal ${a.p2.name}`,val:+imp.toFixed(1),type:"green",conf:5,detail:`Progressed Moon activation — slower background support for ${dom.name.toLowerCase()}`});
          }
        });
      }
    }

    // ── 6. Tier 3+: Minor aspects add nuance ──
    // (already included in aspect calculation above via includeMinor flag)

    // ── 7. Tier 4: Midpoint activations ──
    if(tier>=4){
      const mps=Eng.midpoints(natal);
      transit.forEach((tp:any)=>{
        if(!dom.rulers.includes(tp.name))return;
        mps.filter((mp:any)=>mp.planets.some((p:string)=>dom.rulers.includes(p))).slice(0,5).forEach((mp:any)=>{
          let d=Math.abs(tp.lng-mp.lng);if(d>180)d=360-d;
          if(d<=2){// Very tight midpoint activation
            const imp=2.5*(1-d/2);
            rawScore+=imp;
            signals.push({text:`⊕ ${tp.name} activates ${mp.name} midpoint`,val:+imp.toFixed(1),type:"green",conf:4,detail:`Midpoint activation — subtle but real energy for ${dom.name.toLowerCase()}`});
          }
        });
      });
    }

    // ── Normalise ──
    const norm=Math.max(-100,Math.min(100,rawScore*2.2));

    // ── Confidence: genuinely varies by domain, tier, and signal quality ──
    const gn=signals.filter(s=>s.type==="green");
    const rd=signals.filter(s=>s.type==="red"||s.type==="warning"||s.type==="caution");
    const totalWeight=signals.reduce((s:number,x:any)=>s+Math.abs(x.val),0);
    const signalCount=signals.length;
    
    // More signals + same direction + high weights = high confidence
    const directionAgree=gn.length+rd.length>0?Math.abs(gn.length-rd.length)/(gn.length+rd.length):0;
    // Tier adds to confidence ceiling — more depth = more conviction when signals align
    const tierBonus=[0,0,5,10,15][tier]||0;
    // But if signals conflict a lot, confidence stays lower
    const conflictPenalty=Math.min(rd.length,gn.length)*3;
    
    const rawConf=12+(totalWeight*1.8)+(directionAgree*28)+(signalCount*1.2)+tierBonus-conflictPenalty;
    const confidence=Math.min(88,Math.max(15,Math.round(rawConf)));

    // ── Get verdict ──
    const bucket=norm>30?"great":norm>10?"good":norm>-10?"mixed":norm>-30?"bad":"avoid";
    const bucketLines=(dom.verdicts as any)[bucket];
    const verdict=bucketLines[Math.abs(Math.round(norm+signals.length*7))%bucketLines.length];

    return{
      score:norm,signals:signals.sort((a:any,b:any)=>Math.abs(b.val)-Math.abs(a.val)),
      confidence,greenCount:gn.length,redCount:rd.length,totalSignals:signals.length,verdict,bucket
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLING & UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",blu:"#38d6f5",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};
const vColor=(s:number)=>s>30?CL.grn:s>10?"#7ddba3":s>-10?CL.acc:s>-30?"#e5a0a0":CL.red;
const vLabel=(s:number)=>s>30?"Excellent":s>10?"Favorable":s>-10?"Mixed":s>-30?"Caution":"Avoid";
const fmtD=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fmtDL=(d:Date)=>d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

const ConfPill=({confidence,score}:{confidence:number,score:number})=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
    <div style={{fontSize:11,fontWeight:800,color:vColor(score),fontFamily:"system-ui"}}>{vLabel(score)}</div>
    <div style={{background:`${vColor(score)}15`,border:`1px solid ${vColor(score)}40`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,fontFamily:"system-ui",color:vColor(score),whiteSpace:"nowrap"}}>{confidence}% confidence</div>
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

// TODAY AT A GLANCE — the first thing users see
const TodaySnapshot=({domains,mp,voc,retros}:any)=>{
  const doList=domains.filter((d:any)=>d.score>10).slice(0,4);
  const avoidList=domains.filter((d:any)=>d.score<-5).slice(0,3);
  const neutralList=domains.filter((d:any)=>d.score>=-5&&d.score<=10);
  return(
    <div style={{background:`linear-gradient(160deg,#0b0918,#100e20)`,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}}>
      <SH icon="⚡" title="TODAY AT A GLANCE" sub="What to lean into — what to leave alone"/>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:800,color:CL.grn,fontFamily:"system-ui",letterSpacing:1,marginBottom:7}}>✅ LEAN INTO</div>
        {doList.length>0?doList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:`${CL.grn}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.grn}`}}>
            <span style={{fontSize:18}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:"#aaa",marginTop:1,lineHeight:1.5}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.grn,fontFamily:"system-ui",flexShrink:0}}>{d.confidence}%</div>
          </div>
        )):(
          <div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly favoured areas today — a day for careful, steady work.</div>
        )}
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:CL.red,fontFamily:"system-ui",letterSpacing:1,marginBottom:7}}>🚫 HOLD OFF</div>
        {avoidList.length>0?avoidList.map((d:any)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:`${CL.red}0d`,borderRadius:8,marginBottom:4,borderLeft:`3px solid ${CL.red}`}}>
            <span style={{fontSize:18}}>{d.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"system-ui",fontSize:12,fontWeight:700,color:CL.txt}}>{d.name}</div>
              <div style={{fontFamily:"system-ui",fontSize:11,color:"#aaa",marginTop:1,lineHeight:1.5}}>{d.verdict.split(".")[0]}.</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:CL.red,fontFamily:"system-ui",flexShrink:0}}>{d.confidence}%</div>
          </div>
        )):(
          <div style={{fontFamily:"system-ui",fontSize:12,color:CL.dim,padding:"8px 10px",fontStyle:"italic"}}>No strongly unfavoured areas — the sky is relatively balanced today.</div>
        )}
      </div>
      {neutralList.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,color:CL.acc,fontFamily:"system-ui",letterSpacing:1,marginBottom:6}}>⚖️ USE JUDGMENT</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {neutralList.map((d:any)=>(
              <div key={d.id} style={{background:`${CL.acc}10`,border:`1px solid ${CL.acc}30`,borderRadius:20,padding:"4px 12px",fontFamily:"system-ui",fontSize:11,color:CL.acc}}>{d.icon} {d.name}</div>
            ))}
          </div>
        </div>
      )}
      <HR/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",letterSpacing:1}}>SKY:</span>
        <div style={{background:CL.card2,borderRadius:20,padding:"3px 10px",fontSize:10,fontFamily:"system-ui",color:CL.dim}}>{mp.icon} {mp.name}</div>
        {voc&&<div style={{background:`${CL.red}15`,borderRadius:20,padding:"3px 10px",fontSize:10,fontFamily:"system-ui",color:CL.red}}>🚫 VOC Moon</div>}
        {retros.map((r:any)=>(
          <div key={r.name} style={{background:`${CL.acc}12`,borderRadius:20,padding:"3px 10px",fontSize:10,fontFamily:"system-ui",color:CL.acc}}>{r.planet?.sym} {r.name} ℞</div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
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
      const allAspects=Eng.aspects(transit,natal,tier>=3);
      const mp=Eng.moonPhase(transit),voc=Eng.voc(transit);
      const retros=transit.filter((p:any)=>p.retro);
      const sunSign=natal.find((p:any)=>p.name==="Sun")?.sign;
      const moonSign=natal.find((p:any)=>p.name==="Moon")?.sign;
      const elements:any={fire:0,earth:0,air:0,water:0};natal.forEach((p:any)=>{if(p.sign)elements[p.sign.el]++;});
      const allDomains=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier)})).sort((a:any,b:any)=>b.score-a.score);
      const domains=tier===2?allDomains.filter((d:any)=>selectedDomains.includes(d.id)):allDomains;
      const overall=allDomains.reduce((s:number,d:any)=>s+d.score,0)/allDomains.length;
      const overallConf=Math.min(84,Math.max(18,Math.round(allDomains.reduce((s:number,d:any)=>s+d.confidence,0)/allDomains.length)));
      const totalGreen=allDomains.reduce((s:number,d:any)=>s+d.greenCount,0);
      const totalRed=allDomains.reduce((s:number,d:any)=>s+d.redCount,0);
      const forecast:any[]=[];
      for(let i=0;i<30;i++){
        const fd=new Date(tDate);fd.setDate(fd.getDate()+i);
        const dt=Eng.pos(fd);const fvoc=Eng.voc(dt);const fRetros=dt.filter((p:any)=>p.retro);
        const ds=DOMAINS.map(dm=>({...dm,...Eng.scoreDomain(dm,natal,dt,fd,tier)}));
        const avg=ds.reduce((s:number,x:any)=>s+x.score,0)/ds.length;
        const best=ds.reduce((b:any,x:any)=>x.score>b.score?x:b,ds[0]);
        forecast.push({date:fd,overall:avg,best,moonPhase:Eng.moonPhase(dt),domains:ds});
      }
      const bestDays=DOMAINS.map((dom,di)=>{
        const sorted=[...forecast].sort((a:any,b:any)=>b.domains[di].score-a.domains[di].score);
        return{domain:dom,top3:sorted.slice(0,3).map(f=>({date:f.date,score:f.domains[di].score,conf:f.domains[di].confidence})),bottom3:sorted.slice(-3).reverse().map(f=>({date:f.date,score:f.domains[di].score}))};
      });
      setData({natal,transit,allAspects,mp,voc,retros,sunSign,moonSign,elements,domains,allDomains,overall,overallConf,totalGreen,totalRed,forecast,bestDays});
      setLoading(false);
    },700);
  },[dob,targetDate,tier,selectedDomains]);

  useEffect(()=>{if(dob)compute();},[dob,targetDate,tier,selectedDomains]);

  const addTeamMember=()=>{
    if(!newMemberName||!newMemberDob)return;
    const member={name:newMemberName,dob:newMemberDob,id:Date.now()};
    const updated=[...teamMembers,member];
    setTeamMembers(updated);setNewMemberName("");setNewMemberDob("");
    computeTeam(updated);
  };

  const computeTeam=(members:any[])=>{
    const tDate=new Date(targetDate+"T12:00:00");
    const scores=members.map((m:any)=>{
      const bDate=new Date(m.dob+"T12:00:00");
      const natal=Eng.pos(bDate),transit=Eng.pos(tDate);
      const ds=DOMAINS.map(d=>({...d,...Eng.scoreDomain(d,natal,transit,tDate,tier)}));
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
    setTeamMembers(updated);computeTeam(updated);
  };

  const getAiReading=async()=>{
    if(!data)return;setAiLoading(true);setAiReading("");
    const summary=`Tier: ${tier}. Date: ${targetDate}. Overall: ${data.overall.toFixed(0)}. Top domain: ${data.allDomains[0].name} (${data.allDomains[0].score.toFixed(0)}, ${data.allDomains[0].confidence}% confidence). Bottom domain: ${data.allDomains[data.allDomains.length-1].name} (${data.allDomains[data.allDomains.length-1].score.toFixed(0)}). Moon: ${data.mp.name}. Retrogrades: ${data.retros.map((r:any)=>r.name).join(",")||"none"}. VOC: ${data.voc}. Key signals: ${data.allDomains[0].signals.slice(0,2).map((s:any)=>s.text).join(", ")}.`;
    try{
      const res=await fetch("/api/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({summary,tier})});
      const json=await res.json();
      setAiReading(json.interpretation||"The Oracle is silent.");
    }catch{setAiReading("Could not reach the Oracle. Try again.");}
    setAiLoading(false);
  };

  const SC:any={card:{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:18,marginBottom:12}};
  const TB=({id,label,icon}:{id:string,label:string,icon:string})=>(
    <button onClick={()=>setTab(id)} style={{background:tab===id?CL.acc:"transparent",color:tab===id?"#000":CL.dim,border:`1px solid ${tab===id?CL.acc:CL.bdr}`,borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>{icon} {label}</button>
  );

  const toggleDomain=(id:string)=>{
    if(selectedDomains.includes(id)){if(selectedDomains.length>1)setSelectedDomains(prev=>prev.filter(d=>d!==id));}
    else if(selectedDomains.length<3)setSelectedDomains(prev=>[...prev,id]);
  };

  const tierInfo=TIERS.find(t=>t.id===tier)||TIERS[0];

  return(
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"'Georgia','Palatino',serif",padding:"10px 14px",maxWidth:720,margin:"0 auto"}}>
      <style>{`@keyframes glow{0%,100%{text-shadow:0 0 15px #f6ad3c44}50%{text-shadow:0 0 30px #f6ad3c88,0 0 60px #9b7fe644}}input[type="date"],input[type="text"]{font-family:system-ui;color-scheme:dark}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}*{box-sizing:border-box}`}</style>

      {/* HEADER */}
      <div style={{textAlign:"center",padding:"18px 0 10px"}}>
        <div style={{fontSize:10,letterSpacing:6,color:CL.pur,fontWeight:700,fontFamily:"system-ui"}}>ORACLE v3</div>
        <h1 style={{fontSize:24,fontWeight:400,margin:"4px 0",fontStyle:"italic",background:`linear-gradient(135deg,${CL.acc},${CL.pnk},${CL.pur})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 5s ease infinite"}}>Personal Decision Oracle</h1>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:8,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",letterSpacing:1}}>PLAN:</span>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>selectTier(t.id)} style={{background:tier===t.id?`${t.color}20`:"transparent",color:tier===t.id?t.color:CL.mut,border:`1px solid ${tier===t.id?t.color:CL.bdr}`,borderRadius:20,padding:"3px 12px",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"system-ui",letterSpacing:1}}>{t.name}</button>
          ))}
        </div>
        <div style={{fontSize:9,color:CL.dim,fontFamily:"system-ui",marginTop:3}}>{tierInfo.desc}</div>
      </div>

      {tier===2&&(
        <div style={{...SC.card,borderColor:CL.pur+"40"}}>
          <SH icon="🎯" title="YOUR 3 FOCUS AREAS" sub="Pick exactly 3 domains for your deep reading" color={CL.pur}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {DOMAINS.map(d=>{const sel=selectedDomains.includes(d.id);const disabled=!sel&&selectedDomains.length>=3;return(<button key={d.id} onClick={()=>!disabled&&toggleDomain(d.id)} style={{background:sel?`${CL.pur}20`:"transparent",color:sel?CL.pur:disabled?CL.mut:CL.dim,border:`1px solid ${sel?CL.pur:disabled?CL.mut:CL.bdr}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:sel?700:400,cursor:disabled?"not-allowed":"pointer",fontFamily:"system-ui",opacity:disabled?0.4:1}}>{d.icon} {d.name}</button>);})}
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
          <button onClick={compute} disabled={!dob||loading} style={{background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:10,padding:"11px 24px",fontSize:12,fontWeight:800,cursor:!dob?"not-allowed":"pointer",opacity:!dob?0.4:1,fontFamily:"system-ui",letterSpacing:1}}>{loading?"✨ Computing...":"🔮 Consult Oracle"}</button>
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

          <div style={{...SC.card,background:`linear-gradient(150deg,${CL.card},${data.overall>15?"#0d1a10":data.overall<-15?"#1a0d0d":"#1a1708"})`}}>
            <SH icon="🎯" title="OVERALL READING" sub={fmtDL(new Date(targetDate))} color={vColor(data.overall)}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
              {[
                {label:"OVERALL",value:vLabel(data.overall),color:vColor(data.overall),sub:`${data.overall>0?"+":""}${data.overall.toFixed(0)} net score`},
                {label:"CONFIDENCE",value:`${data.overallConf}%`,color:CL.acc,sub:"Signal clarity across all domains"},
                {label:"SIGNALS",value:`▲${data.totalGreen} / ▼${data.totalRed}`,color:data.totalGreen>data.totalRed?CL.grn:CL.red,sub:`${data.totalGreen} supportive · ${data.totalRed} challenging`},
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
            <SH icon="✨" title="ORACLE AI INTERPRETATION" color={CL.pur} sub={`${tierInfo.name} tier · deeper AI reading`}/>
            {aiReading?(
              <div>
                <div style={{fontSize:13,lineHeight:1.95,color:CL.txt,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{aiReading}</div>
                <button onClick={()=>setAiReading("")} style={{marginTop:10,background:"transparent",border:`1px solid ${CL.bdr}`,borderRadius:8,padding:"6px 14px",fontSize:10,color:CL.dim,cursor:"pointer",fontFamily:"system-ui"}}>↩ New reading</button>
              </div>
            ):(
              <button onClick={getAiReading} disabled={aiLoading} style={{background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:10,padding:"12px 28px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"system-ui",letterSpacing:1,width:"100%",opacity:aiLoading?0.6:1}}>
                {aiLoading?"✨ The Oracle speaks...":"✨ Get AI Interpretation"}
              </button>
            )}
          </div>

          <div style={SC.card}>
            <SH icon="📋" title="DOMAIN BREAKDOWN" sub={tier===2?"Your 3 focus areas — full signal analysis":"All 9 domains · tap any for signals"}/>
            <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginBottom:10,padding:"5px 8px",background:CL.card2,borderRadius:6}}>
              {tier===1?"Major aspects only":tier===2?"Major aspects + progressed Moon":tier===3?"Major + minor aspects + progressed Moon":"Full synthesis: all aspects + midpoints + progressed positions"}
            </div>
            {data.domains.map((d:any)=>(
              <div key={d.id} style={{background:CL.card2,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",borderLeft:`4px solid ${vColor(d.score)}`}} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{d.icon} {d.name}</div>
                    <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui",marginTop:1}}>{d.sub}</div>
                  </div>
                  <ConfPill confidence={d.confidence} score={d.score}/>
                </div>
                <div style={{fontSize:12.5,color:CL.txt,fontFamily:"'Georgia',serif",lineHeight:1.8,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}25`}}>{d.verdict}</div>
                {expanded===d.id&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${CL.bdr}`}}>
                    <div style={{fontSize:10,letterSpacing:2,color:CL.acc,fontWeight:700,fontFamily:"system-ui",marginBottom:6}}>{d.totalSignals} ACTIVE SIGNALS</div>
                    {tier===1?(
                      <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim,textAlign:"center",padding:"8px"}}>Full signal breakdown available on Plus and above</div>
                    ):d.signals.map((s:any,j:number)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"6px 0",borderBottom:`1px solid ${CL.bdr}20`}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"system-ui",fontSize:11.5,fontWeight:700,color:s.type==="green"?CL.grn:s.type==="red"||s.type==="warning"?CL.red:CL.acc}}>{s.text}</div>
                          <div style={{fontFamily:"system-ui",fontSize:11,color:CL.dim}}>{s.detail}</div>
                        </div>
                        <div style={{fontWeight:800,fontSize:12,color:s.val>0?CL.grn:CL.red,fontFamily:"system-ui",flexShrink:0}}>{s.val>0?"+":""}{s.val}</div>
                      </div>
                    ))}
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
              const answer=d.score>30?"Yes — strongly supported":d.score>10?"Likely yes — conditions lean in your favour":d.score>-10?"Use judgment — it could go either way":d.score>-30?"Probably not — consider waiting":"No — the conditions are against this now";
              return(
                <div key={qd.id} style={{background:CL.card2,borderRadius:12,padding:16,marginBottom:8,borderLeft:`4px solid ${vColor(d.score)}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{qd.icon} {qd.name}</div>
                    <ConfPill confidence={d.confidence} score={d.score}/>
                  </div>
                  <div style={{fontSize:13,color:vColor(d.score),fontWeight:700,fontFamily:"system-ui",marginBottom:8}}>{answer}</div>
                  <div style={{fontSize:12.5,color:CL.txt,fontFamily:"'Georgia',serif",lineHeight:1.8}}>{d.verdict}</div>
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
                    <div style={{fontSize:10,color:CL.grn,fontWeight:700,letterSpacing:1,marginBottom:4,fontFamily:"system-ui"}}>🟢 BEST</div>
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
                  {(type==="Natal"?data.natal:data.transit).map((p:any)=>(
                    <div key={p.name} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:11,background:CL.card2,borderRadius:5,marginBottom:2,fontFamily:"system-ui"}}>
                      <span style={{color:p.planet?.c}}>{p.planet?.sym} {p.name}{p.retro?" ℞":""}</span>
                      <span style={{color:p.sign.c}}>{p.sign.sym} {p.degree.toFixed(1)}°{p.dignityMult>1.2?` ★`:""}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <HR/>
            <div style={{fontSize:10,letterSpacing:2,color:CL.pnk,fontWeight:700,marginBottom:6,fontFamily:"system-ui"}}>TOP ASPECTS {tier>=3?"(incl. minor)":""}</div>
            {data.allAspects.slice(0,12).map((a:any,i:number)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:i%2?"transparent":CL.card2,borderRadius:5,fontSize:11,fontFamily:"system-ui"}}>
                <span style={{fontSize:14,color:a.asp.c}}>{a.asp.sym}</span>
                <span style={{flex:1}}><span style={{color:a.p1.planet?.c,fontWeight:600}}>{a.p1.name}</span> <span style={{color:CL.dim}}>{a.asp.name}</span> <span style={{color:a.p2.planet?.c,fontWeight:600}}>{a.p2.name}</span></span>
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
                <div style={{fontSize:11,color:CL.dim,fontFamily:"system-ui",marginBottom:8}}>Add team member ({teamMembers.length}/5 free)</div>
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
                <div style={{fontSize:12,color:CL.txt,fontFamily:"'Georgia',serif",lineHeight:1.75,marginTop:10,paddingTop:8,borderTop:`1px solid ${CL.bdr}25`}}>
                  {m.overall>20?`${m.name} is in strong shape today — high energy, good momentum across the board. Put them at the front.`:m.overall>0?`${m.name} is steady today — solid in a supporting role, good for collaboration.`:m.overall>-20?`${m.name} has some headwinds today. Better behind the scenes than leading externally.`:`${m.name}'s energy is challenged today. Protect them from high-pressure situations.`}
                </div>
              </div>
            ))}
            {teamData.length>1&&(
              <div style={{...SC.card,marginTop:4,background:`${CL.pnk}08`,borderColor:CL.pnk+"40"}}>
                <SH icon="🏆" title="TEAM RANKING TODAY" color={CL.pnk} sub="Who leads, who supports, who holds back"/>
                {[...teamData].sort((a:any,b:any)=>b.overall-a.overall).map((m:any,i:number)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${CL.bdr}30`}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:`${vColor(m.overall)}20`,border:`2px solid ${vColor(m.overall)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:vColor(m.overall),fontFamily:"system-ui",flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,fontFamily:"system-ui"}}>{m.name}</div>
                      <div style={{fontSize:10,color:CL.dim,fontFamily:"system-ui"}}>{i===0?"🌟 Lead role today":i===teamData.length-1?"🌿 Rest & support":"⚖️ Collaborative"}</div>
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
