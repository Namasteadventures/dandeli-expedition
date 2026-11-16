import type { NextConfig } from 'next';

const [githubOwner = '', githubRepository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isGitHubPagesBuild = Boolean(githubOwner && githubRepository);
const isUserOrOrganizationSite = githubRepository.toLowerCase() === `${githubOwner.toLowerCase()}.github.io`;
const basePath = isGitHubPagesBuild && !isUserOrOrganizationSite ? `/${githubRepository}` : '';
const siteUrl = isGitHubPagesBuild
  ? `https://${githubOwner.toLowerCase()}.github.io${basePath}`
  : 'https://dandeliexpedition.com';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
