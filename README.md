# gallery.hovanhoa.net

Personal photography gallery built with Next.js and Cloudinary, live at [gallery.hovanhoa.net](https://gallery.hovanhoa.net).

## Overview

This is a statically generated photography portfolio site. All images are fetched from Cloudinary at build time — there is no server, no database, and no runtime API. The result is a fast, CDN-served static site that requires zero backend infrastructure to run.

The gallery supports:
- A masonry grid layout on the homepage
- URL-based photo modals (`/?photoId=X`) that open without a full navigation
- Individual photo pages (`/p/[photoId]`) with carousel navigation
- Keyboard and swipe navigation through photos
- Photo downloads
- Blur placeholders generated at build time for smooth image loading
- Analytics via Vercel Analytics

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (Static Site Generation) |
| Image hosting | [Cloudinary](https://cloudinary.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| UI primitives | [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/) |
| Swipe gestures | [react-swipeable](https://github.com/FormidableLabs/react-swipeable) |
| Hosting | [Vercel](https://vercel.com/) |

## Project structure

```
pages/
  index.tsx                   — homepage; masonry grid + URL-based modal
  p/[photoId].tsx             — individual photo page with carousel
  404.tsx                     — custom 404 page
  sitemap.ts                  — auto-generated sitemap
  robots.ts                   — robots.txt

components/
  SharedModal.tsx             — core full-screen image viewer (used by modal + photo page)
  Modal.tsx                   — modal wrapper that renders SharedModal over the grid
  Carousel.tsx                — carousel wrapper for the individual photo page
  nav.tsx                     — site navigation
  hero.tsx                    — homepage hero section
  footer.tsx                  — site footer

utils/
  cloudinary.ts               — Cloudinary SDK wrapper; fetches image list from configured folder
  cachedImages.ts             — deduplicates Cloudinary fetches across getStaticProps/getStaticPaths
  generateBlurPlaceholder.ts  — generates base64 blur placeholders at build time
  downloadPhoto.ts            — handles client-side photo downloads
  animationVariants.ts        — centralised Framer Motion animation configs
  types.ts                    — ImageProps interface and shared types
  useLastViewedPhoto.ts       — hook to restore scroll position to the last viewed photo
  images.cache.json           — cached Cloudinary response (see Build cache below)

constants/
  index.tsx                   — owner name, social URLs, and other site-wide constants
```

## How it works

At build time, Next.js calls `getStaticProps` and `getStaticPaths`, which trigger the Cloudinary fetch. The fetch is deduplicated by `cachedImages.ts` so the API is only called once per build regardless of how many pages are generated. For each image, a base64 blur placeholder is generated locally using `imagemin` and `imagemin-jpegtran`. All of this data is baked into the static HTML/JS output — no Cloudinary calls happen at runtime.

```
Cloudinary folder (configured via CLOUDINARY_FOLDER env var)
       ↓
utils/cloudinary.ts              — lists images via Cloudinary Search API
utils/cachedImages.ts            — caches the result in memory across static generation calls
utils/generateBlurPlaceholder.ts — fetches each image and generates a tiny base64 LQIP
       ↓
pages/index.tsx                  — receives images as props, renders masonry grid
pages/p/[photoId].tsx            — receives images as props, renders individual photo + carousel
components/SharedModal.tsx       — full-screen viewer with keyboard (← →, Esc) and swipe nav
```

## Local development

### Prerequisites

- Node.js 18+
- A Cloudinary account with images uploaded to a folder

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/hovanhoa/gallery.hovanhoa.net.git
   cd gallery.hovanhoa.net
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=your_folder_path
   ```

   `CLOUDINARY_FOLDER` is the folder path inside your Cloudinary account that contains the gallery images (e.g. `photography/2024`).

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

   > **Note:** In dev mode, images are fetched from Cloudinary on every request (or from the cache file if present). This is slower than production but useful for iteration.

## Commands

```bash
npm run dev      # Start the Next.js development server (http://localhost:3000)
npm run build    # Production build — fetches images from Cloudinary and generates all static pages
npm run start    # Serve the production build locally
npm run lint     # Run ESLint
```

## Build cache

`utils/images.cache.json` caches the Cloudinary API response. If the file exists, the build reads from it instead of calling the Cloudinary API — which is useful in environments with unreliable outbound network access (e.g. Vercel's build environment in some regions).

To refresh the cache locally, run:

```bash
node -e "
const c = require('cloudinary');
c.v2.config({
  cloud_name: '<NAME>',
  api_key: '<KEY>',
  api_secret: '<SECRET>',
  secure: true,
});
c.v2.search
  .expression('folder:<FOLDER>/*')
  .sort_by('filename', 'desc')
  .max_results(400)
  .execute()
  .then(r => {
    require('fs').writeFileSync('utils/images.cache.json', JSON.stringify(r));
    console.log('Cached', r.total_count, 'images');
  });
"
```

Replace `<NAME>`, `<KEY>`, `<SECRET>`, and `<FOLDER>` with your Cloudinary credentials and folder path. Commit the updated `images.cache.json` to use it in your next deployment.

## Deployment

The site is deployed on Vercel. Any push to `main` triggers a production build. No environment variables need to be set beyond the four listed above — Vercel handles everything else.

If the Cloudinary API is unreliable during Vercel builds, commit a fresh `images.cache.json` (see above) before pushing, and the build will use it instead.
