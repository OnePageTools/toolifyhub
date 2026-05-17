
import type {NextConfig} from 'next';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' 
        https://www.googletagmanager.com 
        https://www.google-analytics.com
        https://api.exchangerate-api.com
        https://cdnjs.cloudflare.com
        https://cdn.jsdelivr.net
        https://unpkg.com;
      style-src 'self' 'unsafe-inline' 
        https://fonts.googleapis.com;
      font-src 'self' 
        https://fonts.gstatic.com;
      img-src 'self' data: blob: 
        https://img.youtube.com
        https://www.google-analytics.com
        https://placehold.co
        https://picsum.photos;
      connect-src 'self' 
        https://www.google-analytics.com
        https://api.exchangerate-api.com
        https://api.openweathermap.org
        https://api.open-meteo.com
        https://geocoding-api.open-meteo.com
        https://api.dictionaryapi.dev
        https://api.languagetool.org
        https://languagetool.org
        https://api.ipify.org
        https://ipwho.is
        https://static.imgly.com
        https://cdn.jsdelivr.net
        https://unpkg.com;
      worker-src 'self' blob:;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tools/pdf-compressor%F0%9F%92%A1',
        destination: '/tools/pdf-compressor',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
