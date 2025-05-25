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
        quaternary: '#1E493B',
        quinary: '#FFFFFF',
        warning: '#F9C74F',
        error: '#F3722C',
        success: '#90BE6D',
        info: '#90CDF4',
      },
    },
  },
  plugins: [],
};
