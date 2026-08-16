import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { assetPath } from "../utils/assetPath";
import { motionTokens } from "../utils/motionTokens";

export type PreviewImage = {
  src: string;
  title: string;
  subtitle?: string;
};

type LightboxProps = {
  images: PreviewImage[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

export default function Lightbox({ images, activeIndex, onChange, onClose }: LightboxProps) {
  const image = images[activeIndex];
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState<1 | -1>(1);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const changeImage = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    onChange(nextIndex);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") changeImage(Math.max(activeIndex - 1, 0));
      if (event.key === "ArrowRight") changeImage(Math.min(activeIndex + 1, images.length - 1));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length, onChange, onClose]);

  if (!image) return null;

  return (
    <motion.div
      className="lightbox-shell fixed inset-0 z-[80] flex flex-col overflow-hidden bg-slate-950/90 p-4 text-white backdrop-blur-2xl sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: motionTokens.easePrimary }}
      onClick={onClose}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="relative z-10 mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-sky-200/55">Work Focus</p>
          <h2 className="text-xl font-semibold">{image.title}</h2>
          {image.subtitle && <p className="mt-1 text-sm text-white/50">{image.subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl transition duration-500 ease-apple hover:scale-[1.03] hover:bg-white/18 focus-visible:outline-white"
          aria-label="关闭预览"
        >
          Close / 关闭
        </button>
      </div>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            changeImage(Math.max(activeIndex - 1, 0));
          }}
          disabled={activeIndex === 0}
          className="size-11 rounded-full border border-white/25 bg-white/10 text-2xl leading-none transition duration-500 ease-apple hover:scale-[1.04] hover:bg-sky-300/20 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-25"
          aria-label="上一张"
        >
          ‹
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={image.src}
            className="lightbox-media flex min-h-0 justify-center"
            initial={reduceMotion ? false : { scale: 0.96, x: direction * 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { scale: 0.985, x: direction * -24, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: motionTokens.easePrimary }}
            onPointerDown={(event) => {
              pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              const start = pointerRef.current;
              pointerRef.current = null;
              if (!start) return;
              const deltaX = event.clientX - start.x;
              const deltaY = event.clientY - start.y;
              if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
              event.stopPropagation();
              changeImage(deltaX < 0 ? Math.min(activeIndex + 1, images.length - 1) : Math.max(activeIndex - 1, 0));
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={assetPath(image.src)}
              alt={image.title}
              className="lightbox-image max-h-[calc(100vh-150px)] w-auto max-w-full rounded-lg object-contain"
            />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            changeImage(Math.min(activeIndex + 1, images.length - 1));
          }}
          disabled={activeIndex === images.length - 1}
          className="size-11 rounded-full border border-white/25 bg-white/10 text-2xl leading-none transition duration-500 ease-apple hover:scale-[1.04] hover:bg-sky-300/20 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-25"
          aria-label="下一张"
        >
          ›
        </button>
      </div>
    </motion.div>
  );
}
