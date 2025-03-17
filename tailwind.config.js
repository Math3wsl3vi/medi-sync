/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        green: {
          1:'#22b378',
          2:'#21263c'
        }
      }
    },
  },
  plugins: [],
};
