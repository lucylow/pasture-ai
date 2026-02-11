import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{ts,js,json}'
  ],
  theme: {
    extend: {
      colors: {
        pasture: {
          moss: '#3F6B3F',
          'moss-50': '#f0f7ef',
          meadow: '#90A583',
          soil: '#8A6B4A'
        }
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(63, 107, 63, 0.08), 0 10px 20px -2px rgba(63, 107, 63, 0.04)',
        card: '0 1px 3px rgba(0,0,0,0.05)'
      }
    }
  },
  plugins: []
};

export default config;
