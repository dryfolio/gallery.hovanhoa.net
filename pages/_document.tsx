import Document, { Head, Html, Main, NextScript } from 'next/document'

// serif display face for headings — same stylesheet as hovanhoa.net; Geist
// itself comes from next/font in _app.tsx
const DISPLAY_FONTS =
    'https://fonts.googleapis.com/css2?family=Libertinus+Serif:ital,wght@0,400;0,600;1,400&family=Noto+Serif:ital,wght@0,400;0,600;1,400&display=swap'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link rel="stylesheet" href={DISPLAY_FONTS} />
                    <link rel="canonical" href="https://gallery.hovanhoa.net" />
                    <meta
                        name="description"
                        content="Hồ Văn Hòa - Software Engineer. See pictures and photos from hovanhoa | gallery."
                    />
                    <meta
                        name="keywords"
                        content="Hồ Văn Hòa, hovanhoa, gallery, photos, pictures, photography, Software Engineer, Developer, Blog, Tech Blog, Vietnam Developer, portfolio"
                    />
                    <meta name="author" content="Hồ Văn Hòa" />
                    <meta
                        property="og:site_name"
                        content="gallery.hovanhoa.net"
                    />
                    <meta property="og:type" content="website" />
                    <meta
                        property="og:url"
                        content="https://gallery.hovanhoa.net"
                    />
                    <meta
                        property="og:description"
                        content="Hồ Văn Hòa - Software Engineer. See pictures and photos from hovanhoa | gallery."
                    />
                    <meta property="og:title" content="hovanhoa | gallery" />
                    <meta
                        property="og:image"
                        content="https://gallery.hovanhoa.net/avatar.png"
                    />
                    <meta property="og:image:width" content="800" />
                    <meta property="og:image:height" content="600" />
                    <meta property="og:image:alt" content="Hồ Văn Hòa" />
                    <meta property="og:locale" content="en_US" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@_hovanhoa_" />
                    <meta name="twitter:creator" content="@_hovanhoa_" />
                    <meta name="twitter:title" content="hovanhoa | gallery" />
                    <meta
                        name="twitter:description"
                        content="Hồ Văn Hòa - Software Engineer. See pictures and photos from hovanhoa | gallery."
                    />
                    <meta
                        name="twitter:image"
                        content="https://gallery.hovanhoa.net/avatar.png"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(){var d=document.documentElement,fam=/(^|\\.)hovanhoa\\.net$/.test(location.hostname);function apply(){var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);d.classList.toggle('dark',!!m&&m[1]==='dark')}try{if(fam)document.cookie='theme=; path=/; max-age=0';apply();addEventListener('focus',apply);addEventListener('pageshow',apply);document.addEventListener('visibilitychange',function(){if(!document.hidden)apply()});if(window.cookieStore)cookieStore.addEventListener('change',apply)}catch(e){}})()`,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
