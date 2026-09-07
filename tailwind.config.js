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
        violetImperial: '#6600CC',
        champagne: '#C9A070',
        amethyste: '#A87FE8',
        ardoise: '#3A2F5C',
        onyx: '#0D0A18',
        blancNacre: '#F7F5FB',
        negatif: '#E8546B',
        positif: '#4ADE9A',
        cyanAura: '#5EC8D8',
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      borderRadius: {
        'input': '12px',
        'badge': '12px',
        'btn': '20px',
        'minicard': '20px',
        'card': '24px',
        'hero': '32px',
      },
      backgroundImage: {
        'signature-gradient': 'linear-gradient(135deg, #6600CC 0%, #A87FE8 45%, #C9A070 100%)',
        'rank-s-gradient': 'linear-gradient(135deg, #6600CC 0%, #A87FE8 50%, #C9A070 100%)',
        'rank-a-gradient': 'linear-gradient(135deg, #A87FE8 0%, #5EC8D8 100%)',
        'rank-b-gradient': 'linear-gradient(135deg, #4ADE9A 0%, #5EC8D8 100%)',
        'rank-c-gradient': 'linear-gradient(135deg, #C9A070 0%, #F7F5FB 100%)',
        'rank-d-gradient': 'linear-gradient(135deg, #3A2F5C 0%, #A87FE8 100%)',
        'rank-e-gradient': 'linear-gradient(135deg, #2A2538 0%, #4B4458 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(13, 10, 24, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'hero-glow': '0 16px 48px rgba(102, 0, 204, 0.25), 0 0 80px rgba(168, 127, 232, 0.15)',
        'card-hover': '0 12px 40px rgba(13, 10, 24, 0.45), 0 0 20px rgba(168, 127, 232, 0.2)',
      }
    },
  },
  plugins: [],
}
