// @ts-check

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/notas-de-cordada/[slug]/opengraph-image": [
      "./src/assets/fonts/BrownStd-Regular.otf",
    ],
    "/notas-de-cordada/opengraph-image": [
      "./src/assets/fonts/BrownStd-Regular.otf",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default config;
