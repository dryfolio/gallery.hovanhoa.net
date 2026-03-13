## hovanhoa | gallery

Personal photo gallery built with Next.js, [Cloudinary](https://cloudinary.com), and [Tailwind CSS](https://tailwindcss.com), deployed at [`https://gallery.hovanhoa.net/`](https://gallery.hovanhoa.net/).

### Live site

- **Production**: [`https://gallery.hovanhoa.net/`](https://gallery.hovanhoa.net/)

### Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (e.g. in `.env.local`):

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=your_folder
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

### References

- Cloudinary transformations: https://cloudinary.com/documentation/transformation_reference