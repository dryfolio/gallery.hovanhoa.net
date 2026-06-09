import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
    >
      <Component {...pageProps} />
    </div>
  );
}
