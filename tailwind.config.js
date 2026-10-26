/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fbfbf8',
        ink: '#0b0b0c',
        stone: '#f1f1ec',
        blue: '#2261e9',
        tint: {
          navy: '#0a3149',
          lilac: '#c2a7f4',
          lemon: '#ffe64e',
          moss: '#2f7d5b',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk Variable"', 'sans-serif'],
        display: ['"Funnel Display Variable"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
