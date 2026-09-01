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
          900: '#0B0F19', // Dark Slate
          800: '#111827', // Navy
          700: '#1F2937', // Card Surfaces
          600: '#374151',
          100: '#EEF4FF',
          50: '#F5F8FF'
        },
        brand: {
          blue: '#2B6CB0', // Razorpay Blue
          blueHover: '#3182CE',
          cyan: '#00F2FE', // Accent Electric Cyan
          bg: '#0B0F19', // Primary Background
          surface: '#1F2937', // Card Surface
          border: '#374151',
          textPrimary: '#F9FAFB',
          textSecondary: '#9CA3AF',
          ai: '#635BFF',
          aiLight: '#EEF2FF'
        },
        fintech: {
          success: '#10B981', // Success Green
          successBg: 'rgba(16, 185, 129, 0.1)',
          successBorder: 'rgba(16, 185, 129, 0.2)',
          warning: '#F59E0B', // Warning Gold
          warningBg: 'rgba(245, 158, 11, 0.1)',
          warningBorder: 'rgba(245, 158, 11, 0.2)',
          danger: '#EF4444', // Alert Crimson
          dangerBg: 'rgba(239, 68, 68, 0.1)',
          dangerBorder: 'rgba(239, 68, 68, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
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
