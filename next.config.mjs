/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "developers.google.com"
      },
      {
        protocol: "https",
        hostname: "img.shields.io"
      }
    ]
  }
};

export default nextConfig;
