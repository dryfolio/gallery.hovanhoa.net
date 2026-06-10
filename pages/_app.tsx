import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  // next/font (and geist, which wraps it) is NOT supported in _document.tsx —
  // Next emits the class names but never injects the @font-face / CSS-variable
  // rules, so --font-geist-* resolve to empty and the page falls back to the
  // default sans stack. It must be loaded here in _app.tsx instead. The
  // .variable classes define --font-geist-sans / --font-geist-mono (consumed by
  // --font-mono in global.css); .className sets the base Geist Sans family.
  return (
    <div
      className={`rd-fonts ${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
    >
      <Component {...pageProps} />
    </div>
  );
}
