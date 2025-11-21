/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light, eye-catching industrial palette
        'hmi-bg': '#f3f4f6', // Light gray page background
        'bg-primary': '#f9fafb',
        'bg-panel': '#ffffff',
        'bg-card': '#ffffff',
        'pass': '#16a34a', // Green
        'fail': '#dc2626', // Red
        'primary': '#2563eb', // Blue
        'chip-pass': '#16a34a',
        'chip-fail': '#dc2626',
        'chip-review': '#0ea5e9',
        'muted': '#6b7280',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'hmi-elevated': '0 18px 45px rgba(15,23,42,0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}

