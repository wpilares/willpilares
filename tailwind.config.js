/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
        fell: ['"IM Fell English"', 'serif'],
        serif: ['"EB Garamond Variable"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        flicker: 'flicker 3.2s linear infinite',
        'fog-drift': 'fogDrift 60s linear infinite',
      },
      keyframes: {
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
