/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e3a5f',
        },
        brand: {
          navy: '#1e3a5f',
          blue: '#2563eb',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          purple: '#6366f1',
        }
      }
    },
  },
  plugins: [],
}
