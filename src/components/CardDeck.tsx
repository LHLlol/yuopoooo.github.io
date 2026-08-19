import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { type CardDeckMotionState, type MotionInput } from "../utils/motionTokens";

type CardDeckRenderState = {
  index: number;
  offset: number;
  isActive: boolean;
  isPrevious: boolean;
  isNext: boolean;
};

type CardDeckProps<T> = {
  items: readonly T[];
  renderCard: (item: T, state: CardDeckRenderState) => ReactNode;
  ariaLabel: string;
  variant?: "project" | "category" | "media" | "text";
  className?: string;
  initialIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onMotionChange?: (state: CardDeckMotionState) => void;
  showIndex?: boolean;
};

type CardDeckArrowProps = {
  direction: "previous" | "next";
  label: string;
  onActivate: () => void;
};

function CardDeckArrow({ direction, label, onActivate }: CardDeckArrowProps) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      className={`card-deck__arrow card-deck__arrow--${direction}`}
      aria-label={label}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onActivate();
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={isPrevious ? "M14.5 5 7.5 12l7 7" : "m9.5 5 7 7-7 7"} />
      </svg>
    </button>
  );
}

const dragThreshold = 44;
const maxDragDistance = 180;

const normalizeIndex = (index: number, length: number) => {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
};

const circularOffset = (index: number, activeIndex: number, length: number) => {
  if (length <= 1) return 0;

  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
};

