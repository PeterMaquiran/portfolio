/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 this enables the standalone output required by your Dockerfile
  output: 'standalone',

  // 👇 your existing i18n configuration
  i18n: {
    locales: ['en', 'pt'], // or your actual locales
    defaultLocale: 'en',   // choose which should load by default
    localeDetection: false // 👈 disable automatic redirection
  }
};

export default nextConfig;
