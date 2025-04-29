/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "tailwind.config.{js,cjs,mjs,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Quicksand', 'sans-serif'],
        vollkorn: ['Vollkorn', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primaryGray: '#F5F5F5',
        grayText: '#565656',
        lightYellow: '#FAEADD',
        brown: '#B2967D',
        backgroundColor: '#f7f7f8d0',
      },
    },
  },
  plugins: [],
}

