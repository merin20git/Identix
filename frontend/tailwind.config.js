/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f5f7fb",
        card: "#ffffff",
        primary: "#2563eb", // blue
        action: "#f59e0b", // yellow
        alert: "#ef4444", // red
        ink: "#0f172a",
        slate: "#64748b",
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 6px 20px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    }
  },
  plugins: []
};
