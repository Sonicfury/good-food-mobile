/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#df6562'
      },
      fontFamily: {
        display: ['cooper-black-std', 'serif'],
        sans: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
