"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CL = { bg:"#07060d", card:"#0f0d1f", bdr:"#1f1b3a", dim:"#6b6580", txt:"#e8e4f0", pur:"#9b7fe6", acc:"#f6ad3c", red:"#e55050", grn:"#3dbd7d" };

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return setError("Please enter email and password.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true); setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { dob: dob || null },
      },
    });

    if (signUpError) { setLoading(false); return setError(signUpError.message); }

    // Save DOB to profile if provided
    if (data.user && dob) {
      await supabase.from("profiles").upsert({ id: data.user.id, dob, tier: 0 });
    }

    setLoading(false);
    setDone(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (done) return (
    <div style={{minHeight:"100vh",background:CL.bg,color:CL.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔮</div>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>You're in the stars now</h1>
      <p style={{fontSize:13,color:CL.dim,marginBottom:8,lineHeight:1.7}}>We sent a confirmation link to <strong style={{color:CL.txt}}>{email}</strong>.</p>
      <p style={{fontSize:13,color:CL.dim,lineHeight:1.7}}>Click it to activate your account, then come back and <a href="/login" style={{color:CL.pur}}>sign in</a>.</p>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:CL.bg,color:CL.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{`*{box-sizing:border-box}input{font-family:inherit}input::placeholder{color:${CL.dim}}`}</style>

      <a href="/" style={{textDecoration:"none",marginBottom:40,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>🔮</div>
        <div style={{fontSize:13,fontWeight:900,color:CL.acc,letterSpacing:3}}>MYORACLE</div>
      </a>

      <div style={{width:"100%",maxWidth:400,background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:20,padding:"32px 28px"}}>
        <h1 style={{fontSize:22,fontWeight:800,color:CL.txt,marginBottom:4,textAlign:"center"}}>Create your account</h1>
        <p style={{fontSize:13,color:CL.dim,textAlign:"center",marginBottom:28,lineHeight:1.6}}>Free to start. Your cosmic profile awaits.</p>

        {/* Google */}
        <button onClick={handleGoogle} style={{width:"100%",background:"#fff",color:"#1a1a1a",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1,height:1,background:CL.bdr}}/>
          <span style={{fontSize:11,color:CL.dim}}>or email</span>
          <div style={{flex:1,height:1,background:CL.bdr}}/>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>EMAIL</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"
            style={{width:"100%",padding:"11px 14px",background:"#07060d",border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:13,outline:"none"}}/>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>PASSWORD</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Min. 8 characters"
            style={{width:"100%",padding:"11px 14px",background:"#07060d",border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:13,outline:"none"}}/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>DATE OF BIRTH <span style={{color:CL.pur,fontStyle:"italic",textTransform:"none",letterSpacing:0}}>(optional — unlocks personalised readings)</span></label>
          <input value={dob} onChange={e=>setDob(e.target.value)} type="date"
            style={{width:"100%",padding:"11px 14px",background:"#07060d",border:`1px solid ${CL.bdr}`,borderRadius:10,color:dob?CL.txt:CL.dim,fontSize:13,outline:"none"}}/>
        </div>

        {error && <div style={{background:`${CL.red}15`,border:`1px solid ${CL.red}40`,borderRadius:10,padding:"10px 14px",fontSize:12,color:CL.red,marginBottom:16}}>{error}</div>}

        <button onClick={handleSignup} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:12,padding:"13px",fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:1,opacity:loading?0.6:1}}>
          {loading ? "Creating account…" : "Create Account →"}
        </button>

        <p style={{fontSize:10,color:CL.dim,textAlign:"center",marginTop:14,lineHeight:1.6}}>
          By signing up you agree to our <a href="/terms" style={{color:CL.dim}}>Terms</a> and <a href="/privacy" style={{color:CL.dim}}>Privacy Policy</a>.
        </p>
      </div>

      <div style={{marginTop:20,fontSize:12,color:CL.dim}}>
        Already have an account? <a href="/login" style={{color:CL.pur,textDecoration:"none",fontWeight:700}}>Sign in →</a>
      </div>
    </div>
  );
}
