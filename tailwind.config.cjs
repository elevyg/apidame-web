/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-foregen)", ...fontFamily.sans],
        forgen: ["var(--font-foregen)", ...fontFamily.sans],
        brown: ["var(--font-brown)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
