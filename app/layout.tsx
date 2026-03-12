import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyOracle — Your Cosmic Intelligence",
  description: "AI-powered astrology with % probability scoring across 9 life domains. Know the right time to act.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyOracle",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0d0b1e",
    "msapplication-TileImage": "/icons/icon-144x144.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#9b7fe6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyOracle" />
        <style>{`
          * { -webkit-tap-highlight-color: transparent; }
          body { overscroll-behavior: none; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
