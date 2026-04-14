/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F6',
        navy: '#1B2B4B',
        amber: '#E8963A',
        coral: '#E85D4A',
        muted: '#8B8677',
        surface: '#FFFFFF',
        border: '#E5E3DC',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

