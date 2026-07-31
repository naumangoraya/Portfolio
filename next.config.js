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
};

module.exports = nextConfig;
