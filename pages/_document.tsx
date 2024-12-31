import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="See pictures from hovanhoa | gallery."
          />
          <meta property="og:site_name" content="gallery.hovanhoa.net" />
          <meta
            property="og:description"
            content="See pictures from hovanhoa | gallery"
          />
          <meta property="og:title" content="hovanhoa | gallery" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="hovanhoa | gallery" />
          <meta
            name="twitter:description"
            content="See pictures from hovanhoa | gallery."
          />
        </Head>
        <body className="bg-white antialiased container mx-auto">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
