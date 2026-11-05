import {
    ArrowDownTrayIcon,
    ArrowTopRightOnSquareIcon,
    ArrowUturnLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { variants } from '../utils/animationVariants'
import downloadPhoto from '../utils/downloadPhoto'
import { range } from '../utils/range'
import type { ImageProps, SharedModalProps } from '../utils/types'
import Twitter from './Icons/Twitter'

// round glass control — hairline border on a blurred dark surface; the viewer
// always sits on a dark backdrop, so it reads the same in light and dark mode
const ctl =
    'inline-flex items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-xl transition hover:border-white/30 hover:bg-black/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

export default function SharedModal({
    index,
    images,
    changePhotoId,
    closeModal,
    navigation,
    currentPhoto,
    direction,
}: SharedModalProps) {
    const [loaded, setLoaded] = useState(false)

    // Reset loaded state when index changes to ensure smooth transitions
    useEffect(() => {
        setLoaded(false)
    }, [index])

    let filteredImages = images?.filter((img: ImageProps) =>
        range(index - 15, index + 15).includes(img.id)
    )

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (index < images?.length - 1) {
                changePhotoId(index + 1)
            }
        },
        onSwipedRight: () => {
            if (index > 0) {
                changePhotoId(index - 1)
            }
        },
        trackMouse: true,
    })

    let currentImage = images ? images[index] : currentPhoto

    return (
        <MotionConfig
            transition={{
                x: { type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.3 },
            }}
        >
            <div
                className="relative z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
                {...handlers}
            >
                {/* Main image */}
                <div className="w-full overflow-hidden">
                    <div className="relative flex aspect-[3/2] items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="full-image w-1/2"
                            >
                                <Image
                                    src={`https://res.cloudinary.com/${
                                        process.env
                                            .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                                    }/image/upload/c_scale,${
                                        navigation ? 'w_1280' : 'w_1920'
                                    }/${currentImage.public_id}.${
                                        currentImage.format
                                    }`}
                                    width={navigation ? 1280 : 1920}
                                    height={navigation ? 853 : 1280}
                                    priority
                                    alt="hovanhoa | gallery image"
                                    className="rounded-[var(--rd-r)]"
                                    onLoad={() => setLoaded(true)}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Buttons + bottom nav bar */}
                <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
                    {/* Buttons */}
                    {loaded && (
                        <div className="relative aspect-[3/2] max-h-full w-full">
                            {navigation && (
                                <>
                                    {index > 0 && (
                                        <button
                                            className={`${ctl} absolute left-3 top-[calc(50%-22px)] h-11 w-11`}
                                            style={{
                                                transform:
                                                    'translate3d(0, 0, 0)',
                                            }}
                                            onClick={() =>
                                                changePhotoId(index - 1)
                                            }
                                            aria-label="Previous photo"
                                        >
                                            <ChevronLeftIcon className="h-[18px] w-[18px]" />
                                        </button>
                                    )}
                                    {index + 1 < images.length && (
                                        <button
                                            className={`${ctl} absolute right-3 top-[calc(50%-22px)] h-11 w-11`}
                                            style={{
                                                transform:
                                                    'translate3d(0, 0, 0)',
                                            }}
                                            onClick={() =>
                                                changePhotoId(index + 1)
                                            }
                                            aria-label="Next photo"
                                        >
                                            <ChevronRightIcon className="h-[18px] w-[18px]" />
                                        </button>
                                    )}
                                </>
                            )}
                            <div className="absolute right-0 top-0 flex items-center gap-2 p-3 text-white">
                                {navigation ? (
                                    <a
                                        href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`}
                                        className={`${ctl} h-9 w-9`}
                                        target="_blank"
                                        title="Open full-size version"
                                        aria-label="Open full-size version"
                                        rel="noreferrer"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-[18px] w-[18px]" />
                                    </a>
                                ) : (
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20pic%20from%20hovanhoa%20|%20gallery!%0A%0Ahttps://gallery.hovanhoa.net/p/${index}`}
                                        className={`${ctl} h-9 w-9`}
                                        target="_blank"
                                        title="Share on Twitter"
                                        aria-label="Share on Twitter"
                                        rel="noreferrer"
                                    >
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() =>
                                        downloadPhoto(
                                            `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`,
                                            `hovanhoa_${index}.${currentImage.format}`
                                        )
                                    }
                                    className={`${ctl} h-9 w-9`}
                                    title="Download full-size version"
                                    aria-label="Download full-size version"
                                >
                                    <ArrowDownTrayIcon className="h-[18px] w-[18px]" />
                                </button>
                            </div>
                            <div className="absolute left-0 top-0 flex items-center gap-2 p-3 text-white">
                                <button
                                    onClick={() => closeModal()}
                                    className={`${ctl} h-9 w-9`}
                                    aria-label={
                                        navigation
                                            ? 'Close'
                                            : 'Back to the gallery'
                                    }
                                    title={
                                        navigation
                                            ? 'Close'
                                            : 'Back to the gallery'
                                    }
                                >
                                    {navigation ? (
                                        <XMarkIcon className="h-[18px] w-[18px]" />
                                    ) : (
                                        <ArrowUturnLeftIcon className="h-[18px] w-[18px]" />
                                    )}
                                </button>
                                {navigation && images?.length > 0 && (
                                    <span className="inline-flex h-9 items-center rounded-full border border-white/15 bg-black/40 px-3 font-[family-name:var(--font-mono)] text-[0.72rem] tabular-nums text-white/80 backdrop-blur-xl">
                                        {index + 1} / {images.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Bottom Nav bar */}
                    {navigation && (
                        <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/70">
                            <motion.div
                                initial={false}
                                className="mx-auto mb-6 mt-6 flex aspect-[3/2] h-14"
                            >
                                <AnimatePresence initial={false}>
                                    {filteredImages.map(
                                        ({ public_id, format, id }) => (
                                            <motion.button
                                                initial={{
                                                    width: '0%',
                                                    x: `${Math.max(
                                                        (index - 1) * -100,
                                                        15 * -100
                                                    )}%`,
                                                }}
                                                animate={{
                                                    scale:
                                                        id === index ? 1.25 : 1,
                                                    width: '100%',
                                                    x: `${Math.max(
                                                        index * -100,
                                                        15 * -100
                                                    )}%`,
                                                }}
                                                exit={{ width: '0%' }}
                                                onClick={() =>
                                                    changePhotoId(id)
                                                }
                                                key={id}
                                                className={`${
                                                    id === index
                                                        ? 'z-20 rounded-[var(--rd-r-sm)] ring-1 ring-white/40'
                                                        : 'z-10'
                                                } ${
                                                    id === 0
                                                        ? 'rounded-l-[var(--rd-r-sm)]'
                                                        : ''
                                                } ${
                                                    id === images.length - 1
                                                        ? 'rounded-r-[var(--rd-r-sm)]'
                                                        : ''
                                                } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                                            >
                                                <Image
                                                    alt="small photos on the bottom"
                                                    width={180}
                                                    height={120}
                                                    className={`${
                                                        id === index
                                                            ? 'brightness-110 hover:brightness-110'
                                                            : 'brightness-50 contrast-125 hover:brightness-75'
                                                    } h-full transform object-cover transition`}
                                                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_180/${public_id}.${format}`}
                                                />
                                            </motion.button>
                                        )
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </MotionConfig>
    )
}
