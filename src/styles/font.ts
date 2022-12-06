import localFont from "@next/font/local";

const foregen = localFont({
  src: [
    {
      path: "../assets/fonts/The-Foregen-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/The-Foregen-Outline.ttf",
      style: "outline",
      weight: "100",
    },
  ],
  variable: "--font-foregen",
  fallback: ["system-ui", "arial"],
});

const brown = localFont({
  src: [
    {
      path: "../assets/fonts/BrownStd-Regular.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/BrownStd-Light.otf",
      style: "light",
      weight: "200",
    },
    {
      path: "../assets/fonts/BrownStd-Bold.otf",
      style: "bold",
      weight: "600",
    },
  ],
  variable: "--font-brown",
});

export { foregen, brown };
