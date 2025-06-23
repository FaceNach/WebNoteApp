/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto es crucial para que Tailwind escanee tus archivos React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


