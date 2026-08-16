import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import CardDeck from "./CardDeck";
import InteractiveImage from "./InteractiveImage";
import Lightbox, { type PreviewImage } from "./Lightbox";
import Reveal from "./Reveal";
import { getFeaturedItems } from "../data/portfolioData";
import { type CardDeckMotionState, motionTokens } from "../utils/motionTokens";

export default function SelectedWorksPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [scenePulse, setScenePulse] = useState(0);
  const [scenePulseDirection, setScenePulseDirection] = useState<1 | -1>(1);
  const sceneResetRef = useRef<number | null>(null);
  const featured = useMemo(() => getFeaturedItems(), []);
  const previewImages: PreviewImage[] = featured.map((item) => ({
    src: item.coverImage,
    title: item.titleCN,
    subtitle: item.categorySubtitle,
  }));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -34]);

  const handleDeckMotion = useCallback((state: CardDeckMotionState) => {
    const scene = sectionRef.current;
    if (!scene) return;

    const progress = state.dragProgress;
    scene.style.setProperty("--deck-scene-drag-x", `${(progress * 12).toFixed(2)}px`);
    scene.style.setProperty("--deck-scene-drag-y", `${(progress * -4).toFixed(2)}px`);
    scene.style.setProperty("--deck-scene-drag-scale", `${Math.min(0.012, Math.abs(progress) * 0.012).toFixed(4)}`);

    if (state.phase !== "settling" || state.direction === 0 || state.input === "keyboard") return;

    scene.style.setProperty("--deck-scene-shift-x", `${state.direction * 6}px`);
    scene.style.setProperty("--deck-scene-shift-y", `${state.direction * -2}px`);
    setScenePulseDirection(state.direction);
    setScenePulse((current) => current + 1);

    if (sceneResetRef.current !== null) window.clearTimeout(sceneResetRef.current);
    sceneResetRef.current = window.setTimeout(() => {
      scene.style.setProperty("--deck-scene-shift-x", "0px");
      scene.style.setProperty("--deck-scene-shift-y", "0px");
      sceneResetRef.current = null;
    }, 760);
  }, []);

  useEffect(() => () => {
    if (sceneResetRef.current !== null) window.clearTimeout(sceneResetRef.current);
  }, []);

  return (
    <section ref={sectionRef} id="selected-works" className="selected-works-scene relative overflow-hidden bg-white px-5 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f7fbff] to-white" />
      <div className="selected-works-scene__ambient pointer-events-none absolute right-[-20rem] top-[24rem] h-[42rem] w-[42rem] rounded-full bg-sky-100/70 blur-3xl" />
      {scenePulse > 0 && (
        <motion.span
          key={scenePulse}
          className="selected-works-scene__pulse pointer-events-none absolute inset-y-0 z-0 w-[42%]"
          initial={{ opacity: 0, x: scenePulseDirection > 0 ? "-120%" : "120%" }}
          animate={{ opacity: [0, 0.1, 0], x: scenePulseDirection > 0 ? ["-120%", "0%", "120%"] : ["120%", "0%", "-120%"] }}
          transition={{ duration: motionTokens.durationSlow, ease: motionTokens.easePrimary }}
          aria-hidden="true"
        />
      )}

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[360px_1fr]">
        <motion.div style={{ y: titleY }} className="lg:sticky lg:top-28 lg:h-fit">
          <Reveal>
            <p className="text-sm font-semibold uppercase text-portfolioBlue">Selected Works Preview</p>
            <h2 className="selected-works-heading mt-4 text-balance text-[clamp(2.25rem,4vw,4.8rem)] font-black leading-[0.96] text-inkBlue">精选作品预览</h2>
            <p className="mt-6 max-w-[64ch] text-pretty text-base leading-8 text-slate-600">
              聚合平面设计、手绘表达、动画影像与 AIGC 创意实践中的代表作品，展示从概念生成到视觉落地的综合创作能力。
            </p>
            <a href="#/category/handdrawn-graphic" className="ambient-action mt-8 inline-flex rounded-full border border-sky-200 bg-white/76 px-5 py-2 text-sm font-semibold text-inkBlue shadow-glass backdrop-blur-2xl transition duration-500 ease-apple hover:-translate-y-0.5 hover:scale-[1.03] hover:border-portfolioBlue focus-visible:outline-portfolioBlue">
              Explore Works / 浏览作品
            </a>
          </Reveal>
        </motion.div>

        <Reveal>
          <CardDeck
            items={featured}
            variant="project"
            ariaLabel="Selected Works 项目卡组"
            className="card-deck--selected-works"
            onMotionChange={handleDeckMotion}
            renderCard={(item, state) => (
              <article className="card-deck-project-card flex h-full flex-col p-3 sm:p-4">
                <div className="card-deck__media-layer min-h-0 flex-1">
                  <InteractiveImage
                    src={item.coverImage}
                    title={item.titleCN}
                    subtitle={item.categorySubtitle}
                    priority={state.isActive}
                    onOpen={() => setPreviewIndex(state.index)}
                    className="h-full min-h-0 p-2 shadow-none"
                    mediaClassName="h-full min-h-0 bg-white"
                  />
                </div>
                <div className="card-deck__text-layer px-2 pb-1 pt-4 sm:px-3">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-portfolioBlue">{item.categorySubtitle}</p>
                      <h3 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{item.titleCN}</h3>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{item.year}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.highlights.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-inkBlue">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            )}
          />
        </Reveal>
      </div>

      <AnimatePresence>
        {previewIndex !== null && <Lightbox images={previewImages} activeIndex={previewIndex} onChange={setPreviewIndex} onClose={() => setPreviewIndex(null)} />}
      </AnimatePresence>
    </section>
  );
}
