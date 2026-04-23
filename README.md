# gallery.hovanhoa.net

Personal photography gallery built with Next.js and Cloudinary, live at [gallery.hovanhoa.net](https://gallery.hovanhoa.net).

## Stack

- **Next.js** — static site generation (SSG), no runtime API
- **Cloudinary** — image storage and transformations
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Vercel** — hosting

## How it works

Images are fetched from Cloudinary at build time and rendered as a static site. There is no server or runtime API — every page is pre-generated.

```
Cloudinary folder
       ↓
utils/cloudinary.ts       — fetches image list via Cloudinary SDK
utils/cachedImages.ts     — dedups fetches across getStaticProps/getStaticPaths
utils/generateBlurPlaceholder.ts — generates base64 blur placeholders
       ↓
pages/index.tsx           — masonry grid; clicking a photo opens /?photoId=X
pages/p/[photoId].tsx     — individual photo page with carousel navigation
components/SharedModal.tsx — full-screen viewer (keyboard + swipe navigation)
```

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_FOLDER=   # folder path in your Cloudinary account
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev      # development server
npm run build    # production build (fetches images from Cloudinary)
npm run start    # production server
npm run lint     # ESLint
```

## Build cache

`utils/images.cache.json` caches the Cloudinary image list. If the file exists, the build uses it instead of calling the Cloudinary API — useful in environments with unreliable network access (e.g. Vercel).

To refresh the cache locally:

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
