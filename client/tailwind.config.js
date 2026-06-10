/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Main accent green
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        dark: {
          sidebar: "#0f172a", // Navy sidebar
          sidebarHover: "#1e293b",
          main: "#020617"
        },
        light: {
          bg: "#f8fafc", // Light background
          card: "#ffffff",
          border: "#e2e8f0"
        }
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        premium: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }
    }
  },
  plugins: []
};
