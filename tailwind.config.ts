import type { Config } from "tailwindcss";
import debugScreens from "tailwindcss-debug-screens";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // This covers all files in src directory
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'itg-red': '#E02726',     // Pantone 485 C/U
        'itg-black': '#000000',   // Pantone Process Black 100%
        'itg-gray': '#949698',    // Pantone Process Black 50%
        'itg-white': '#FFFFFF',   // White K/O
        
        // Functional colors mapping
        'primary': '#E02726',
        'secondary': '#949698',
        'background': '#FFFFFF',
        'foreground': '#000000',
        'muted': '#949698',
      },
       fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-roboto-slab)', 'Georgia', 'serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        stainless: ["var(--font-stainless)", "sans-serif"],
        "roboto-slab": ["var(--font-roboto-slab)", "serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '1rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [debugScreens]
};

export default config;
