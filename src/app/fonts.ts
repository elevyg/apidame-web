import localFont from "next/font/local";

export const foregen = localFont({
  src: [
    {
      path: "../assets/fonts/The-Foregen-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/The-Foregen-Outline.ttf",
      style: "normal",
      weight: "100",
    },
  ],
  variable: "--font-foregen",
  fallback: ["system-ui", "arial"],
});

export const brown = localFont({
  src: [
    {
      path: "../assets/fonts/BrownStd-Regular.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/BrownStd-Light.otf",
      style: "normal",
      weight: "200",
    },
    {
      path: "../assets/fonts/BrownStd-Bold.otf",
      style: "normal",
      weight: "600",
    },
  ],
  variable: "--font-brown",
});

export const holluise = localFont({
  src: [
    {
      path: "../assets/fonts/Holluise-Regular.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-holluise",
});
