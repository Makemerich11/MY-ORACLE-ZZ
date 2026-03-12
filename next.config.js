const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: { document: "/offline.html" },
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/api\/daily-focus/,
      handler: "NetworkFirst",
      options: { cacheName: "oracle-api", expiration: { maxEntries: 5, maxAgeSeconds: 3600 } },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: { cacheName: "oracle-pages", expiration: { maxEntries: 50, maxAgeSeconds: 86400 }, networkTimeoutSeconds: 10 },
    },
  ],
});

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  compress: true,
  poweredByHeader: false,
  // Disable Turbopack so next-pwa webpack config works
  turbopack: {},
};

module.exports = withPWA(nextConfig);
