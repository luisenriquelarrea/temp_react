/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
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