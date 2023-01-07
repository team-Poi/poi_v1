/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:id",
        destination: `${process.env.API}/s/:id?sec=${process.env.SECRET}`,
      },
      {
        source: "/api/create",
        destination: `${process.env.API}/n?sec=${process.env.SECRET}`,
      },
    ];
  },
};

module.exports = nextConfig;
