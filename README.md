# Jorge Hernández — Portfolio

A static Astro site with React islands for navigation, a canvas headline and WebGL lighting. English and Spanish copy, a dark graphite theme, and a `/portfolio/` deployment base.

## Run locally

Use Node.js 22.12 or newer and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
```

Open `http://localhost:4321/portfolio/`. Manage the background server with `pnpm astro dev status`, `pnpm astro dev logs` and `pnpm astro dev stop`.

Restart after installing dependencies. If CSS appears stale, use `pnpm build` followed by `pnpm preview`.

## Validate a change

```sh
pnpm check
pnpm test
pnpm build
node --test tests/i18n-build.mjs
```

`check` runs Astro diagnostics and TypeScript, including unused declarations. A build alone does not check types. Tests cover canvas cleanup, idle rendering, reduced motion and navigation guards; they do not verify appearance or browser focus behavior.

## Where code belongs

| Directory | Responsibility |
| --- | --- |
| `src/pages/` | Routes and page composition; project routes come from `getStaticPaths`. |
| `src/sections/` | Home page sections, their layout and scroll choreography. |
| `src/components/projects/` | Project cards and previous/next navigation, with their own styles. |
| `src/components/nav/` | Navigation bars, React controls and the native dialog lifecycle. |
| `src/components/visuals/` | Shared grain, canvas and WebGL visuals. |
| `src/hooks/` | React subscriptions shared by islands. |
| `src/data/` | Content, shared link types, icon paths and project image lookup. |
| `src/lib/` | Deployment paths and same-page navigation guards. |
| `src/layouts/` | Document shell, metadata and fonts. |
| `src/styles/` | Tailwind theme and document-wide styles. |

Astro renders static content. React owns browser state and cleans up its observers, listeners and rendering resources. `ContributionText.tsx` connects React to the canvas renderer; `glyphMask.ts` rasterizes letters, while `renderer.ts` manages cells and animation. WebGL shaders live in `light-rays/shaders.ts`.

Navigation uses full page loads and native cross-document view transitions. There is no Astro client router: section scripts bind to the document that owns them. The hero publishes scroll progress through CSS properties consumed by the headline and reveal navigation.

## Edit content

- Edit navigation and social URLs in `src/data/site.ts`.
- Add a project to `src/data/projects.ts` and put its image in `src/assets/projects/` with the same filename stem as its slug. `projectImages.ts` supplies both cards and detail pages. Missing images use the card's letter fallback.
- Define technologies in `src/data/tech.ts`, their icons in `TechIcon.astro`, and their display order in `src/data/stack.ts`.
- Edit biography data in `src/data/about.ts`. The CV is served from `public/`.
- Pass site-root paths through `withBase` so links and assets work under `/portfolio/`.

The headline's contribution pattern is generated locally. Astro i18n keeps English at `/portfolio/` and Spanish at `/portfolio/es/`. Both locales share templates; UI translations live in `src/i18n/ui.ts`, and Spanish project copy in `src/data/projects.es.ts`. The language selector navigates to the equivalent page, preserving the fragment. The URL determines the language, including after reload. The CV download is the same original PDF in both languages. Layout and palette constraints are documented in `AGENTS.md`.
