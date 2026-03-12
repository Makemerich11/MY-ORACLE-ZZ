"use client";
import dynamic from "next/dynamic";
import PWAInstallBanner from "@/components/PWAInstallBanner";

const OracleEngine = dynamic(
  () => import("./OracleEngine"),
  { ssr: false, loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07060d", color: "#9b7fe6", fontFamily: "system-ui", fontSize: 12, letterSpacing: 2 }}>
      ✨ LOADING ORACLE...
    </div>
  )}
);

export default function OraclePage() {
  return (
    <>
      <OracleEngine />
      <PWAInstallBanner />
    </>
  );
}