export default function CardDeck<T>({
  items,
  renderCard,
  ariaLabel,
  variant = "project",
  className = "",
  initialIndex = 0,
  onActiveIndexChange,
  onMotionChange,
  showIndex = true,
}: CardDeckProps<T>) {
  const [activeIndex, setActiveIndex] = useState(() => normalizeIndex(initialIndex, items.length));
  const [isDragging, setIsDragging] = useState(false);
  const [focusPulse, setFocusPulse] = useState(0);
  const [focusDirection, setFocusDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const dragFrameRef = useRef<number | null>(null);
  const suppressCardClickRef = useRef(false);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    horizontal: false,
    moved: false,
  });
  const didDragRef = useRef(false);

  useEffect(() => {
    const nextIndex = normalizeIndex(activeIndex, items.length);
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  }, [activeIndex, items.length]);

  const setIndex = (nextIndex: number, input: MotionInput = "programmatic") => {
    const normalized = normalizeIndex(nextIndex, items.length);
    const previousIndex = activeIndex;
    const forwardDistance = (normalized - previousIndex + items.length) % items.length;
    const direction: -1 | 0 | 1 = normalized === previousIndex ? 0 : forwardDistance === 1 ? 1 : -1;
    setActiveIndex(normalized);
    onActiveIndexChange?.(normalized);
    onMotionChange?.({
      index: normalized,
      previousIndex,
      direction,
      dragProgress: 0,
      isDragging: false,
      phase: "settling",
      input,
    });
    if (direction !== 0 && input !== "keyboard" && !reduceMotion) {
      setFocusDirection(direction);
      setFocusPulse((current) => current + 1);
    }
  };

  const moveBy = (delta: number, input: MotionInput = "programmatic") => {
    if (items.length < 2) return;
    setIndex(activeIndex + delta, input);
  };

  const clearDragStyles = () => {
    const deck = deckRef.current;
    if (!deck) return;

    deck.style.setProperty("--deck-drag-x", "0px");
    deck.style.setProperty("--deck-drag-rotate", "0deg");
    deck.style.setProperty("--deck-drag-progress", "0");
    deck.style.setProperty("--deck-drag-shadow-x", "0px");
    deck.style.setProperty("--deck-drag-shadow-y", "0px");
    deck.style.setProperty("--deck-drag-shadow-scale", "1");
    deck.style.setProperty("--deck-drag-shadow-opacity", "0");
    deck.dataset.dragDirection = "";
  };

  const applyDragStyles = () => {
    const deck = deckRef.current;
    if (!deck) return;

    const deltaX = Math.max(-maxDragDistance, Math.min(maxDragDistance, dragRef.current.currentX - dragRef.current.startX));
    const width = Math.max(deck.getBoundingClientRect().width, 1);
    const progress = Math.min(1, Math.abs(deltaX) / Math.min(140, width * 0.42));

    deck.style.setProperty("--deck-drag-x", `${deltaX}px`);
    deck.style.setProperty("--deck-drag-rotate", `${((deltaX / width) * 3.5).toFixed(2)}deg`);
    deck.style.setProperty("--deck-drag-progress", progress.toFixed(3));
    deck.style.setProperty("--deck-drag-shadow-x", `${(-deltaX * 0.035).toFixed(2)}px`);
    deck.style.setProperty("--deck-drag-shadow-y", `${(18 + progress * 8).toFixed(2)}px`);
    deck.style.setProperty("--deck-drag-shadow-scale", `${(1 + progress * 0.018).toFixed(3)}`);
    deck.style.setProperty("--deck-drag-shadow-opacity", `${(0.26 + progress * 0.08).toFixed(3)}`);
    deck.dataset.dragDirection = deltaX < 0 ? "next" : deltaX > 0 ? "previous" : "";
    onMotionChange?.({
      index: activeIndex,
      previousIndex: activeIndex,
      direction: deltaX < 0 ? 1 : deltaX > 0 ? -1 : 0,
      dragProgress: Math.max(-1, Math.min(1, deltaX / Math.min(140, width * 0.42))),
      isDragging: true,
      phase: "dragging",
      input: "pointer",
    });
    dragFrameRef.current = null;
  };

  const scheduleDragStyles = () => {
    if (dragFrameRef.current === null) {
      dragFrameRef.current = window.requestAnimationFrame(applyDragStyles);
    }
  };

  const resetDrag = () => {
    const hadPointer = dragRef.current.pointerId !== -1 || isDragging;
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
    dragFrameRef.current = null;
    clearDragStyles();
    dragRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      horizontal: false,
      moved: false,
    };
    setIsDragging(false);
    if (hadPointer) {
      onMotionChange?.({
        index: activeIndex,
        previousIndex: activeIndex,
        direction: 0,
        dragProgress: 0,
        isDragging: false,
        phase: "idle",
        input: "pointer",
      });
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (items.length < 2 || event.pointerType === "mouse" && event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      horizontal: false,
      moved: false,
    };
    onMotionChange?.({
      index: activeIndex,
      previousIndex: activeIndex,
      direction: 0,
      dragProgress: 0,
      isDragging: true,
      phase: "dragging",
      input: "pointer",
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    dragRef.current.currentX = event.clientX;
    dragRef.current.currentY = event.clientY;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;

    if (!dragRef.current.horizontal) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
        resetDrag();
        return;
      }

      dragRef.current.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    dragRef.current.moved = Math.abs(deltaX) >= 8;
    scheduleDragStyles();
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const wasHorizontal = dragRef.current.horizontal;
    const shouldChange = wasHorizontal && Math.abs(deltaX) >= dragThreshold;
    if (wasHorizontal) {
      didDragRef.current = dragRef.current.moved;
      if (shouldChange) moveBy(deltaX < 0 ? 1 : -1, "pointer");
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetDrag();
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1, "keyboard");
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1, "keyboard");
    }
  };

  useEffect(() => () => {
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      ref={deckRef}
      className={`card-deck card-deck--${variant} ${isDragging ? "card-deck--dragging" : ""} ${className}`}
      data-drag-direction=""
      data-active-index={activeIndex}
      data-transitioning={isDragging ? "dragging" : "idle"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetDrag}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="card-deck__stage">
        <AnimatePresence initial={false}>
          {focusPulse > 0 && (
            <motion.span
              key={focusPulse}
              className="card-deck__focus-sweep"
              initial={{ opacity: 0, x: focusDirection > 0 ? "-110%" : "110%" }}
              animate={{
                opacity: [0, 0.12, 0],
                x: focusDirection > 0 ? ["-110%", "0%", "110%"] : ["110%", "0%", "-110%"],
              }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        {items.length > 1 && (
          <>
            <CardDeckArrow
              direction="previous"
              label={`${ariaLabel} 上一张`}
              onActivate={() => moveBy(-1, "pointer")}
            />
            <CardDeckArrow
              direction="next"
              label={`${ariaLabel} 下一张`}
              onActivate={() => moveBy(1, "pointer")}
            />
          </>
        )}
        {items.map((item, index) => {
          const offset = circularOffset(index, activeIndex, items.length);
          const absoluteOffset = Math.abs(offset);
          const isActive = offset === 0;
          const isPrevious = offset === -1;
          const isNext = offset === 1;
          const isFar = absoluteOffset > 2;
          const scale = isActive ? 1 : Math.max(0.84, 0.94 - Math.max(absoluteOffset - 1, 0) * 0.05);
          const opacity = isActive ? 1 : Math.max(0.56, 0.8 - Math.max(absoluteOffset - 1, 0) * 0.12);
          const rotation = isActive ? 0 : Math.max(-7, Math.min(7, offset * 3.2));
          const cardStyle = {
            "--deck-offset": offset,
            "--deck-scale": scale,
            "--deck-opacity": opacity,
            "--deck-rotation": `${rotation}deg`,
            "--deck-z-index": 20 - absoluteOffset,
            "--deck-text-blur": isActive
              ? "var(--card-blur-active)"
              : absoluteOffset === 1
                ? "var(--card-blur-adjacent)"
                : "var(--card-blur-back)",
            "--deck-text-opacity": isActive
              ? "var(--card-text-opacity-active)"
              : absoluteOffset === 1
                ? "var(--card-text-opacity-adjacent)"
                : "var(--card-text-opacity-back)",
            "--deck-media-saturate": isActive
              ? "var(--card-media-saturate-active)"
              : absoluteOffset === 1
                ? "var(--card-media-saturate-adjacent)"
                : "var(--card-media-saturate-back)",
            "--deck-media-brightness": isActive
              ? "var(--card-media-brightness-active)"
              : absoluteOffset === 1
                ? "var(--card-media-brightness-adjacent)"
                : "var(--card-media-brightness-back)",
            "--deck-media-opacity": isActive
              ? "var(--card-media-opacity-active)"
              : absoluteOffset === 1
                ? "var(--card-media-opacity-adjacent)"
                : "var(--card-media-opacity-back)",
          } as CSSProperties;

          return (
            <div
              key={index}
              className={`card-deck__card ${isActive ? "card-deck__card--active" : ""} ${isPrevious ? "card-deck__card--previous" : ""} ${isNext ? "card-deck__card--next" : ""} ${absoluteOffset > 1 ? "card-deck__card--distant" : ""} ${isFar ? "card-deck__card--far" : ""}`}
              style={cardStyle}
              onPointerDownCapture={(event) => {
                if (!isActive && !isFar) {
                  event.stopPropagation();
                  suppressCardClickRef.current = true;
                  setIndex(index, "pointer");
                }
              }}
              onClickCapture={(event) => {
                if (suppressCardClickRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  suppressCardClickRef.current = false;
                  return;
                }
                if (!isActive) {
                  event.preventDefault();
                  event.stopPropagation();
                  setIndex(index, "pointer");
                }
              }}
              aria-hidden={isFar}
              inert={isFar || undefined}
            >
              <span className="card-deck__shadow-layer" aria-hidden="true" />
              {renderCard(item, { index, offset, isActive, isPrevious, isNext })}
            </div>
          );
        })}
      </div>

      {showIndex && items.length > 1 && (
        <div className="card-deck__footer" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <span className="card-deck__footer-hint">Drag / Swipe</span>
        </div>
      )}
    </div>
  );
}
