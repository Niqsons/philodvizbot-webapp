/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marble: {
          light: '#F5F0E8',
          dark: '#E8E0D0',
        },
        terracotta: '#C4A484',
        bronze: {
          DEFAULT: '#5D4E37',
          light: '#8B7355',
        },
        gold: '#D4AF37',
        olive: '#6B8E23',
        wine: '#722F37',
      },
      fontFamily: {
        ancient: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
