import { useEffect, useRef } from "react";

const interactiveSelector = "a, button, [data-glow], [data-interactive-image]";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!glow || reduceMotion || !canHover) return undefined;

    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let targetScale = 1;
    let currentScale = 1;
    let targetOpacity = 0.42;
    let currentOpacity = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      currentScale += (targetScale - currentScale) * 0.12;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;
      glow.style.transform = "translate3d(" + (currentX - 160) + "px, " + (currentY - 160) + "px, 0) scale(" + currentScale + ")";
      glow.style.opacity = String(currentOpacity);
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      targetScale = target ? 1.18 : 1;
      targetOpacity = target ? 0.64 : 0.42;
    };

    const onPointerLeave = () => {
      targetOpacity = 0;
    };

    const onPointerEnter = () => {
      targetOpacity = 0.42;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointerenter", onPointerEnter, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerenter", onPointerEnter);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(186,237,255,.75)_0%,rgba(94,202,255,.34)_34%,rgba(14,165,233,.11)_58%,transparent_72%)] blur-2xl mix-blend-screen md:block"
      aria-hidden="true"
    />
  );
}
