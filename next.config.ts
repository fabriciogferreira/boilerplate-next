import type { NextConfig } from "next";

// Standalone: o Dockerfile de produção copia .next/standalone.
// Não trocar para "export" sem rever DECISIONS.md.
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
