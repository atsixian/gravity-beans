/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Roboto Condensed'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
