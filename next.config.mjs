/** @type {import('next').NextConfig} */

var isProd = false;

const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    distDir: "build", // Where to export all pages
    trailingSlash: true,
    assetPrefix: isProd ? 'http://localhost' : undefined,


    // time in seconds of no pages generating during static
    // generation before timing out
    staticPageGenerationTimeout: 1000,
    reactStrictMode: false
};

export default nextConfig;