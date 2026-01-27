import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";
import { brown, foregen, holluise } from "styles/font";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Apidame Boulder</title>
        <meta
          name="description"
          content="Apidame Boulder, gimansio de escalada en Chile Chico, Aysén, patagonia Chilena."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${foregen.variable} ${brown.variable} ${holluise.variable} font-sans`}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}
