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
import Navbar from "../components/nav";
import { Eyebrow } from "../components/redesign/eyebrow";
import useKeypress from "react-use-keypress";
import {Footer} from "../components/footer";
import { Analytics } from "@vercel/analytics/react"

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'hovanhoa | gallery',
              url: 'https://gallery.hovanhoa.net',
              description: 'Hồ Văn Hòa - Software Engineer. See pictures and photos from hovanhoa | gallery.',
              author: {
                '@type': 'Person',
                name: 'Hồ Văn Hòa',
                alternateName: 'hovanhoa',
                jobTitle: 'Software Engineer',
              },
            }),
          }}
        />
      </Head>
      <div>
        {!photoId && (
          <header className="sticky top-0 z-50 border-b border-[var(--rd-border-2)] bg-[var(--rd-bg-sub)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-3">
              <Navbar/>
            </div>
          </header>
        )}
        <main className="min-h-screen relative">
          <div
            className="border-b border-[var(--rd-border)]"
            style={{
              background:
                'radial-gradient(100% 140% at 0% 0%, var(--rd-accent-bg), transparent 55%), var(--rd-surface-2)',
            }}
          >
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pt-12 pb-12">
              <Eyebrow>hovanhoa · gallery</Eyebrow>
              <h1 className="mt-[18px] text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-[-0.04em] text-[var(--rd-text)]">
                photographs
              </h1>
              <p className="rd-lead mt-5">
                a running collection of moments i&apos;ve pointed a camera at.
              </p>
            </div>
          </div>
          {photoId && (
              <Modal
                  images={images}
                  onClose={closeModal}
              />
          )}
          <div className="mx-auto mt-12 max-w-[var(--rd-maxw)] columns-1 gap-4 px-[var(--rd-pad)] sm:columns-2 lg:columns-3 xl:columns-4">
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
                      alt="hovanhoa | gallery"
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
        <Footer/>
      </ div>
      <Analytics/>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("filename", "desc")
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
