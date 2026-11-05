import Image from 'next/image'
import { useRouter } from 'next/router'
import useKeypress from 'react-use-keypress'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import SharedModal from './SharedModal'

export default function Carousel({
    index,
    currentPhoto,
}: {
    index: number
    currentPhoto: ImageProps
}) {
    const router = useRouter()
    const [, setLastViewedPhoto] = useLastViewedPhoto()

    function closeModal() {
        setLastViewedPhoto(currentPhoto.id)
        router.push('/', undefined, { shallow: true })
    }

    function changePhotoId(newVal: number) {
        return newVal
    }

    useKeypress('Escape', () => {
        closeModal()
    })

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <button
                className="absolute inset-0 z-30 cursor-default overflow-hidden bg-black"
                aria-label="Back to the gallery"
                onClick={closeModal}
            >
                <Image
                    src={currentPhoto.blurDataUrl}
                    className="pointer-events-none h-full w-full scale-110 object-cover opacity-70 blur-2xl"
                    alt="blurred background"
                    fill
                    priority={true}
                />
            </button>
            <SharedModal
                index={index}
                changePhotoId={changePhotoId}
                currentPhoto={currentPhoto}
                closeModal={closeModal}
                navigation={false}
            />
        </div>
    )
}
