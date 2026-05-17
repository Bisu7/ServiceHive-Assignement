import type { Config } from 'tailwindcss'

/**
 * Obsidian UI Design System Palette Decision:
 * 
 * - Main dark background: #0f1117 (obsidian.800) — A solid, non-blue tinted deep charcoal that feels like pure premium stone.
 * - Container/Card background: #161b27 (obsidian.700) — Adds excellent depth contrast without compromising on real dark aesthetics.
 * - Form Input background: #1e2433 (obsidian.600) — Standardized dark filled input canvas, ideal for modern form styling.
 * - Primary Electric Accent: Violet (#7c3aed) — Extremely high-contrast and electric, representing premium developer-focused SaaS.
 * - Feel: Deep, premium obsidian theme designed to be extremely comforting for sales professionals spending hours in the platform.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#f9f9fa',
          100: '#f0f2f5',
          200: '#dcdfe6',
          300: '#bec5d1',
          400: '#949fb5',
          500: '#64748b', // Slate mid
          600: '#1e2433', // Input dark filled bg
          700: '#161b27', // Card/Container bg
          800: '#0f1117', // Main viewport bg
          900: '#0a0b0f',
          950: '#050608',
        },
        accent: {
          DEFAULT: '#7c3aed', // Electric Violet
          hover: '#6d28d9',
          focus: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'], // Tabular numbers for counters/stats
      },
    },
  },
  plugins: [],
}

export default config
