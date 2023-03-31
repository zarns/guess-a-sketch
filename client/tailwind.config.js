/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Scans all files in the 'pages' directory
    './components/**/*.{js,ts,jsx,tsx}', // Scans all files in the 'components' directory
    // Add more paths as needed
  ],
  theme: {
    extend: {
        fontFamily: {
            disp: ["Permanent Marker, cursive"],
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
