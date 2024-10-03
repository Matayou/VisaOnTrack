/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /draft\// },
    ];
    return config;
  },
};

export default nextConfig;
