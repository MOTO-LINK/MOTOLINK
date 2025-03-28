/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';
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
        'goldlight': '#C0A95f',
        'bgwhite': '#ffffff',
        'beige-1': '#ECE0B0',
        'beige-2': '#F0DF9D',
        "beige-3":"#A7A7A7",
        "text":"black",
        "textWhite":"white",
        "textgray":"#6b7280",
        "bg":"#00000023",
        "bg1":"#00000050",
        "borderColor":"#BEB58F",
        "btn":"#D7B634",
        "bglight":"#252525",
      }
    },
  },
  plugins: [
    scrollbar,
  ],
}