import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import InteractiveImage from "./InteractiveImage";
import Lightbox, { type PreviewImage } from "./Lightbox";
import Reveal from "./Reveal";
import { getFeaturedItems } from "../data/portfolioData";

const ease = [0.22, 1, 0.36, 1] as const;

export default function SelectedWorksPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
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
  const mainScale = useTransform(scrollYProgress, [0.08, 0.45], reduceMotion ? [1, 1] : [0.96, 1.025]);

  return (
    <section ref={sectionRef} id="selected-works" className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f7fbff] to-white" />
      <div className="pointer-events-none absolute right-[-20rem] top-[24rem] h-[42rem] w-[42rem] rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[360px_1fr]">
        <motion.div style={{ y: titleY }} className="lg:sticky lg:top-28 lg:h-fit">
          <Reveal>
            <p className="text-sm font-semibold uppercase text-portfolioBlue">Selected Works Preview</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,5.7rem)] font-black leading-[0.92] text-inkBlue">精选作品预览</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              聚合平面设计、手绘表达、动画影像与 AIGC 创意实践中的代表作品，展示从概念生成到视觉落地的综合创作能力。
            </p>
            <a href="#/category/handdrawn-graphic" className="mt-8 inline-flex rounded-full border border-sky-200 bg-white/76 px-5 py-2 text-sm font-semibold text-inkBlue shadow-glass backdrop-blur-2xl transition duration-500 ease-apple hover:-translate-y-0.5 hover:scale-[1.03] hover:border-portfolioBlue">
              Explore Works / 浏览作品
            </a>
          </Reveal>
        </motion.div>

        <div className="grid gap-8">
          {featured[0] && (
            <motion.div style={{ scale: mainScale }} transition={{ duration: 0.8, ease }}>
              <Reveal>
                <InteractiveImage
                  src={featured[0].coverImage}
                  title={featured[0].titleCN}
                  subtitle={featured[0].categorySubtitle}
                  priority
                  onOpen={() => setPreviewIndex(0)}
                  className="p-3"
                />
              </Reveal>
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {featured.slice(1).map((item, index) => {
              const offset = index % 2 === 0 ? "md:translate-y-10" : "";
              return (
                <Reveal key={item.id} delay={index * 95}>
                  <motion.div
                    className={offset}
                    initial={reduceMotion ? false : { opacity: 0.96 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1 }}
                    viewport={{ once: true, margin: "-12% 0px" }}
                    transition={{ duration: 0.9, ease }}
                  >
                    <InteractiveImage
                      src={item.coverImage}
                      title={item.titleCN}
                      subtitle={item.categorySubtitle}
                      onOpen={() => setPreviewIndex(index + 1)}
                    />
                    <div className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
                      {item.highlights.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-inkBlue">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewIndex !== null && <Lightbox images={previewImages} activeIndex={previewIndex} onChange={setPreviewIndex} onClose={() => setPreviewIndex(null)} />}
      </AnimatePresence>
    </section>
  );
}
