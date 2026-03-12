"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CL = { bg:"#07060d", card:"#0f0d1f", card2:"#13101f", bdr:"#1f1b3a", dim:"#6b6580", txt:"#e8e4f0", pur:"#9b7fe6", acc:"#f6ad3c", red:"#e55050", grn:"#3dbd7d", pnk:"#e879a0" };

const TIERS = [
  { id:0, name:"Free",  price:"$0",     color:CL.dim, features:["World energy chat","3 world domains"] },
  { id:1, name:"Basic", price:"$9.99",  color:CL.dim, features:["All 9 domains","Personal birth chart","7-day forecast","% probability scores"] },
  { id:2, name:"Plus",  price:"$29.99", color:CL.pur, features:["Everything in Basic","30-day best days","Full signal breakdown","Solar arc progressions"] },
  { id:3, name:"Pro",   price:"$79.99", color:CL.acc, features:["Everything in Plus","Birth time & location","Deep domain specialisations","Finance · Health · Travel layers"] },
  { id:4, name:"Pro+",  price:"$99.99", color:CL.pnk, features:["Everything in Pro","Oracle AI chat","Daily push readings","Relationship synastry"] },
];

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [activeTab, setActiveTab] = useState<"overview"|"profile"|"subscription">("overview");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUser(user);

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile) {
        setProfile(profile);
        setDob(profile.dob || "");
        setBirthTime(profile.birth_time || "");
        setBirthCity(profile.birth_city || "");
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").upsert({ id: user.id, dob, birth_time: birthTime, birth_city: birthCity });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const currentTier = TIERS.find(t => t.id === (profile?.tier ?? 0)) || TIERS[0];

  if (loading) return (
    <div style={{minHeight:"100vh",background:CL.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:36,animation:"spin 2s linear infinite"}}>🔮</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:CL.bg,color:CL.txt,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}input,select{font-family:inherit}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${CL.bdr}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20}}>🔮</span>
          <span style={{fontSize:12,fontWeight:900,color:CL.acc,letterSpacing:2}}>MYORACLE</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/oracle" style={{fontSize:12,color:CL.pur,textDecoration:"none",fontWeight:700}}>→ Open Oracle</a>
          <button onClick={signOut} style={{background:"transparent",border:`1px solid ${CL.bdr}`,borderRadius:8,padding:"6px 14px",fontSize:11,color:CL.dim,cursor:"pointer"}}>Sign out</button>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"32px 20px"}}>

        {/* Welcome */}
        <div style={{marginBottom:28,animation:"fadeIn 0.5s ease"}}>
          <div style={{fontSize:11,color:CL.dim,marginBottom:4}}>Welcome back</div>
          <h1 style={{fontSize:24,fontWeight:900,color:CL.txt,margin:"0 0 4px"}}>{user?.email?.split("@")[0]}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,background:`${currentTier.color}20`,color:currentTier.color,border:`1px solid ${currentTier.color}40`,borderRadius:10,padding:"2px 10px",fontWeight:700}}>{currentTier.name} Plan</span>
            <span style={{fontSize:11,color:CL.dim}}>{user?.email}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:24,background:CL.card,borderRadius:12,padding:4}}>
          {(["overview","profile","subscription"] as const).map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:activeTab===tab?CL.bg:"transparent",color:activeTab===tab?CL.txt:CL.dim,fontSize:12,fontWeight:activeTab===tab?700:400,cursor:"pointer",textTransform:"capitalize",transition:"all 0.2s"}}>
              {tab==="overview"?"🏠 Overview":tab==="profile"?"👤 Profile":"💳 Subscription"}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab==="overview"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"20px",borderTop:`2px solid ${CL.pur}`}}>
                <div style={{fontSize:24,marginBottom:8}}>🔮</div>
                <div style={{fontSize:12,fontWeight:700,color:CL.txt,marginBottom:4}}>Current Plan</div>
                <div style={{fontSize:20,fontWeight:900,color:currentTier.color}}>{currentTier.name}</div>
                <div style={{fontSize:11,color:CL.dim,marginTop:2}}>{currentTier.price}/mo</div>
              </div>
              <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"20px",borderTop:`2px solid ${CL.acc}`}}>
                <div style={{fontSize:24,marginBottom:8}}>🌙</div>
                <div style={{fontSize:12,fontWeight:700,color:CL.txt,marginBottom:4}}>Birth Chart</div>
                <div style={{fontSize:13,color:dob?CL.grn:CL.dim,fontWeight:dob?700:400}}>{dob?`${dob}`:"Not set"}</div>
                <div style={{fontSize:11,color:CL.dim,marginTop:2}}>{dob?"DOB saved":"Add for personal readings"}</div>
              </div>
            </div>

            <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:CL.txt,marginBottom:12}}>✨ What's included in {currentTier.name}</div>
              {currentTier.features.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",fontSize:12,color:CL.txt}}>
                  <span style={{color:CL.grn}}>✓</span><span>{f}</span>
                </div>
              ))}
            </div>

            <a href="/oracle" style={{display:"block",background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",borderRadius:14,padding:"14px",fontSize:13,fontWeight:900,cursor:"pointer",textAlign:"center",textDecoration:"none",letterSpacing:1}}>
              🔮 Open Your Oracle →
            </a>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab==="profile"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"24px",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.txt,marginBottom:4}}>Your Cosmic Profile</div>
              <div style={{fontSize:12,color:CL.dim,marginBottom:24,lineHeight:1.6}}>This information personalises your Oracle readings. The more you add, the more accurate your scores.</div>

              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>DATE OF BIRTH</label>
                <input value={dob} onChange={e=>setDob(e.target.value)} type="date"
                  style={{width:"100%",padding:"11px 14px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:10,color:dob?CL.txt:CL.dim,fontSize:13,outline:"none"}}/>
                <div style={{fontSize:10,color:CL.dim,marginTop:4}}>Used to calculate your natal chart</div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>BIRTH TIME <span style={{color:CL.pur}}>(optional)</span></label>
                <input value={birthTime} onChange={e=>setBirthTime(e.target.value)} type="time"
                  style={{width:"100%",padding:"11px 14px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:10,color:birthTime?CL.txt:CL.dim,fontSize:13,outline:"none"}}/>
                <div style={{fontSize:10,color:CL.dim,marginTop:4}}>Unlocks Ascendant + house system precision</div>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>BIRTH CITY <span style={{color:CL.pur}}>(optional)</span></label>
                <input value={birthCity} onChange={e=>setBirthCity(e.target.value)} type="text" placeholder="e.g. Sydney, London, New York"
                  style={{width:"100%",padding:"11px 14px",background:CL.bg,border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:13,outline:"none"}}/>
                <div style={{fontSize:10,color:CL.dim,marginTop:4}}>Used for timezone-precise calculations</div>
              </div>

              <button onClick={saveProfile} disabled={saving} style={{width:"100%",background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:12,padding:"13px",fontSize:13,fontWeight:900,cursor:"pointer",opacity:saving?0.6:1}}>
                {saving?"Saving…":saved?"✓ Saved!":"Save Profile"}
              </button>
            </div>

            <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"20px"}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.txt,marginBottom:12}}>Account</div>
              <div style={{fontSize:12,color:CL.dim,marginBottom:4}}>Email</div>
              <div style={{fontSize:13,color:CL.txt,marginBottom:16}}>{user?.email}</div>
              <button onClick={signOut} style={{background:`${CL.red}15`,border:`1px solid ${CL.red}30`,borderRadius:10,padding:"10px 20px",fontSize:12,color:CL.red,cursor:"pointer",fontWeight:700}}>
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab==="subscription"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:"20px",marginBottom:16,borderTop:`2px solid ${currentTier.color}`}}>
              <div style={{fontSize:11,color:currentTier.color,fontWeight:800,letterSpacing:2,marginBottom:8}}>CURRENT PLAN</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:CL.txt}}>{currentTier.name}</div>
                  <div style={{fontSize:12,color:CL.dim,marginTop:2}}>{currentTier.price}/month</div>
                </div>
                {profile?.tier===0&&<span style={{fontSize:11,background:`${CL.dim}20`,color:CL.dim,border:`1px solid ${CL.dim}30`,borderRadius:10,padding:"4px 12px"}}>Free</span>}
                {profile?.tier>0&&<span style={{fontSize:11,background:`${CL.grn}20`,color:CL.grn,border:`1px solid ${CL.grn}30`,borderRadius:10,padding:"4px 12px"}}>Active</span>}
              </div>
            </div>

            <div style={{fontSize:12,fontWeight:700,color:CL.txt,marginBottom:12}}>Upgrade your Oracle</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {TIERS.filter(t=>t.id>0&&t.id!==(profile?.tier||0)).map(t=>(
                <div key={t.id} style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"border-color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=CL.bdr}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:t.color}}>{t.name}</div>
                    <div style={{fontSize:11,color:CL.dim,marginTop:2}}>{t.features[0]} + more</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:900,color:CL.txt}}>{t.price}</div>
                    <div style={{fontSize:10,color:CL.dim}}>/month</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:`${CL.pur}10`,border:`1px solid ${CL.pur}30`,borderRadius:14,padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:12,color:CL.dim,marginBottom:8}}>💳 Stripe payments coming soon</div>
              <div style={{fontSize:11,color:CL.dim,lineHeight:1.6}}>We're setting up secure billing. For early access or to arrange a subscription, email us at <a href="mailto:hello@myoracle.me" style={{color:CL.pur}}>hello@myoracle.me</a></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
