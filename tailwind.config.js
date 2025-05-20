/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#C6E7E3',
        secondary: '#EBFA9F',
        tertiary: '#191D15',
        quaternary: '#C9E8E0',
        quinary: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
