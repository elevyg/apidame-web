import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import localFont from "@next/font/local";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { brown, foregen, holluise } from "styles/font";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
