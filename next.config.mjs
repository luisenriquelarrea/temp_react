/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        urlAPI: process.env.REACT_APP_API_URL,
        apiKey: process.env.REACT_APP_API_KEY,
        apiToken: process.env.REACT_APP_API_TOKEN
    },
    images: {
        unoptimized: true,
    },
    distDir: "build",
    trailingSlash: true,
    assetPrefix: (process.env.IS_PRODUCTION === 'true') ? process.env.URL_PRODUCTION : undefined,
    staticPageGenerationTimeout: 1000,
    reactStrictMode: false
};

export default nextConfig;