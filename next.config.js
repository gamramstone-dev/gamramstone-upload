const baseHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    hideApplyButton: process.env.NEXT_PUBLIC_HIDE_APPLY === 'true'
  },
  images: {
    domains: [
      'yt3.ggpht.com',
      'img.youtube.com',
      'i.ytimg.com',
      'lh3.googleusercontent.com',
    ],
  },
  async headers () {
    return [
      {
        source: '/:path*',
        headers: baseHeaders,
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://gamramstone.wesub.io',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          {
            key: 'Vary',
            value: 'Cookie, Accept-Encoding, Origin'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
