import { useEffect, useRef, type PointerEvent } from "react";
import { assetPath } from "../utils/assetPath";

type InteractiveImageProps = {
  src: string;
  title: string;
  subtitle?: string;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  onOpen: () => void;
};

export default function InteractiveImage({
  src,
  title,
  subtitle,
  className = "",
  mediaClassName = "",
  imageClassName = "",
  priority = false,
  onOpen,
}: InteractiveImageProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ tiltX: "0deg", tiltY: "0deg", glareX: "50%", glareY: "50%" });
  const framed = mediaClassName.trim().length > 0;

  const applyPointerStyle = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--card-tilt-x", pointerRef.current.tiltX);
    card.style.setProperty("--card-tilt-y", pointerRef.current.tiltY);
    card.style.setProperty("--card-glare-x", pointerRef.current.glareX);
    card.style.setProperty("--card-glare-y", pointerRef.current.glareY);
    frameRef.current = null;
  };

  const schedulePointerStyle = () => {
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(applyPointerStyle);
  };

  const resetCardTilt = () => {
    pointerRef.current = { tiltX: "0deg", tiltY: "0deg", glareX: "50%", glareY: "50%" };
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    applyPointerStyle();
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerRef.current = {
      tiltX: `${(-y).toFixed(2)}deg`,
      tiltY: `${x.toFixed(2)}deg`,
      glareX: `${((x + 0.5) * 100).toFixed(1)}%`,
      glareY: `${((y + 0.5) * 100).toFixed(1)}%`,
    };
    schedulePointerStyle();
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCardTilt}
      onBlur={resetCardTilt}
      data-interactive-image="true"
      className={
        "interactive-image-card group relative block w-full overflow-hidden rounded-[12px] border border-sky-100 bg-white p-2 text-left focus-visible:border-portfolioBlue focus-visible:outline-portfolioBlue " +
        className
      }
    >
      <div className={"relative overflow-hidden rounded-lg " + mediaClassName}>
        <img
          src={assetPath(src)}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          className={
            (framed ? "h-full w-full object-contain " : "h-auto w-full object-contain ") +
            "interactive-image-media rounded-lg " +
            imageClassName
          }
        />
      </div>
      <span className="interactive-image-glare" aria-hidden="true" />
      <div className="interactive-image-caption pointer-events-none absolute inset-x-3 bottom-3 rounded-lg border border-white/40 bg-slate-950/55 px-4 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.36),0_12px_34px_rgba(0,90,170,.16)] backdrop-blur-2xl">
        <p className="interactive-image-caption__title text-sm font-semibold drop-shadow-[0_1px_10px_rgba(0,43,90,.45)]">{title}</p>
        {subtitle && <p className="interactive-image-caption__meta mt-1 text-xs text-white/82 drop-shadow-[0_1px_8px_rgba(0,43,90,.35)]">{subtitle}</p>}
      </div>
    </button>
  );
}
