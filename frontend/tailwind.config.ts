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
        "radio":"#303F4A",
        "textWhite":"white",
        "textgray":"#6b7280",
        "bg":"#00000023",
        "bg1":"#00000050",
        "borderColor":"#BEB58F",
        "btn":"#D7B634",
        "bglight":"#252525",
        "red":"#CC5D64",
        "linear1":"#FBC91AE0",
        "linear2":"#F8A777D9",
        "yello":"#eab308"
      }
    },
  },
  plugins: [
    scrollbar,
  ],
}