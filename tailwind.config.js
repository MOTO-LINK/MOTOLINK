/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'gold-1': '#E78B48',
  			'gold-2': '#F3A96B',
  			goldlight: '#F8A777',
  			bgwhite: '#ffffff',
  			'beige-1': '#ECE0B0',
  			'beige-2': '#F0DF9D',
  			'beige-3': '#A7A7A7',
  			text: '#212121',
  			radio: '#102E50',
  			textWhite: '#ffffff',
  			textgray: '#6b7280',
  			textgray400: '#9ca3af',
  			textgray300: '#d1d5db',
  			textgray500: '#6b7280',
  			textgray600: '#4b5563',
  			textgray800: '#1f2937',
  			textgray900: '#111827',
  			emarled: '#34d399',
  			emerald300: '#6ee7b7',
  			emerald400: '#34d399',
  			emerald500: '#10b981',
  			emerald600: '#059669',
  			emerald700: '#047857',
  			emerald800: '#065f46',
  			emerald900: '#064e3b',
  			bg: '#102E50',
  			bg1: '#25446B',
  			borderColor: '#BE3D2A',
  			borderColorlight: '#F06A4A',
  			btn: '#E78B48',
  			bglight: '#25446B',
  			red: '#BE3D2A',
  			redlight: '#F06A4A',
  			linear1: '#102E50',
  			linear2: '#E78B48',
  			yello: '#E78B48',
  			bluee: '#102E50',
  			bluelight: '#25446B',
  			graydark800: '#1f2937',
  			graydark700: '#374151',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

