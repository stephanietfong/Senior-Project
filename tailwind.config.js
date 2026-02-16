/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.css"],
  theme: {
    extend: {
      colors: {
        customDarkBlue: "#7793C2",
        customBlue: "#9CADD8",
        customGreen: "#BAC67A",
        customBrown: "#655B5B",
        customGray: "#D9D9D9",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        redhat: ["Red Hat Text", "sans-serif"],
      },
    },
  },
  plugins: [],
};
