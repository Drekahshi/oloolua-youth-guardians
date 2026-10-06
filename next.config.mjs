/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // The site used to be plain HTML pages; old links (shared, bookmarked, or
  // from the KAI platform) still work.
  async redirects() {
    const pages = ['about', 'mission', 'vision', 'activities', 'projects', 'seedlings', 'workshops', 'beekeeping', 'photogallery', 'login', 'arts'];
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/member-dashboard.html', destination: '/portal', permanent: true },
      ...pages.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
    ];
  },
};

export default nextConfig;
