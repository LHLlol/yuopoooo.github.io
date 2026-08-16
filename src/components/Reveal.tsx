import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "fade" | "mask" | "card";
  once?: boolean;
};

export const staggerDelay = (index: number, step = 60, max = 240) => Math.min(index * step, max);

export default function Reveal({ children, className = "", delay = 0, variant = "fade-up", once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.unobserve(element);
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal="true"
      className={`reveal-shell reveal-shell--${variant} ${visible ? "reveal-shell--visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
