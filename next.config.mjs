/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /draft\// },
    ];
    return config;
  },
  // Remove the pageExtensions and distDir configurations
};

export default nextConfig;
