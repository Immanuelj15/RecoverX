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
          900: '#061329',
          800: '#0C2651',
          700: '#14366F',
          600: '#1C4991',
          100: '#EEF4FF',
          50: '#F5F8FF'
        },
        brand: {
          blue: '#2D6CDF',
          blueHover: '#1B54BD',
          navy: '#0C2651',
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          border: '#E4E7EC',
          textPrimary: '#111827',
          textSecondary: '#667085',
          ai: '#635BFF',
          aiLight: '#EEF2FF'
        },
        fintech: {
          success: '#16A34A',
          successBg: '#F0FDF4',
          successBorder: '#BBF7D0',
          warning: '#F59E0B',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          danger: '#DC2626',
          dangerBg: '#FEF2F2',
          dangerBorder: '#FECACA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)',
        cardHover: '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
        dropdown: '0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.03)'
      }
    }
  },
  plugins: []
};
