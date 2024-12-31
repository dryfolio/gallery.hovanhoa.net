import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import {BASE_URL, IMAGE, NAME} from "../constants";
import Navbar from "../components/nav";
import { Inter } from 'next/font/google'
import useKeypress from "react-use-keypress";
import {Footer} from "../components/footer";


const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const closeModal = function() {
    setLastViewedPhoto(photoId);
    router.push("/", undefined, { shallow: true });
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <>
      <Head>
        <title>hovanhoa | gallery</title>
      </Head>
      <div className={inter.className}>
        <main className="min-h-screen relative pt-8">
          <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 overflow-hidden mb-10">
            <div className="items-center flex justify-between mb-6">
              <Link href={BASE_URL}>
                <Image
                    src={IMAGE}
                    alt={NAME}
                    className="h-12 w-12 rounded-full"
                    height={100}
                    width={100}
                />
              </Link>
              <Navbar/>
            </div>
          </section>
          {photoId && (
              <Modal
                  images={images}
                  onClose={closeModal}
              />
          )}
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
            {images.map(({id, public_id, format, blurDataUrl}) => (
                <Link
                    key={id}
                    href={`/?photoId=${id}`}
                    as={`/p/${id}`}
                    ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                    shallow
                    className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                >
                  <Image
                      alt="Next.js Conf photo"
                      className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                      style={{transform: "translate3d(0, 0, 0)"}}
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                      width={720}
                      height={480}
                      sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
                  />
                </Link>
            ))}
          </div>
        </main>
        <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
          <Footer/>
        </div>
      </ div>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
