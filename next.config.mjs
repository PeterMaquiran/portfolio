/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 this enables the standalone output required by your Dockerfile
  output: 'standalone',

  // 👇 your existing i18n configuration
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
