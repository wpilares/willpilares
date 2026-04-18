# Portfolio Web - Willber Pilares

Modern portfolio website built with the latest web technologies.

## 🚀 Tech Stack

- **Framework:** React 18.3 + TypeScript 5.7
- **Build Tool:** Vite 6.0
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 5.0
- **Linting/Formatting:** Biome 2.4
- **Package Manager:** Bun 1.1

## ✨ Features

- 🎨 **Modern Dark/Light Theme** - Toggle between dark and light modes with system preference detection, powered by Zustand
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ✨ **Smooth Animations** - Scroll-triggered animations and hover effects
- 🎯 **Optimized Performance** - Code splitting, lazy loading, and efficient builds
- 🌐 **SEO Ready** - Meta tags and semantic HTML
- ⚡ **Unified Tooling** - Biome replaces ESLint + Prettier for 10x faster linting/formatting
- 🎨 **Aqua Color Scheme** - Modern aqua/cyan color palette

## 🎨 Design System

### Color Palette (Aqua/Cyan)

**Dark Mode (Default):**
- Background: `#0a0a0a` (Pure Black)
- Secondary: `#0a1515` (Dark Aqua)
- Accent: `#06b6d4` (Cyan-500 / Aqua)
- Text: `#f5f5f5` (Off-white)

**Light Mode:**
- Background: `#ffffff`
- Secondary: `#f0f9f9`
- Accent: `#0891b2` (Cyan-600)
- Text: `#18181b`

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (v1.1+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-web

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (port 3000) |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run Biome linting |
| `bun run lint:fix` | Fix linting issues automatically |
| `bun run format` | Format code with Biome |
| `bun run ci` | Run Biome CI check on changed files |

## 📁 Project Structure

```
src/
├── components/           # Reusable components (barrel exports)
│   ├── header/
│   ├── footer/
│   ├── jobs/
│   ├── sectionTitle/
│   └── index.ts         # Barrel: export { Header, Footer, Jobs, SectionTitle }
├── content/             # Page sections (barrel exports)
│   ├── hero/
│   ├── experience/
│   ├── contact/
│   └── index.ts         # Barrel: export { Hero, Experience, Contact }
├── hooks/              # Custom React hooks (barrel exports)
│   ├── useTheme.ts
│   ├── useIntersectionObserver.ts
│   └── index.ts         # Barrel: export { useTheme, useIntersectionObserver }
├── store/              # Zustand stores (barrel exports)
│   ├── themeStore.ts
│   └── index.ts         # Barrel: export { useThemeStore, initializeTheme }
├── assets/             # Static assets (barrel exports)
│   └── index.ts         # Barrel: export { profilePhoto, emailIcon, etc. }
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom styles
├── utils/              # Utilities (barrel exports)
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── vite-env.d.ts      # Type definitions
```

## 🌙 Theme Toggle with Zustand

The theme system uses Zustand for state management:

```typescript
// Simple API
const { theme, toggleTheme, setTheme } = useThemeStore()
```

Features:
- Automatic system preference detection on first visit
- Persistent storage in localStorage via Zustand middleware
- Instant theme switching without Context Provider overhead
- CSS class toggling on `<html>` element

**How it works:**
1. On first load, detects system preference
2. Stores theme in localStorage via Zustand persist middleware
3. Applies `dark` or `light` class to `<html>` element
4. CSS uses `html.dark` and `html.light` selectors for styling

## 🔗 Path Aliases

All imports use clean path aliases:

```typescript
// Before
import Header from './components/header/Header'
import { useThemeContext } from '../../context/ThemeContext'

// After
import { Header, Footer } from '@components'
import { useThemeStore } from '@store'
import { profilePhoto } from '@assets'
import { useIntersectionObserver } from '@hooks'
```

Available aliases:
- `@` - Root src folder
- `@components` - Components barrel
- `@content` - Content sections barrel
- `@hooks` - Custom hooks barrel
- `@store` - Zustand stores barrel
- `@styles` - Styles folder
- `@assets` - Assets barrel
- `@utils` - Utilities barrel

## 📝 Biome Configuration

Biome replaces ESLint + Prettier with a unified, 10x faster toolchain:

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

## 🔄 Git Hooks

Pre-commit hook runs Biome automatically:

```bash
#!/bin/sh
bunx biome check --write --staged --changed --no-errors-on-unmatched
```

## 📄 License

© 2024 Willber Pilares. All rights reserved.
