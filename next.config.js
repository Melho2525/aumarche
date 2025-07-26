const nodeExternals = require('webpack-node-externals');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals || [], nodeExternals()];
    }
    return config;
  },
};

module.exports = nextConfig;
