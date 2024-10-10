/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /draft\// },
    ];
    return config;
  },
  // Remove the pageExtensions and distDir configurations
};

export default nextConfig;
