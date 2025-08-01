import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#c2d9ed',
          200: '#9dc3e3',
          300: '#76add9',
          400: '#4f96ce',
          500: '#3674B5',
          600: '#2c5f93',
          700: '#224a71',
        },
      },
    },
  },
  plugins: [],
};

export default config;