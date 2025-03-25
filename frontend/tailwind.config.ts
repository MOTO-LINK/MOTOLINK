/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold-1': '#CEB13F',
        'gold-2': '#C0A94D',
        'beige-1': '#ECE0B0',
        'beige-2': '#F0DF9D',
        "beige-3":"#A7A7A7",
        "text":"black",
        "textWhite":"white",
        "bg":"#00000023",
        "bg1":"#00000050",
        "borderColor":"#BEB58F",
        "btn":"#D7B634",
        "bglight":"#252525",
      }
    },
  },
  plugins: [],
}