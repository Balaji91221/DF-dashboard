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
};

export default nextConfig;
