import type { Metadata } from "next";
import { foregen, brown, holluise } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apidame Boulder",
  description:
    "Apidame Boulder, gimansio de escalada en Chile Chico, Aysén, patagonia Chilena.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${foregen.variable} ${brown.variable} ${holluise.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
