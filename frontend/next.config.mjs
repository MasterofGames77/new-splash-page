/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'unified-vgw-splash-page-ce047efdcf15.herokuapp.com/',
          pathname: '/**',
        },
      ],
    },
    output: 'export', // For static file output
  };
  
  export default nextConfig;  