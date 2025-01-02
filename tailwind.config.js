/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005B9E',
          dark: '#004B81'
        },
        secondary: {
          DEFAULT: '#F2A900',
          dark: '#D99600'
        },
        success: '#4CAF50',
        error: '#D32F2F',
        info: '#E3F2FD',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: {
          DEFAULT: '#333333',
          secondary: '#6A6A6A'
        },
        dark: {
          text: '#F5F5F5',
          surface: '#1A1A1A',
          background: '#121212'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'h1': ['28px', '1.2'],
        'h2': ['24px', '1.3'],
        'h3': ['20px', '1.4'],
        'body': ['16px', '1.5'],
        'small': ['14px', '1.5']
      }
    },
  },
  plugins: [],
}