# Willber Pilares — Portfolio

Personal portfolio of a Software Engineer and squad lead with 5+ years building production systems end-to-end.

**Live:** [wpilares.vercel.app](https://wpilares.vercel.app)

![Portfolio preview](docs/preview.png)

## Overview

A bilingual (English / Spanish) single-page portfolio built with React and TypeScript. It presents professional experience, technical skills, and projects with a light/dark theme, accessible motion, and content fully separated from components.

## Tech stack

| Area | Tools |
|------|-------|
| UI | React 18, TypeScript 5, Tailwind CSS 3, Lucide icons |
| Build | Vite 8, Bun |
| State | Zustand (theme) |
| i18n | i18next, react-i18next, HTTP backend, browser language detector |
| Quality | Biome, Vitest, Testing Library, Husky |
| Hosting | Vercel |

## Technical decisions

| Decision | Why |
|----------|-----|
| **Content lives in translation files and data** (`public/locales`, `data.json`, `src/constants`) | Copy, experience, and metrics change far more often than components. Adding a job or a language never touches JSX. |
| **Translations loaded over HTTP** | Only the active language is downloaded, and locale files can be updated without rebuilding components. |
| **Zustand for the theme** instead of React Context | One tiny store with persistence, no provider tree, and no re-render cascade across the app. |
| **Motion with CSS and Tailwind only** | Scroll reveals, count-up stats, and hover states without an animation library keep the bundle small. |
| **Accessibility by default** | `prefers-reduced-motion` disables animations and count-ups, interactive elements have visible focus states, and sections keep their scroll offset under the sticky header. |
| **Pure helpers for presentation logic** | Metric highlighting (`splitMetrics`) is a tested pure function rendered as React nodes, with no `dangerouslySetInnerHTML`. |
| **Biome instead of ESLint + Prettier** | One fast tool for linting and formatting, enforced on every commit. |

## Quality

Every change must pass the same gates:

- **Zero TypeScript errors** — `bunx tsc --noEmit`
- **Zero Biome errors** — `bunx biome check .`
- **Tests green** — `bun run test` (hooks, utilities, i18n configuration, theme store)
- **Pre-commit hook** — Husky runs Biome on staged files

Code style rules:

- No `any` in any form; use precise types, generics, or `unknown` with narrowing.
- No code comments; naming and structure carry the intent.
- Tests come first for hooks and pure helpers.

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
├── locales/{en,es}/   Translations: copy, experience, positions, periods
└── jobs/              Company logos
src/
├── components/        Reusable UI (header, footer, job card, section title)
├── content/           Page sections (hero, about, skills, experience, projects, contact)
├── constants/         Static data (skills, stats, highlights, navigation, projects)
├── hooks/             useIntersectionObserver, useCountUp, usePrefersReducedMotion
├── i18n/              i18next setup
├── store/             Zustand theme store
├── types/             Shared types
└── utils/             Pure helpers (splitMetrics)
data.json              Companies: key, name, logo, stack
```

## Updating content

- **New job:** add an entry to `data.json` and its `position`, `period`, and `descriptions` under `experience.companies.<key>` in both locale files.
- **Hero stats:** edit `src/constants/stats/index.ts`.
- **Skills:** add the icon to `src/constants/skills/index.ts` and the entry to its category in `src/content/skills/Skills.tsx`.

## License

© 2026 Willber Pilares. All rights reserved.
