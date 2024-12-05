/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['http://mauthn.mukham.in/all_logs'],
    },
    async headers() {
        return [
        {
            source: '/(.*)',
            headers: [
            {
                key: 'Cookie',
                value: 'authorization=authorized',
            },
            ],
        },
        ];
    },
    output: 'export', // Enable static export
    trailingSlash: true,
    reactStrictMode: true,
};


export default nextConfig;
