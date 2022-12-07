/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
        {
            source: "/chat",
            destination: "/chat/0",
            permanent: true,
        },
    ];
},
}

module.exports = nextConfig
