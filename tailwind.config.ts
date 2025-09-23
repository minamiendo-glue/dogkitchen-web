import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f82042',
          light: '#f18c1e',
        },
        secondary: '#d1211d',
        accent: '#fcf0db',
        protein: {
          red: '#d1211d',
          white: '#fcf0db',
        },
        background: '#fff8f5',
        surface: '#ffffff',
        text: '#2c2c2c',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
