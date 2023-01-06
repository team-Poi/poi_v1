/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `${process.env.API}/s/:path*?sec=${process.env.SECRET}`,
      },
    ];
  },
};

module.exports = nextConfig;
