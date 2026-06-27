/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cad: {
          950: '#090d16',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          400: '#38bdf8',
        }
      }
    },
  },
  plugins: [],
}
