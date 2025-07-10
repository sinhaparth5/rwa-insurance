import type { Config } from "tailwindcss";

const config: Config = {
  // Disable dark mode entirely
  darkMode: "selector", // This will only activate dark mode if system prefers it, but we'll override it
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Use direct color values instead of CSS variables for more control
        background: 'white',
        foreground: 'hsl(240 10% 3.9%)',
        card: {
          DEFAULT: 'white',
          foreground: 'hsl(240 10% 3.9%)'
        },
        popover: {
          DEFAULT: 'white',
          foreground: 'hsl(240 10% 3.9%)'
        },
        primary: {
          DEFAULT: 'hsl(188 78% 41%)', // Cyan
          foreground: 'white'
        },
        secondary: {
          DEFAULT: 'hsl(188 15% 94%)', // Light cyan
          foreground: 'hsl(188 78% 20%)' // Dark cyan
        },
        muted: {
          DEFAULT: 'hsl(240 4.8% 95.9%)',
          foreground: 'hsl(240 3.8% 46.1%)'
        },
        accent: {
          DEFAULT: 'hsl(188 20% 90%)', // Light cyan
          foreground: 'hsl(188 78% 30%)' // Dark cyan
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'white'
        },
        border: 'hsl(240 5.9% 90%)',
        input: 'hsl(240 5.9% 90%)',
        ring: 'hsl(188 78% 41%)', // Cyan
        chart: {
          '1': 'hsl(188 76% 61%)', // Cyan chart colors
          '2': 'hsl(173 58% 39%)',
          '3': 'hsl(197 37% 24%)',
          '4': 'hsl(43 74% 66%)',
          '5': 'hsl(27 87% 67%)'
        },
        // Add explicit cyan colors for easier use
        cyan: {
          50: 'hsl(188 100% 97%)',
          100: 'hsl(188 84% 91%)',
          200: 'hsl(188 84% 78%)',
          300: 'hsl(188 83% 62%)',
          400: 'hsl(188 78% 53%)',
          500: 'hsl(188 78% 41%)',
          600: 'hsl(188 78% 31%)',
          700: 'hsl(188 78% 26%)',
          800: 'hsl(188 78% 22%)',
          900: 'hsl(188 78% 18%)',
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;