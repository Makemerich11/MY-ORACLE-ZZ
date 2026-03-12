export default function TermsPage() {
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
          <h1 style={{fontSize:30,fontWeight:900,color:txt,marginBottom:8}}>Terms of Service</h1>
          <div style={{fontSize:12,color:dim}}>Last updated: {updated}</div>
        </div>

        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"16px 20px",marginBottom:32,borderLeft:`3px solid ${acc}`}}>
          <p style={{fontSize:13,color:dim,margin:0,lineHeight:1.7}}>
            <strong style={{color:txt}}>Important:</strong> MyOracle provides astrological guidance for informational and entertainment purposes only. Nothing on this platform constitutes professional financial, medical, legal, or life advice. Always consult qualified professionals for important decisions.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using MyOracle (myoracle.me), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
          <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>MyOracle is an AI-powered astrological timing platform that provides:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>World energy scores based on live planetary data</li>
            <li>Personal astrological readings based on your birth date, time, and location</li>
            <li>Domain-specific probability scores across nine life areas</li>
            <li>AI-powered chat for astrological guidance</li>
            <li>Best-day timing calendars and deep-dive domain analysis</li>
          </ul>
          <p>The service is provided on a subscription basis, with a free tier offering limited functionality.</p>
        </Section>

        <Section title="3. Disclaimer — Entertainment and Informational Purposes">
          <p>Astrology is a belief system and interpretive practice. MyOracle's scores, readings, and recommendations are <strong style={{color:txt}}>for informational and entertainment purposes only</strong>. They do not constitute:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Financial or investment advice</li>
            <li>Medical or psychological advice</li>
            <li>Legal advice</li>
            <li>Professional life coaching</li>
            <li>Guarantees of any outcome</li>
          </ul>
          <p>Never make significant life decisions — medical, financial, legal, or otherwise — based solely on astrological guidance. Always consult qualified, licensed professionals.</p>
        </Section>

        <Section title="4. User Accounts and Subscriptions">
          <p>Subscription tiers (Basic, Plus, Pro, Pro+) provide access to enhanced features. Subscriptions renew automatically unless cancelled. You may cancel at any time. Refunds are assessed on a case-by-case basis in accordance with applicable consumer law.</p>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul style={{paddingLeft:20,lineHeight:2.2}}>
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to reverse engineer, scrape, or extract data from the platform</li>
            <li>Resell or redistribute content from the platform without permission</li>
            <li>Use the service to harass, harm, or defraud others</li>
            <li>Circumvent any access controls or subscription limitations</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>All content, algorithms, designs, and software on MyOracle are the intellectual property of MyOracle and its licensors. You may not copy, reproduce, distribute, or create derivative works without express written permission.</p>
          <p>Personal data you provide (birth date, time, location) remains yours. We use it solely to generate your readings and do not sell it to third parties.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>To the maximum extent permitted by law, MyOracle shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to decisions made based on astrological readings.</p>
          <p>Our total liability to you for any claim shall not exceed the amount you paid for the service in the three months preceding the claim.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>These terms are governed by the laws of the jurisdiction in which MyOracle operates. Any disputes shall be resolved through good-faith negotiation first, and if necessary, through binding arbitration or the courts of the applicable jurisdiction.</p>
        </Section>

        <Section title="9. Contact">
          <p>For questions about these terms, contact us at: <a href="mailto:legal@myoracle.me">legal@myoracle.me</a></p>
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
