/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'your-new-heroku-app.herokuapp.com', // Replace with your Heroku app hostname
          pathname: '/**',
        },
      ],
    },
    output: 'export', // For static file output
  };
  
  export default nextConfig;  