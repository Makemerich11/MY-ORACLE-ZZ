"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CL = { bg:"#07060d", card:"#0f0d1f", bdr:"#1f1b3a", dim:"#6b6580", txt:"#e8e4f0", pur:"#9b7fe6", acc:"#f6ad3c", red:"#e55050", grn:"#3dbd7d" };

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError("Please enter email and password.");
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/account");
  };

  const handleMagicLink = async () => {
    if (!email) return setError("Enter your email first.");
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMagicSent(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div style={{minHeight:"100vh",background:CL.bg,color:CL.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{`*{box-sizing:border-box}input{font-family:inherit}input::placeholder{color:${CL.dim}}@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}`}</style>

      {/* Logo */}
      <a href="/" style={{textDecoration:"none",marginBottom:40,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>🔮</div>
        <div style={{fontSize:13,fontWeight:900,color:CL.acc,letterSpacing:3}}>MYORACLE</div>
      </a>

      <div style={{width:"100%",maxWidth:400,background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:20,padding:"32px 28px"}}>
        <h1 style={{fontSize:22,fontWeight:800,color:CL.txt,marginBottom:4,textAlign:"center"}}>Welcome back</h1>
        <p style={{fontSize:13,color:CL.dim,textAlign:"center",marginBottom:28,lineHeight:1.6}}>Sign in to your Oracle account</p>

        {magicSent ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:40,marginBottom:16}}>✉️</div>
            <div style={{fontSize:14,fontWeight:700,color:CL.grn,marginBottom:8}}>Magic link sent!</div>
            <div style={{fontSize:12,color:CL.dim,lineHeight:1.7}}>Check your email at <strong style={{color:CL.txt}}>{email}</strong> and click the link to sign in.</div>
            <button onClick={()=>setMagicSent(false)} style={{marginTop:20,background:"transparent",border:"none",color:CL.dim,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Try a different method</button>
          </div>
        ) : (
          <>
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

            {/* Email */}
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>EMAIL</label>
              <input value={email} onChange={e=>setEmail(e.target.value)}
                type="email" placeholder="you@example.com"
                style={{width:"100%",padding:"11px 14px",background:"#07060d",border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:13,outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              />
            </div>

            {/* Password */}
            <div style={{marginBottom:8}}>
              <label style={{fontSize:11,color:CL.dim,display:"block",marginBottom:6,letterSpacing:1}}>PASSWORD</label>
              <input value={password} onChange={e=>setPassword(e.target.value)}
                type="password" placeholder="••••••••"
                style={{width:"100%",padding:"11px 14px",background:"#07060d",border:`1px solid ${CL.bdr}`,borderRadius:10,color:CL.txt,fontSize:13,outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              />
            </div>

            <div style={{textAlign:"right",marginBottom:20}}>
              <button onClick={handleMagicLink} style={{background:"transparent",border:"none",color:CL.dim,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>
                Forgot password? Send magic link
              </button>
            </div>

            {error && <div style={{background:`${CL.red}15`,border:`1px solid ${CL.red}40`,borderRadius:10,padding:"10px 14px",fontSize:12,color:CL.red,marginBottom:16}}>{error}</div>}

            <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${CL.pur},${CL.acc})`,color:"#000",border:"none",borderRadius:12,padding:"13px",fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:1,opacity:loading?0.6:1}}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>

            <button onClick={handleMagicLink} disabled={loading} style={{width:"100%",background:"transparent",color:CL.dim,border:`1px solid ${CL.bdr}`,borderRadius:12,padding:"11px",fontSize:12,cursor:"pointer",marginTop:10}}>
              📧 Send magic link instead
            </button>
          </>
        )}
      </div>

      <div style={{marginTop:20,fontSize:12,color:CL.dim}}>
        No account? <a href="/signup" style={{color:CL.pur,textDecoration:"none",fontWeight:700}}>Sign up free →</a>
      </div>

      <div style={{marginTop:12,fontSize:11,color:CL.dim,opacity:0.5}}>
        <a href="/terms" style={{color:CL.dim}}>Terms</a> · <a href="/privacy" style={{color:CL.dim}}>Privacy</a>
      </div>
    </div>
  );
}
