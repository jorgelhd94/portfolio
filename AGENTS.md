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

## Seeing the page

A passing build says nothing about whether the work looks right. Serve the build
and measure the DOM — geometry, computed styles, hit testing — rather than
trusting that it renders as intended; that is what catches an overflow, a clipped
control or a rule that never applied. Screenshots are the weakest link in the
chain and often unavailable, so state what was measured, and leave the aesthetic
call to the person at the keyboard.

The dev server caches aggressively here: it will serve fresh HTML with stale CSS.
When a change does not show, rebuild and check `pnpm preview` before assuming the
code is wrong. A dependency installed while it runs needs it restarted.

## Structure

```
src/
  components/
    nav/         Nav.astro, NavPill.tsx, QuickMenu.tsx
    visuals/     ContributionText.tsx, LightRays.tsx — generative, reusable
  sections/      Header.astro, HeaderBackground.astro — page sections
  data/          site.ts (nav and social links), projects.ts, stack.ts,
                 tech.ts (the one technology vocabulary), about.ts
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

**Comments are the exception, not the habit.** No file prologues, no module
overviews, no retelling of the design conversation. Write one only where the
code genuinely cannot say it — a browser trap, a number tuned by eye, a coupling
to something elsewhere — and keep it to a line or two. If a better name would
carry the meaning, rename instead.

**Tabs, single quotes, and the style of the file you are in.** There is no
formatter configured; match the surrounding code.

**Tailwind first. Scoped CSS only for what a utility cannot express.** Layout,
spacing, sizing, colour, borders and state go on the tag. A scoped `<style>`
block is for gradients, masks, `@keyframes`, pseudo-elements and fluid type.

Sizing especially belongs on the tag. An `<img>` carries intrinsic `width` and
`height` attributes and an inline `<svg>` has no intrinsic size at all, so when
their dimensions live in a style block that fails to apply, the first renders at
full resolution and the second fills its container. Both have happened here.

Scoped styles do not reach inside a React island — global CSS or the theme is
the only way to style island internals.

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
- `#projects`, `#stack` and `#about` all exist. Both navigations still guard
  against dead hashes, so a link added before its section does not strand one.
- `Home` is intercepted in `Header.astro`: `#top` names the hero, and the pin
  parks it a screen and a half down the document once scrolled past, so the
  browser's own anchor jump lands in the wrong section.
- Project pages live at `/projects/[slug]`, generated from `projects.ts`. The
  case studies are not written; the pages carry what the data already knows.
- `sharp` is a dependency because `astro:assets` needs it to build images.

## Documentation

Full docs: https://docs.astro.build

- [Routing, pages, middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components and client directives](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Fonts](https://docs.astro.build/en/guides/fonts/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
