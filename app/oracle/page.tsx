"use client";
import dynamic from "next/dynamic";

const OracleWithNav = dynamic(
  () => import("@/components/OracleApp").then(m => ({ default: m.OracleWithNav })),
  { ssr: false, loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07060d", color: "#9b7fe6", fontFamily: "Syncopate, sans-serif", fontSize: 12, letterSpacing: 2 }}>
      ✨ LOADING ORACLE...
    </div>
  )}
);

export default function OraclePage() {
  return <OracleWithNav />;
}
