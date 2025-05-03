/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // ← обов'язково!
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  darkMode: 'class', // <-- обов'язково
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: { extend: {} },
  plugins: [],
}
