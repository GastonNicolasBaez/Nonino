/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#fdf5e6',   // neutral-light
          100: '#f5f5dc',  // secondary-cream
          200: '#f0e68c',  // secondary-wheat
          300: '#cd853f',  // secondary-terracotta
          400: '#b8860b',  // primary-warm
          500: '#d4af37',  // primary-golden
          600: '#8b4513',  // primary-rich
          700: '#654321',  // marrón medio oscuro
          800: '#1a1a1a',  // neutral-dark (gris oscuro)
          900: '#1a0f0a',  // marrón muy oscuro
          950: '#0d0704',  // casi negro
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#fdf5e6',   // neutral-light
          100: '#f5f5dc',  // secondary-cream
          200: '#f0e68c',  // secondary-wheat
          300: '#cd853f',  // secondary-terracotta
          400: '#b8860b',  // primary-warm
          500: '#d4af37',  // primary-golden
          600: '#8b4513',  // primary-rich
          700: '#654321',  // marrón medio oscuro
          800: '#1a1a1a',  // neutral-dark (gris oscuro)
          900: '#1a0f0a',  // marrón muy oscuro
          950: '#0d0704',  // casi negro
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Nueva paleta "Tradición Argentina"
        empanada: {
          golden: '#d4af37',      // primary-golden
          warm: '#b8860b',        // primary-warm
          rich: '#8b4513',        // primary-rich
          cream: '#f5f5dc',       // secondary-cream
          wheat: '#f0e68c',       // secondary-wheat
          terracotta: '#cd853f',  // secondary-terracotta
          dark: '#1a1a1a',        // neutral-dark (gris oscuro)
          light: '#fdf5e6',       // neutral-light
        },
        // Colores de acento
        argentina: {
          red: '#dc143c',         // accent-red
          green: '#228b22',       // accent-green
          orange: '#ff8c00',      // accent-orange
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
