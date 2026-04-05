/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          primary: "hsl(var(--primary))",
          "primary-end": "hsl(var(--brand-gradient-end))",
          surface: "hsl(var(--muted))",
          success: "hsl(var(--success))",
          warning: "hsl(var(--warning))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        category: {
          1: "hsl(var(--category-1) / <alpha-value>)",
          "1-fg": "hsl(var(--category-1-fg) / <alpha-value>)",
          2: "hsl(var(--category-2) / <alpha-value>)",
          "2-fg": "hsl(var(--category-2-fg) / <alpha-value>)",
          3: "hsl(var(--category-3) / <alpha-value>)",
          "3-fg": "hsl(var(--category-3-fg) / <alpha-value>)",
          4: "hsl(var(--category-4) / <alpha-value>)",
          "4-fg": "hsl(var(--category-4-fg) / <alpha-value>)",
          5: "hsl(var(--category-5) / <alpha-value>)",
          "5-fg": "hsl(var(--category-5-fg) / <alpha-value>)",
          6: "hsl(var(--category-6) / <alpha-value>)",
          "6-fg": "hsl(var(--category-6-fg) / <alpha-value>)",
        },
      },
      boxShadow: {
        "dashboard-card": "0 8px 24px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 