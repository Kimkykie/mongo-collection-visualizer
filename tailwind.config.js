/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  variants: {
    opacity: ({ after }) => after(['disabled'])
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

