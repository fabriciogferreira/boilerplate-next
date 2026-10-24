import type { NextConfig } from "next";

// Standalone: o Dockerfile de produção copia .next/standalone.
// Não trocar para "export" sem rever DECISIONS.md.
// Cache Components e a regra do Tailwind vieram do scaffold em teste/.
const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
