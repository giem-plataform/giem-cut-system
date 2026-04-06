/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/manifest.json",
      headers: [{ key: "Content-Type", value: "application/manifest+json" }],
    },
  ],
};

module.exports = nextConfig;
