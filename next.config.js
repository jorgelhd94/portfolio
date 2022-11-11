/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = undefined;
let assetPrefix = '';
let basePath = '/';

if (isGithubActions) {
  repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');

  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  assetPrefix: repo ? assetPrefix : undefined,
  basePath: repo ? basePath : undefined,
};

module.exports = nextConfig;
