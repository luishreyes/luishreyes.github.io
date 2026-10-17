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
        // Línea gráfica del portafolio, la misma del dossier de titularidad
        // (components/portafolio-theme.css): papel gris frío, tinta grafito y el
        // amarillo Uniandes solo como resaltador, nunca como fondo ni como texto.
        papel: { 0: '#F5F5F3', 100: '#EBEBEC', 200: '#DCDCDE', 300: '#CDCDD0', 400: '#BDBDC1' },
        tinta: { 300: '#A9A9AD', 400: '#8E8E92', 500: '#76767A', 600: '#5E5E61', 700: '#4A4A4C', 800: '#3A3A3B', 900: '#1D1D1B' },
        resaltador: { DEFAULT: '#FFE900', suave: '#FFF4A3' },
      },
      fontFamily: {
        archivo: ['"Archivo Variable"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Manrope Variable"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
