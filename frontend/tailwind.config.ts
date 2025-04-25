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
        "textgray400":"#9ca3af",
        "textgray300":"#d1d5db",
        "textgray500":"#6b7280",
        "textgray600":"#4b5563",
        "textgray800":"#1f2937",
        "textgray900":"#111827",
        "emarled":"#34d399",
        "emerald300":"#6ee7b7",
        "emerald400":"#34d399",
        "emerald500":"#10b981",
        "emerald600":"#059669",
        "emerald700":"#047857",
        "emerald800":"#065f46",
        "emerald900":"#064e3b",
        "bg":"#00000023",
        "bg1":"#00000050",
        "borderColor":"#BEB58F",
        "borderColorlight":"#BEB58F50",
        "btn":"#D7B634",
        "bglight":"#252525",
        "red":"#CC5D64",
        "redlight":"#CC5D69",
        "linear1":"#FBC91AE0",
        "linear2":"#F8A777D9",
        "yello":"#eab308",
        "bluee":"#0F77BF",
        "bluelight":"#1B70AB",
        "graydark800":"#1f2937",
        "graydark700":"#374151"
      }
    },
  },
  plugins: [
    scrollbar,
  ],
}