/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#F5F5DC',
          DEFAULT: '#E8DCC4',
          dark: '#D2B48C',
        },
        yobel: {
          green: '#2D5A27',
          gold: '#C5A021',
          lightGreen: '#E8F5E9',
          lightYellow: '#FFF9C4',
        }
      },
      fontFamily: {
        gothic: ["'Yu Gothic'", "'Noto Sans JP'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
