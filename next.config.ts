import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phones on the LAN hit the dev server by IP; without this Next blocks the
  // dev JS chunks cross-origin and the page renders with no JS at all.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
