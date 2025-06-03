const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { text } = require('stream/consumers');

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
      primary: '#4F46E5',
      secondary: '#14B8A6',
      background: '#F9FAFB',
      border: '#B0BEC5',
      text: {
        main: '#1F2937',
        secondary: '#6B7280',
      },
      success: '#84CC16',
      warning: '#F59E0B',
      hover: '#4338CA',
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
};
