/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#5141af",

          secondary: "#2fce42",

          accent: "#fc0a9f",

          neutral: "#243642",

          "base-100": "#FCFCFD",

          info: "#76B7E0",

          success: "#116F4B",

          warning: "#F5B066",

          error: "#E04869",
        },
      },
    ],
  },
};
