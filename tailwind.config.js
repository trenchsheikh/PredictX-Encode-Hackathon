/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // BNB Theme Colors
        primary: {
          DEFAULT: '#F0B90B', // BNB Yellow
          50: '#FEF9E7',
          100: '#FDF2CF',
          200: '#FBE59F',
          300: '#F8D86F',
          400: '#F5CB3F',
          500: '#F0B90B',
          600: '#C19409',
          700: '#926F07',
          800: '#634A05',
          900: '#342503',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#1E2329', // BNB Dark
          50: '#F4F5F6',
          100: '#E9EBED',
          200: '#D3D7DB',
          300: '#BDC3C9',
          400: '#A7AFB7',
          500: '#919BA5',
          600: '#7B8793',
          700: '#657381',
          800: '#4F5F6F',
          900: '#1E2329',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#00D4AA', // BNB Green
          50: '#E6FBF7',
          100: '#CCF7EF',
          200: '#99EFDF',
          300: '#66E7CF',
          400: '#33DFBF',
          500: '#00D4AA',
          600: '#00A888',
          700: '#007C66',
          800: '#005044',
          900: '#002422',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#1E2329',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1E2329',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1E2329',
        },
        muted: {
          DEFAULT: '#F4F5F6',
          foreground: '#7B8793',
        },
        border: '#E9EBED',
        input: '#F4F5F6',
        ring: '#F0B90B',
        chart: {
          1: '#F0B90B',
          2: '#00D4AA',
          3: '#FF6B6B',
          4: '#4ECDC4',
          5: '#45B7D1',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #F0B90B' },
          '50%': { boxShadow: '0 0 20px #F0B90B, 0 0 30px #F0B90B' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #F0B90B' },
          '50%': { boxShadow: '0 0 20px #F0B90B, 0 0 30px #F0B90B' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
