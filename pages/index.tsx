import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Modal from '../components/Modal'
import cloudinary from '../utils/cloudinary'
import getBase64ImageUrl from '../utils/generateBlurPlaceholder'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import Navbar from '../components/nav'
import useKeypress from 'react-use-keypress'
import { Footer } from '../components/footer'
import { Analytics } from '@vercel/analytics/react'

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
    const router = useRouter()
    const { photoId } = router.query
    const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

    const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
        if (lastViewedPhoto && !photoId) {
            lastViewedPhotoRef.current.scrollIntoView({ block: 'center' })
            setLastViewedPhoto(null)
        }
    }, [photoId, lastViewedPhoto, setLastViewedPhoto])

    const closeModal = function () {
        setLastViewedPhoto(photoId)
        router.push('/', undefined, { shallow: true })
    }

    useKeypress('Escape', () => {
        closeModal()
    })

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
                            description:
                                'Hồ Văn Hòa - Software Engineer. See pictures and photos from hovanhoa | gallery.',
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
            <div className="flex min-h-screen flex-col bg-[var(--rd-bg)] text-[var(--rd-text)]">
                {!photoId && <Navbar />}
                <main className="relative flex-1">
                    <section className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(2rem,4vw,3rem)] pt-[clamp(3.5rem,8vw,6.5rem)]">
                        <div className="rd-rise max-w-[46rem]">
                            <h1 className="m-0 flex items-baseline gap-3 font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.5vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.03em] text-[var(--rd-text)]">
                                Photographs
                                <span className="font-[family-name:var(--font-mono)] text-base tracking-normal text-[var(--rd-text-3)]">
                                    {images.length}
                                </span>
                            </h1>
                            <p className="rd-lead mt-4">
                                A running collection of moments I&apos;ve
                                pointed a camera at.
                            </p>
                            <p className="m-0 mt-5 font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                                Open any frame
                                <span className="hidden sm:inline">
                                    {' '}
                                    · ← → to browse · esc to close
                                </span>
                            </p>
                        </div>
                    </section>
                    {photoId && <Modal images={images} onClose={closeModal} />}
                    <section className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(48px,6vw,80px)]">
                        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                            {images.map(
                                ({ id, public_id, format, blurDataUrl }) => (
                                    <Link
                                        key={id}
                                        href={`/?photoId=${id}`}
                                        as={`/p/${id}`}
                                        ref={
                                            id === Number(lastViewedPhoto)
                                                ? lastViewedPhotoRef
                                                : null
                                        }
                                        shallow
                                        aria-label={`Open photo ${id + 1}`}
                                        className="group relative mb-4 block w-full cursor-zoom-in overflow-hidden rounded-[var(--rd-r)] bg-[var(--rd-surface-2)] outline-none ring-offset-2 ring-offset-[var(--rd-bg)] focus-visible:ring-2 focus-visible:ring-[var(--rd-text)]"
                                    >
                                        <Image
                                            alt="hovanhoa | gallery"
                                            className="block w-full transform-gpu transition duration-500 ease-out will-change-transform group-hover:scale-[1.015] group-hover:opacity-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                            placeholder="blur"
                                            blurDataURL={blurDataUrl}
                                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                                            width={720}
                                            height={480}
                                            sizes="(max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                360px"
                                        />
                                    </Link>
                                )
                            )}
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
            <Analytics />
        </>
    )
}

export default Home

export async function getStaticProps() {
    const results = await cloudinary.v2.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
        .sort_by('filename', 'desc')
        .max_results(400)
        .execute()
    let reducedResults: ImageProps[] = []

    let i = 0
    for (let result of results.resources) {
        reducedResults.push({
            id: i,
            height: result.height,
            width: result.width,
            public_id: result.public_id,
            format: result.format,
        })
        i++
    }

    const blurImagePromises = results.resources.map((image: ImageProps) => {
        return getBase64ImageUrl(image)
    })
    const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

    for (let i = 0; i < reducedResults.length; i++) {
        reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
    }

    return {
        props: {
            images: reducedResults,
        },
    }
}
