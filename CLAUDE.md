# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (fetches images from Cloudinary at build time)
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no tests in this project.

## Environment Variables

Requires a `.env` file with:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=    # Cloudinary folder path containing gallery images
```

## Architecture

This is a personal photography gallery (hovanhoa.net) built with Next.js using **Static Site Generation (SSG)**. Images are fetched from Cloudinary at build time — there is no runtime API.

**Data flow:**
1. `utils/cloudinary.ts` — wraps the Cloudinary SDK, fetches image list from a configured folder
2. `utils/cachedImages.ts` — caches the image fetch so `getStaticProps`/`getStaticPaths` don't re-fetch
3. `utils/generateBlurPlaceholder.ts` — generates base64 blur placeholders for each image at build time
4. Pages receive pre-fetched images as props and render statically

**Routing:**
- `/` — masonry grid gallery (`pages/index.tsx`); clicking a photo opens a URL-based modal (`/?photoId=X`)
- `/p/[photoId]` — individual photo page with carousel navigation (`pages/p/[photoId].tsx`)
- `SharedModal.tsx` — the core full-screen image viewer used by both the modal and individual photo pages; supports keyboard and swipe navigation

**Key conventions:**
- All constants (owner name, social URLs, etc.) live in `constants/index.tsx`
- Animation configs are centralized in `utils/animationVariants.ts`
- `utils/types.ts` defines the `ImageProps` interface used throughout
- Tailwind is the only styling mechanism — no CSS modules or styled-components
- TypeScript strict mode is OFF; loose typing is acceptable
