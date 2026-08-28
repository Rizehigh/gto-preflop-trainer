/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          dark: '#0f172a',
          card: '#1e293b',
          table: '#064e3b',
          felt: '#047857',
          raise: '#ef4444',
          call: '#10b981',
          fold: '#64748b',
          mix: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}