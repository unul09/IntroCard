import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    dangerouslyAllowSVG: true, // ✅ SVG 허용
  },

  eslint: {
    // ✅ ESLint 에러가 있어도 Vercel 빌드 실패하지 않도록 설정
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
