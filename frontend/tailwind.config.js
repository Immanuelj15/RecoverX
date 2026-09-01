/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#080B12', // Near-black navy background
          800: '#111722', // Surface
          700: '#171F2C', // Elevated surface
          600: '#263143', // Borders/dividers
          100: '#EEF4FF',
          50: '#F5F8FF'
        },
        brand: {
          blue: '#2B6CB0', // Razorpay Blue
          blueHover: '#3182CE',
          cyan: '#00F2FE', // Legacy cyan
          bg: '#080B12', // Primary Background
          surface: '#111722', // Card Surface
          border: '#263143', // Subtle blue-gray border
          textPrimary: '#F9FAFB',
          textSecondary: '#9CA3AF',
          ai: '#635BFF', // Subtle violet/blue
          aiLight: '#EEF2FF'
        },
        fintech: {
          success: '#10B981', // Emerald
          successBg: 'rgba(16, 185, 129, 0.1)',
          successBorder: 'rgba(16, 185, 129, 0.2)',
          warning: '#F59E0B', // Amber
          warningBg: 'rgba(245, 158, 11, 0.1)',
          warningBorder: 'rgba(245, 158, 11, 0.2)',
          danger: '#EF4444', // Red
          dangerBg: 'rgba(239, 68, 68, 0.1)',
          dangerBorder: 'rgba(239, 68, 68, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px rgba(0, 242, 254, 0.3)'
      }
    }
  },
  plugins: []
};
