/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#1e3a8a", // Darker electric blue for hovers and deep contrasts
        gray: {
          50: '#f8fafc', // Clean slightly cool white for borders/cards
          100: '#f1f5f9',
          900: '#2563eb', // Electric Blue! Maps to the primary theme color
        }
      }
    },
  },
  plugins: [],
}
