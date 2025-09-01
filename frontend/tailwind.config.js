/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
  extend: {
    // ... (fontFamily dan colors dari atas)
    keyframes: { // <-- Tambahkan ini
      'fade-in-up': {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: { // <-- Tambahkan ini
      'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
    },
  },
},
  plugins: [],
}