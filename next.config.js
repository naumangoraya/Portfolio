/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
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
