import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const ease = [0.22, 1, 0.36, 1] as const;

export default function Lightbox({ images, activeIndex, onChange, onClose }: LightboxProps) {
  const image = images[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange(Math.max(activeIndex - 1, 0));
      if (event.key === "ArrowRight") onChange(Math.min(activeIndex + 1, images.length - 1));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length, onChange, onClose]);

  if (!image) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-slate-950/90 p-4 text-white backdrop-blur-2xl sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.38, ease }}
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
          onClick={onClose}
          className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl transition duration-500 ease-apple hover:scale-[1.03] hover:bg-white/18"
        >
          Close / 关闭
        </button>
      </div>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onChange(Math.max(activeIndex - 1, 0));
          }}
          disabled={activeIndex === 0}
          className="h-11 w-11 rounded-full border border-white/25 bg-white/10 text-2xl leading-none transition duration-500 ease-apple hover:scale-[1.04] hover:bg-sky-300/20 disabled:opacity-25"
          aria-label="上一张"
        >
          ‹
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={image.src}
            className="flex min-h-0 justify-center"
            initial={{ scale: 0.9, y: 26, opacity: 0, filter: "blur(18px)" }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.96, y: -10, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.68, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={image.src}
              alt={image.title}
              className="max-h-[calc(100vh-150px)] w-auto max-w-full rounded-lg object-contain shadow-[0_0_110px_rgba(125,211,252,0.38)]"
            />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onChange(Math.min(activeIndex + 1, images.length - 1));
          }}
          disabled={activeIndex === images.length - 1}
          className="h-11 w-11 rounded-full border border-white/25 bg-white/10 text-2xl leading-none transition duration-500 ease-apple hover:scale-[1.04] hover:bg-sky-300/20 disabled:opacity-25"
          aria-label="下一张"
        >
          ›
        </button>
      </div>
    </motion.div>
  );
}
