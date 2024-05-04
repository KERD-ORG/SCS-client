/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "github.com" }] },
  webpack: function (config, context) {
    config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
    };
    return config;
  }
};

export default nextConfig;
