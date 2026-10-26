const legacy = {
  paper: '#e9dfc8',
  ink: '#0b0a0f',
  blue: '#b08d57',
  tint: {
    navy: '#2c2833',
    lilac: '#2c2833',
    lemon: '#2c2833',
    moss: '#2c2833',
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...legacy,
        night: '#0b0a0f',
        stone: '#1c1a21',
        ash: '#2c2833',
        parchment: {
          DEFAULT: '#e9dfc8',
          dim: '#b8ad96',
        },
        blood: '#8b1e1e',
        ember: '#c2452d',
        gold: '#b08d57',
        moon: '#c9d6e3',
      },
      fontFamily: {
        blackletter: ['"UnifrakturMaguntia"', 'serif'],
        fell: ['"IM Fell English"', 'serif'],
        serif: ['"EB Garamond Variable"', 'Georgia', 'serif'],
        sans: ['"EB Garamond Variable"', 'Georgia', 'serif'],
        display: ['"UnifrakturMaguntia"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out',
        'scroll-nudge': 'scrollNudge 1.6s ease-in-out infinite',
        'float-soft': 'floatSoft 6s ease-in-out infinite',
        flicker: 'flicker 3.2s linear infinite',
        'fog-drift': 'fogDrift 60s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scrollNudge: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(0.35rem)' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '17%': { opacity: '0.85' },
          '23%': { opacity: '1' },
          '58%': { opacity: '0.92' },
          '64%': { opacity: '1' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
