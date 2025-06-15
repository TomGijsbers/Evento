const { cyan, orange } = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        cyan,
        orange,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
