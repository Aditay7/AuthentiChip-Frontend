/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        'hmi-bg': 'var(--hmi-bg)',
        'bg-primary': 'var(--bg-primary)',
        'bg-panel': 'var(--bg-panel)',
        'bg-card': 'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-color': 'var(--border-color)',
        'pass': 'var(--pass)',
        'fail': 'var(--fail)',
        'primary': 'var(--primary)',
        'chip-pass': 'var(--chip-pass)',
        'chip-fail': 'var(--chip-fail)',
        'chip-review': 'var(--chip-review)',
        'muted': 'var(--muted)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
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

