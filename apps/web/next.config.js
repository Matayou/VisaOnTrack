/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@visaontrack/client', '@visaontrack/ui'],
  // Disable typed routes for now (routes will be added incrementally)
  // experimental: {
  //   typedRoutes: true,
  // },
};

module.exports = nextConfig;

