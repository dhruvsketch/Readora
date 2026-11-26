/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        readora: {
          ivory: '#F8F6F1',
          'ivory-dark': '#F0EDE4',
          ink: '#20211F',
          forest: '#315C4B',
          'forest-light': '#3D705C',
          'forest-dark': '#244538',
          gold: '#C6A56B',
          'gold-light': '#D8BC88',
          'gold-dark': '#B08E53',
          border: '#E7E4DC',
          'border-dark': '#D5D0C3',
          muted: '#73756F',
          surface: '#FFFFFF',
          'surface-card': '#FAF8F5',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 10px 30px -10px rgba(32, 33, 31, 0.15), 0 4px 6px -2px rgba(32, 33, 31, 0.05)',
        'book-lg': '0 20px 40px -15px rgba(32, 33, 31, 0.22), 0 8px 12px -4px rgba(32, 33, 31, 0.08)',
        'editorial': '0 4px 20px -2px rgba(32, 33, 31, 0.06)',
      }
    },
  },
  plugins: [],
}
