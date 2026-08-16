export const motionTokens = {
  easePrimary: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.77, 0, 0.175, 1] as const,
  durationFast: 0.18,
  durationNormal: 0.42,
  durationSlow: 0.78,
  staggerSmall: 0.06,
  staggerNormal: 0.09,
  hoverScale: 1.015,
  imageHoverScale: 1.035,
  revealDistance: 28,
  adjacentScale: 0.94,
  backScale: 0.84,
  adjacentBlur: 1.1,
  backBlur: 2.7,
} as const;

export type MotionInput = "pointer" | "keyboard" | "programmatic";
export type CardDeckMotionPhase = "idle" | "dragging" | "settling";

export type CardDeckMotionState = {
  index: number;
  previousIndex: number;
  direction: -1 | 0 | 1;
  dragProgress: number;
  isDragging: boolean;
  phase: CardDeckMotionPhase;
  input: MotionInput;
};
