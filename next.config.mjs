// @ts-check

import { withPostHogConfig } from "@posthog/nextjs-config";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/fundacion-andescalada/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  outputFileTracingIncludes: {
    "/notas-de-cordada/[slug]/opengraph-image": [
      "./src/assets/fonts/BrownStd-Regular.otf",
    ],
    "/notas-de-cordada/opengraph-image": [
      "./src/assets/fonts/BrownStd-Regular.otf",
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return webpackConfig;
  },
};

const posthogApiKey =
  process.env.POSTHOG_API_KEY ?? process.env.POSTHOG_PERSONAL_API_KEY;

export default withPostHogConfig(config, {
  personalApiKey: posthogApiKey ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID ?? "368057",
  host: "https://us.posthog.com",
  sourcemaps: {
    enabled: Boolean(posthogApiKey),
    deleteAfterUpload: true,
  },
});
