/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './.lovable/**/*.{js,ts,jsx,tsx}',
    './lovable.config.ts'
  ],
  safelist: [
    'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
    'md:grid-cols-2', 'lg:grid-cols-3'
  ],
  theme: {
    extend: {
      colors: {
        pasture: {
          moss: '#3F6B3F',
          meadow: '#90A583',
          soil: '#8A6B4A'
        }
      }
    }
  },
  plugins: []
}
