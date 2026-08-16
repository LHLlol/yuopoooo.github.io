import { useEffect, useRef, type CSSProperties } from "react";

const ambientMotionConfig = {
  enabled: true,
  intensity: 0.28,
} as const;

const initialStyle = {
  "--ambient-motion-intensity": ambientMotionConfig.intensity,
  "--ambient-pointer-x": 0,
  "--ambient-pointer-y": 0,
} as CSSProperties;

export default function AmbientMotionLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!layer) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      layer.classList.toggle("is-active", entry.isIntersecting);
    });
    observer.observe(layer);

    if (reduceMotion || !canHover) {
      return () => observer.disconnect();
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const renderPointer = () => {
      frame = 0;
      layer.style.setProperty("--ambient-pointer-x", pointerX.toFixed(3));
      layer.style.setProperty("--ambient-pointer-y", pointerY.toFixed(3));
    };

    const schedulePointerRender = () => {
      if (!frame) frame = window.requestAnimationFrame(renderPointer);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      schedulePointerRender();
    };

    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      schedulePointerRender();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  if (!ambientMotionConfig.enabled) return null;

  return (
    <div ref={layerRef} className="ambient-motion-layer pointer-events-none absolute inset-0 z-0 overflow-hidden" style={initialStyle} aria-hidden="true">
      <span className="ambient-motion-orb ambient-motion-orb--one" />
      <span className="ambient-motion-orb ambient-motion-orb--two" />
      <span className="ambient-motion-sheen" />
    </div>
  );
}
