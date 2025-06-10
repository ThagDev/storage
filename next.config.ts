import type { NextConfig } from "next";

// Type for remotePatterns (avoid import error)
type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
};

// Chỉ dùng domain production hoquocthang.vercel.app, không dùng localhost nữa
const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "hoquocthang.vercel.app",
    pathname: "/uploads/image/**",
  },
    {
    protocol: "https",
    hostname: "hoquocthang.vercel.app",
    pathname: "/profile/avatar/**",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  /* config options here */
};

export default nextConfig;
