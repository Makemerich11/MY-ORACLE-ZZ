"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed before
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Android/Chrome: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "1");
  };

  if (!showBanner || isDismissed || isInstalled) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: "linear-gradient(135deg, #1a1535 0%, #0d0b1e 100%)",
      borderTop: "1px solid #9b7fe6",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 -4px 30px rgba(155, 127, 230, 0.3)",
      animation: "slideUp 0.4s ease-out",
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Icon */}
      <img src="/icons/icon-72x72.png" alt="MyOracle" style={{ width: 48, height: 48, borderRadius: 12 }} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#f6ad3c", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
          📲 Add MyOracle to Home Screen
        </div>
        {isIOS ? (
          <div style={{ color: "#a89cc8", fontSize: 12, lineHeight: 1.4 }}>
            Tap <strong style={{ color: "#9b7fe6" }}>Share</strong> then{" "}
            <strong style={{ color: "#9b7fe6" }}>"Add to Home Screen"</strong>
          </div>
        ) : (
          <div style={{ color: "#a89cc8", fontSize: 12 }}>
            Install for instant access — no App Store needed
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {!isIOS && (
          <button
            onClick={handleInstall}
            style={{
              background: "linear-gradient(135deg, #9b7fe6, #7c5cbf)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            color: "#6b6580",
            border: "1px solid #2a2548",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
