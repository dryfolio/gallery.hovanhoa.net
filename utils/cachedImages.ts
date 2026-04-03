import fs from "fs";
import path from "path";
import cloudinary from "./cloudinary";

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    const cachePath = path.join(process.cwd(), "utils", "images.cache.json");
    if (fs.existsSync(cachePath)) {
      cachedResults = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } else {
      cachedResults = await cloudinary.v2.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
        .sort_by("filename", "desc")
        .max_results(400)
        .execute();
    }
  }

  return cachedResults;
}
