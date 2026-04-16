/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Use absolute path to silence the warning
    root: process.cwd(),
  },
};

export default nextConfig;
