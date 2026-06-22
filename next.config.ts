import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Set NEXT_PUBLIC_BASE_PATH in .env.local to deploy under a sub-path.
  // Leave it unset (or empty) for root deployments.
  basePath: '/api/custom-ui/philips',
  output: "standalone",
  // async rewrites() {
  //   const congaBase = process.env.NEXT_PUBLIC_CONGA_API_BASE_URL;
  //   if (!congaBase) return [];
  //   return [
  //     {
  //       // Browser calls /conga/api/... -> proxy forwards to Conga API server.
  //       // This sidesteps CORS - the request is same-origin from the browser's
  //       // perspective and the Authorization header is forwarded transparently.
  //       source: "/conga/:path*",
  //       destination: `${congaBase}/:path*`
  //     },
  //   ];
  // },
};

export default nextConfig;
