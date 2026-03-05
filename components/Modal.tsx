import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import SharedModal from "./SharedModal";

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[];
  onClose?: () => void;
}) {
  let overlayRef = useRef();
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  const { photoId } = router.query;
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);
  const lastSetIndexRef = useRef(index);
  const isInitialMountRef = useRef(true);

  // Sync curIndex with router query changes (only on initial mount or external navigation)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    if (!isNaN(index)) {
      // Only sync if this is an external navigation (browser back/forward)
      // Not from our own changePhotoId function
      if (!isNavigatingRef.current && index !== lastSetIndexRef.current) {
        setCurIndex(index);
        lastSetIndexRef.current = index;
      }
    }
  }, [index]);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose();
  }

  function changePhotoId(newVal: number) {
    // Use curIndex instead of index for direction calculation
    if (newVal > curIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    
    // Set flag and track the index we're setting to prevent useEffect interference
    isNavigatingRef.current = true;
    lastSetIndexRef.current = newVal;
    
    // Update state immediately for smooth animation
    setCurIndex(newVal);
    
    // Update URL directly using browser History API ONLY
    // Do NOT use Next.js router to prevent any reloads or re-renders
    if (typeof window !== 'undefined') {
      const newUrl = `/p/${newVal}`;
      const currentState = window.history.state || {};
      
      // Update URL without triggering Next.js router navigation
      // This completely bypasses Next.js router to prevent reloads
      window.history.replaceState(
        {
          ...currentState,
          as: newUrl,
          url: newUrl,
        },
        '',
        newUrl
      );
      
      // Update router.query manually to keep Next.js router state in sync
      // This ensures browser back/forward still works correctly
      router.query.photoId = String(newVal);
      
      // Reset navigation flag after a delay to allow animation to complete
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
    }
  }

  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < images.length) {
      changePhotoId(curIndex + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(curIndex - 1);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
