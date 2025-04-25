/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // Docker環境での安定性向上のための設定
  compress: false, // gzip圧縮を無効化
  poweredByHeader: false, // X-Powered-Byヘッダーを無効化
}

module.exports = nextConfig 