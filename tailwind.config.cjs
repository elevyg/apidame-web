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
        holluise: ["var(--font-holluise)", ...fontFamily.sans],
      },
      colors: {
        primaryA: "#100B00",
        primaryB: "#F4F5F6",
        secondaryA: "#59F8E8",
        secondaryB: "#FF5964",
        tertiary: "#1B065E",
      },
    },
  },
  plugins: [],
};
