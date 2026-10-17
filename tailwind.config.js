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
        // Identidad Uniandes del portafolio (components/andes-theme.css). El amarillo
        // nunca es texto sobre claro: es campo, marca y relleno; los enlaces van en oliva.
        andes: {
          yellow: '#FFF500',
          navy: '#19222F',
          deep: '#0E141D',
          olive: '#6E6A00',
          sec: '#525C64',
          surface: '#F6F8FA',
          paper: '#EDF0F3',
          line: '#D3D9DF',
        },
      },
      fontFamily: {
        dax: ['"ff-dax-pro"', '"Manrope Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        sans: ['"Manrope Variable"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
