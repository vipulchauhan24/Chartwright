const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      primary: {
        main: '#FF715B',
        background: '#F2FDFF',
        success: '#16DB65',
        error: '#d90429',
        border: '#B0BEC5',
        text: '#071013',
      },
      secondary: {
        main: '#4062BB',
        background: '#F8F9FA',
        text: '#0E0F19',
      },
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
};
