/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right'
  },
  images: {
    domains: [
      'flagcdn.com',
      'threejs.org',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'threejs.org',
        port: '',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['three']
  },
  webpack: (config, { isServer }) => {
    // Three.js 최적화
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader']
    })


    // 클라이언트 사이드에서만 실행되는 모듈들 처리
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  }
}

module.exports = nextConfig