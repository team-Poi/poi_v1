/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/imgbb",
        destination: "https://imgbb.com/",
      },
      {
        source: "/:id",
        destination: `${process.env.API}/s/:id?sec=${process.env.SECRET}`,
      },
      {
        source: "/api/create",
        destination: `${process.env.API}/n?sec=${process.env.SECRET}`,
      },
      {
        source: "/api/imgbb",
        destination: "https://imgbb.com/json",
      },
    ];
  },
};

module.exports = nextConfig;
