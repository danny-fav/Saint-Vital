/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "**.paystack.com" },
      { protocol: "https", hostname: "**.flutterwave.com" },
    ],
  },
};

export default nextConfig;
