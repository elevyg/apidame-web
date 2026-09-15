// @ts-check

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default config;
