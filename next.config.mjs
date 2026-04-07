import { withPayload } from '@payloadcms/next/withPayload'

const isDev = process.env.NODE_ENV !== 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 3600,
    },
  },
  images: {
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 1080, 1920],
    ...(isDev && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'embedsocial.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.tansa.co.nz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
