/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    // Strip debug logging from production builds. ~55 console.log calls shipped,
    // several in render bodies, and error/warn are the ones worth keeping.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    // `domains` is deprecated (removed in Next 16) — remotePatterns covers it.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Path aliases live in jsconfig.json `compilerOptions.paths` so that the editor,
  // webpack and Turbopack all resolve them identically. Next 16 refuses to build
  // when a custom `webpack` key is present, so there must not be one here.

  // Security headers live here rather than in middleware.js on purpose: no
  // middleware exists today, and adding one would buy a mandatory rename to
  // proxy.js in Next 16 for no benefit.
  //
  // No CSP yet — styled-components needs nonce plumbing through the SSR
  // registry, which is a real breakage risk for modest gain at this traffic.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
