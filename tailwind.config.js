/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{ts,tsx}',
    '!./node_modules/**',
    '!./dist/**',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Definidos como canales RGB en index.css (:root) para permitir
        // re-tematizar por curso (p. ej. .theme-deloitte) sin tocar las clases.
        'brand-yellow': 'rgb(var(--brand-yellow) / <alpha-value>)',
        'brand-yellow-dark': 'rgb(var(--brand-yellow-dark) / <alpha-value>)',
        'brand-dark': 'rgb(var(--brand-dark) / <alpha-value>)',
        'brand-gray': 'rgb(var(--brand-gray) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
