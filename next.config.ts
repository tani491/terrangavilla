import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Racine du workspace fixée au dossier du projet : évite que Turbopack
  // ne déduise une mauvaise racine si un lockfile existe dans un dossier parent.
  turbopack: {
    root: path.resolve(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
