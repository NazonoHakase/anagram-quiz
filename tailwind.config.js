/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yobel-green': '#006400',
        'yobel-lightGreen': '#e8f5e9',
      },
    },
  },
  plugins: [],
}