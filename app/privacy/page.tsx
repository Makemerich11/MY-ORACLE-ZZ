export default function PrivacyPage() {
  const pur = "#9b7fe6", acc = "#f6ad3c", bg = "#07060d", card = "#0f0d1f", bdr = "#1f1b3a", dim = "#6b6580", txt = "#e8e4f0";
  const updated = "12 March 2026";
  const Section = ({title, children}:{title:string,children:any}) => (
    <div style={{marginBottom:32}}>
      <h2 style={{fontSize:15,fontWeight:800,color:txt,marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${bdr}`}}>{title}</h2>
      <div style={{fontSize:13,color:dim,lineHeight:1.9}}>{children}</div>
    </div>
  );
  return (
    <div style={{minHeight:"100vh",background:bg,color:txt,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}a{color:${pur}}p{margin:0 0 12px}`}</style>
      <div style={{padding:"18px 24px",borderBottom:`1px solid ${bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:800,margin:"0 auto"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:8,color:acc,fontWeight:900,letterSpacing:2,fontSize:13,textDecoration:"none"}}>🔮 MYORACLE</a>
        <div style={{display:"flex",gap:20,fontSize:12,color:dim}}>
          <a href="/about">About</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a>
        </div>
      </div>
      <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px 80px"}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontSize:30,fontWeight:900,color:txt,marginBottom:8}}>Privacy Policy</h1>
          <div style={{fontSize:12,color:dim}}>Last updated: {updated}</div>
        </div>

        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"16px 20px",marginBottom:32,borderLeft:`3px solid ${pur}`}}>
          <p style={{fontSize:13,color:dim,margin:0,lineHeight:1.7}}>
            <strong style={{color:txt}}>Short version:</strong> We collect only what we need to give you readings. We don't sell your data. Your birth chart data stays yours.
          </p>
        </div>

        <Section title="1. What We Collect">
          <p><strong style={{color:txt}}>Information you provide:</strong></p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Date of birth (used to calculate your natal chart)</li>
            <li>Time of birth (optional — improves house system accuracy)</li>
            <li>Birth city (optional — used for ascendant calculation)</li>
            <li>Email address (for account creation and subscription management)</li>
          </ul>
          <p><strong style={{color:txt}}>Information collected automatically:</strong></p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Usage data (pages visited, features used) — anonymous and aggregated</li>
            <li>Device type and browser (for PWA optimisation)</li>
            <li>Approximate location (for world energy relevance, not stored)</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>We use your information solely to:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Generate your personal astrological readings</li>
            <li>Personalise your daily focus notifications (if enabled)</li>
            <li>Manage your subscription and account</li>
            <li>Improve the accuracy of our algorithms (in aggregate, anonymised form)</li>
            <li>Send service-related communications</li>
          </ul>
        </Section>

        <Section title="3. What We Don't Do">
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>We do <strong style={{color:txt}}>not</strong> sell your personal data to any third party</li>
            <li>We do <strong style={{color:txt}}>not</strong> share your birth chart data with advertisers</li>
            <li>We do <strong style={{color:txt}}>not</strong> display ads in our products</li>
            <li>We do <strong style={{color:txt}}>not</strong> use your data to train AI models without consent</li>
            <li>We do <strong style={{color:txt}}>not</strong> store chat conversations beyond the current session</li>
          </ul>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>Your data is stored on secure servers. We use industry-standard encryption in transit and at rest. Birth chart data is associated with your account and retained for as long as your account is active.</p>
          <p>We use Vercel (infrastructure) and Anthropic (AI processing) as service providers. Both have their own robust privacy and security practices. AI chat queries are processed by Anthropic but are not stored or used for model training under our agreement.</p>
        </Section>

        <Section title="5. Cookies and Local Storage">
          <p>We use local storage in your browser to:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Remember your preferences (tier selection, chart settings)</li>
            <li>Store saved chart readings locally (they do not leave your device)</li>
            <li>Track whether you've dismissed install prompts</li>
          </ul>
          <p>We do not use third-party tracking cookies or advertising pixels.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for optional data processing</li>
          </ul>
          <p>To exercise any of these rights, contact <a href="mailto:privacy@myoracle.me">privacy@myoracle.me</a></p>
        </Section>

        <Section title="7. Children">
          <p>MyOracle is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal data, contact us immediately.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>We may update this policy periodically. We will notify active subscribers of material changes by email. Continued use of the service after changes constitutes acceptance.</p>
        </Section>

        <Section title="9. Contact">
          <p>Privacy questions: <a href="mailto:privacy@myoracle.me">privacy@myoracle.me</a></p>
          <p>General: <a href="mailto:hello@myoracle.me">hello@myoracle.me</a></p>
        </Section>
      </div>
      <div style={{borderTop:`1px solid ${bdr}`,padding:"24px",textAlign:"center",fontSize:11,color:dim}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:8}}>
          <a href="/">Home</a><a href="/about">About</a><a href="/terms">Terms</a><a href="/privacy">Privacy</a>
        </div>
        © {new Date().getFullYear()} MyOracle · myoracle.me
      </div>
    </div>
  );
}
