# Willber Pilares — Portfolio

Personal portfolio of a Software Engineer and squad lead with 5+ years building production systems end-to-end.

**Live:** [wpilares.vercel.app](https://wpilares.vercel.app)

![Portfolio preview](docs/preview.png)

## Overview

A bilingual (English / Spanish) scroll-driven portfolio built with React and TypeScript. It tells the story as an editorial page: a paper-and-ink design system, full-bleed tinted chapters per project, speech bubbles that appear on scroll, and a pixel-art sidekick rendered on a canvas that walks along, reacts to the section in view, changes outfit per chapter, and can be picked up and dragged. Content stays fully separated from components.

## Tech stack

| Area | Tools |
|------|-------|
| UI | React 18, TypeScript 5, Tailwind CSS 3, Lucide icons |
| Fonts | `@fontsource-variable/funnel-display`, `@fontsource-variable/space-grotesk` |
| Build | Vite 8, Bun |
| i18n | i18next, react-i18next, HTTP backend, browser language detector |
| Quality | Biome, Vitest, Testing Library, Husky |
| Hosting | Vercel |

## Technical decisions

| Decision | Why |
|----------|-----|
| **Content lives in translation files and data** (`public/locales`, `data.json`, `src/constants`) | Copy, experience, and metrics change far more often than components. Adding a job or a language never touches JSX. |
| **Translations loaded over HTTP** | Only the active language is downloaded, and locale files can be updated without rebuilding components. |
| **Four design tokens plus per-project tints** (`paper`, `ink`, `stone`, `blue`; `tint.*`) | Chapter tints are the theme, so there is no light/dark toggle, no theme store, and no `dark:` variants to keep in sync. |
| **Funnel Display for headlines, Space Grotesk for text** | Self-hosted variable fonts from `@fontsource-variable` give the editorial scale without a third-party font request. |
| **Mascot engine as pure TypeScript modules** (`src/mascot`) | Sprite frames are authored as palette-indexed strings, so art is diffable and editable in code. A gesture state machine, a canvas renderer, and anchor resolution are unit-tested independently; one React hook (`useMascot`) binds the canvas, section observers, and pointer events. |
| **Motion with CSS and Tailwind only** | Scroll reveals, count-up stats, and hover states without an animation library keep the bundle small. |
| **Accessibility by default** | `prefers-reduced-motion` renders a static mascot frame, disables drag and scroll reveals, and stops count-ups; interactive elements have visible focus states, and sections keep their scroll offset under the sticky header. |
| **Pure helpers for presentation logic** | Metric highlighting (`splitMetrics`) is a tested pure function rendered as React nodes, with no `dangerouslySetInnerHTML`. |
| **Biome instead of ESLint + Prettier** | One fast tool for linting and formatting, enforced on every commit. |

The mascot frames, gestures, and outfits can be inspected at `/?preview=mascot` in the dev server.

## Quality

Every change must pass the same gates:

- **Zero TypeScript errors** — `bunx tsc --noEmit`
- **Zero Biome errors** — `bunx biome check .`
- **Tests green** — `bun run test` (hooks, utilities, i18n configuration, mascot engine, chapter and contact components)
- **Pre-commit hook** — Husky runs Biome on staged files

Code style rules:

- No `any` in any form; use precise types, generics, or `unknown` with narrowing.
- No code comments; naming and structure carry the intent.
- Tests come first for hooks, pure helpers, and the mascot engine.

## Getting started

Requires [Bun](https://bun.sh/) 1.1+.

```bash
git clone git@github.com:wpilares/willpilares.git
cd willpilares
bun install
bun run dev
```

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview the production build |
| `bun run test` | Run the test suite once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check linting and formatting |
| `bun run lint:fix` | Fix linting and formatting issues |

## Project structure

```
public/
├── locales/{en,es}/   Translations: copy, chapter lines, mascot quips, experience
└── jobs/              Company logos
src/
├── components/        Reusable UI (header, footer, job card, chapter primitives)
│   └── chapter/       Chapter, DeviceMockup, BubbleLine
├── content/           Page sections (hero, about, projects, experience, skills, contact)
├── constants/         Static data (skills, stats, highlights, projects)
├── hooks/             useIntersectionObserver, useCountUp, usePrefersReducedMotion
├── i18n/              i18next setup
├── mascot/            Pixel-art sidekick engine
│   ├── art/           Palette-indexed frames, gestures, outfits, overlays
│   ├── behavior/      Event bus, hold-and-drag, motion, quips, section tracking
│   ├── react/         Mascot, QuipBubble, useMascot
│   └── preview/       Dev sprite sheet at /?preview=mascot
├── types/             Shared types
└── utils/             Pure helpers (splitMetrics)
data.json              Companies: key, name, logo, stack
```

## Updating content

- **New job:** add an entry to `data.json` and its `position`, `period`, and `descriptions` under `experience.companies.<key>` in both locale files.
- **New project chapter:** add the project to `src/constants/projects/index.ts` and its `title`, `description`, and `lines.{one,two,three}` under `projects.items.<key>` in both locale files. Lines accept an `<accent>` tag for the highlighted phrase.
- **Mascot quips:** edit `mascot.quips.*` in both locale files; the keys are typed in `src/mascot/behavior/bus.ts`.
- **About stats:** edit `src/constants/stats/index.ts`.
- **Skills:** add the icon to `src/constants/skills/index.ts` and the entry to its category in `src/content/skills/Skills.tsx`.

## License

© 2026 Willber Pilares. All rights reserved.
