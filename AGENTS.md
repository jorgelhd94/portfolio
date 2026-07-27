# AGENTS.md

Personal portfolio for Jorge Hernández. Single page, dark theme only, English
copy. Astro with React islands and Tailwind CSS 4.

## Stack

| | |
| --- | --- |
| Framework | Astro 7 (static output) |
| Islands | React 19 via `@astrojs/react` |
| Styles | Tailwind CSS 4 through `@tailwindcss/vite` — no `tailwind.config`, the theme lives in `src/styles/global.css` |
| Fonts | Astro Fonts API, self-hosted from Google — Archivo (body, `--font-body`), Tangerine (wordmark, `--font-display`) |
| WebGL | `ogl`, used only by `LightRays` |
| Package manager | pnpm. Node >= 22.12 |

## Commands

```bash
pnpm dev                    # dev server
pnpm build                  # production build into dist/
pnpm preview                # serve the build
pnpm exec tsc --noEmit      # type check
pnpm astro sync             # regenerate .astro/types.d.ts
```

Start long-running servers in background mode rather than detaching them with
`&`:

```bash
pnpm astro dev --background
pnpm astro dev status
pnpm astro dev logs --follow
pnpm astro dev stop
```

**`pnpm build` is not a type check.** Astro compiles TypeScript with esbuild,
which strips types without checking them, so a build passes over errors that
`tsc --noEmit` catches. Run both before calling work done.

Type errors on `.astro` files or on `astro:*` imports usually mean the generated
types are stale — run `pnpm astro sync`.

## Structure

```
src/
  components/
    nav/         Nav.astro, NavPill.tsx, QuickMenu.tsx
    visuals/     ContributionText.tsx, LightRays.tsx — generative, reusable
  sections/      Header.astro, HeaderBackground.astro — page sections
  data/site.ts   Links shared by the nav, the dock and the hero
  layouts/       Layout.astro — <head>, fonts, page shell
  pages/         index.astro
  styles/        global.css — the theme
```

New sections go in `src/sections/` and are mounted from `src/pages/index.astro`.
Anything a second section could reuse belongs in `src/components/`.

`src/data/site.ts` is the single source for the nav links and the social URLs.
Never restate a link in a component — the nav, the dock and the hero all read
from it so they cannot drift.

## Conventions

**English only in the source.** Identifiers, comments, commit messages and UI
copy. Conversation with the user is in Spanish; the repository is not.

**Comments** follow [`.agents/skills/writing-comments/SKILL.md`](.agents/skills/writing-comments/SKILL.md).
Read it before writing any. The short version: a comment must state something
the reader cannot recover from the code, must not narrate the change that
produced it, and must not retell the design conversation.

**Tabs, single quotes, and the style of the file you are in.** There is no
formatter configured; match the surrounding code.

**Astro components own their CSS** in a scoped `<style>` block. Tailwind
utilities are for layout and for values already in the theme; a gradient, a
mask, or a hand-tuned animation belongs in the style block where it can be
explained. Scoped styles do not reach inside a React island — global CSS or the
theme is the only way to style island internals.

**Motion respects `prefers-reduced-motion`,** every time. Canvas and WebGL
components check it before starting a rAF loop; CSS animations are wrapped in a
`@media (prefers-reduced-motion: no-preference)` query. Loops must stop when
their work is done rather than running idle.

**Scroll-driven CSS is written as longhands.** `animation-timeline` is a
reset-only sub-property of the `animation` shorthand, and minifiers will fold
the two together into a declaration no browser accepts. Never hand a rule a
complete set of animation sub-properties, and let every scroll-driven rule rest
in its *finished* state so a dropped effect leaves content visible.

## Design constraints

These are decisions, not defaults. Changing one is a design conversation, not a
refactor.

**Surfaces and text are neutral graphite. Clay is only ever light.** The accent
(`--color-clay-*`, taken from the CV and the portrait) belongs to the rays, the
lamp over the nav, lit edges and focus rings. Tinting a surface with it turns
graphite into terracotta. The rule is written at the top of `global.css`.

**The headline stays white,** through to the glow it spills. It is the one
element that does not pick up the colour of the light.

**The hero's contribution data is invented,** and stays that way. The GitHub
profile is quiet, so `ContributionText` generates levels from value noise rather
than fetching an API. Do not wire one up.

**Dark theme only.** There is no light mode and no toggle.

## Notes

- The language control in the dock only writes to `localStorage`. There are no
  translated routes; wiring Astro i18n is what would make it do something.
- The GitHub URL in `src/data/site.ts` is still a placeholder.
- Sections behind `#projects`, `#stack` and `#contact` do not exist yet. Both
  navigations guard against dead hashes: clicking still moves the indicator but
  does not navigate.

## Documentation

Full docs: https://docs.astro.build

- [Routing, pages, middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components and client directives](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Fonts](https://docs.astro.build/en/guides/fonts/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
