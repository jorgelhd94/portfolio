const ROOT = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site-root path with the deploy base, so the same href works at
 *  `/` in dev and under `/portfolio/` on GitHub Pages. */
export const withBase = (path: string) => `${ROOT}/${path.replace(/^\//, '')}`;
