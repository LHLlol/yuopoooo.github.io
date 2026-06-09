import { useState } from "react";
import { motion } from "framer-motion";
import AboutSection from "../components/AboutSection";
import SelectedWorksPreview from "../components/SelectedWorksPreview";
import SiteNav from "../components/SiteNav";
import { getItemsByCategory, portfolioCategories } from "../data/portfolioData";

const ease = [0.22, 1, 0.36, 1] as const;

const scrollToSelected = () => {
  document.getElementById("selected-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function Bird({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const [away, setAway] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={away ? "召回小鸟" : "让小鸟飞起"}
      data-glow="true"
      className={"group absolute z-30 h-12 w-14 cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing " + className}
      drag
      dragMomentum={false}
      dragElastic={0.14}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={away ? { opacity: 0.18, x: 160, y: -90, scale: 0.82, rotate: 10 } : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: away ? 0.9 : 0.72, delay, ease }}
      onClick={() => setAway((current) => !current)}
    >
      <motion.span className="absolute inset-0 block" animate={{ y: [0, -4, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease }}>
        <span className="absolute bottom-2 right-2 h-8 w-7 rounded-[52%_48%_45%_55%] bg-white shadow-[0_12px_24px_rgba(0,110,190,0.18)]" />
        <span className="absolute bottom-4 right-5 h-6 w-5 origin-bottom-right rotate-[-28deg] rounded-[100%_0_100%_30%] bg-white transition-transform duration-500 ease-apple group-hover:rotate-[-38deg]" />
        <span className="absolute bottom-2 right-9 h-3.5 w-6 bg-white [clip-path:polygon(0_96%,100%_0,68%_100%,100%_100%)]" />
        <span className="absolute bottom-8 right-0 h-2.5 w-3 bg-white [clip-path:polygon(0_42%,100%_0,34%_100%)]" />
      </motion.span>
    </motion.button>
  );
}

function Pole() {
  return (
    <motion.div
      className="absolute right-[14vw] top-[18vh] z-20 hidden h-[72vh] w-[430px] cursor-grab active:cursor-grabbing md:block"
      drag
      dragMomentum={false}
      dragElastic={0.12}
      initial={{ opacity: 0, y: 44, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      transition={{ duration: 1.2, delay: 0.35, ease }}
      aria-hidden="true"
      data-glow="true"
    >
      <div className="absolute left-[48%] top-20 h-[76vh] w-24 skew-y-[-4deg] rounded-t-[38px] bg-[linear-gradient(180deg,#d9e1f6,#aab3cf)] shadow-[24px_28px_60px_rgba(0,87,160,.18)]">
        <div className="absolute -top-5 left-1/2 h-10 w-28 -translate-x-1/2 rounded-[50%] bg-white/72 shadow-[inset_-22px_-5px_0_rgba(0,80,150,0.14)]" />
      </div>
      <div className="absolute left-4 top-24 h-12 w-[370px] rotate-[-13deg] rounded-md bg-[linear-gradient(180deg,#0c61a8,#082855)] shadow-[0_20px_46px_rgba(0,86,160,0.2)]">
        <div className="absolute -top-2 left-5 h-2.5 w-full rounded-md bg-[#9ed2ff]" />
        {[18, 49, 76].map((left) => (
          <span key={left} className="absolute -top-16 h-16 w-8 rounded-t-full bg-[repeating-linear-gradient(180deg,#d7ecff_0_9px,#6d89c8_9px_16px)] shadow-[inset_-8px_0_0_rgba(0,55,120,.22)]" style={{ left: left + "%" }} />
        ))}
      </div>
      <div className="absolute left-24 top-[46vh] h-12 w-[360px] rotate-[11deg] rounded-md bg-[linear-gradient(180deg,#0b5d9c,#08234d)] shadow-[0_20px_46px_rgba(0,86,160,0.18)]">
        <div className="absolute -top-2 left-5 h-2.5 w-full rounded-md bg-[#9ed2ff]" />
        {[14, 54, 80].map((left) => (
          <span key={left} className="absolute -top-12 h-12 w-7 rounded-t-full bg-[repeating-linear-gradient(180deg,#d7ecff_0_8px,#6d89c8_8px_14px)] shadow-[inset_-7px_0_0_rgba(0,55,120,.2)]" style={{ left: left + "%" }} />
        ))}
      </div>
    </motion.div>
  );
}

function WireField() {
  const [activeWire, setActiveWire] = useState<number | null>(null);
  const paths = [
    "M -80 218 C 260 186, 520 180, 825 220 S 1220 314, 1500 268",
    "M -80 352 C 276 320, 500 278, 790 312 S 1215 394, 1500 356",
    "M -80 486 C 260 452, 545 398, 854 426 S 1218 514, 1500 492",
    "M -80 574 C 270 536, 560 492, 900 500 S 1230 590, 1500 560",
  ];

  return (
    <svg className="absolute inset-0 z-10 h-full w-full" viewBox="0 0 1440 780" preserveAspectRatio="none" aria-hidden="true">
      {paths.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke={activeWire === index ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.7)"}
          strokeWidth={activeWire === index ? 1.7 : 1.05}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: activeWire === index ? 1 : 0.78, y: activeWire === index ? -7 : [0, -5, 0] }}
          transition={{ pathLength: { duration: 1.8, delay: 0.24 + index * 0.11, ease }, opacity: { duration: 0.45, ease }, y: { duration: 7 + index, repeat: activeWire === index ? 0 : Infinity, ease } }}
          onMouseEnter={() => setActiveWire(index)}
          onMouseLeave={() => setActiveWire(null)}
          onClick={() => setActiveWire(activeWire === index ? null : index)}
          className="cursor-pointer"
        />
      ))}
    </svg>
  );
}

export default function HomePage() {
  const categoryLinks = portfolioCategories.map((category) => ({ category, firstItem: getItemsByCategory(category.id)[0] }));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteNav theme="dark" />
      <section className="relative min-h-screen overflow-hidden bg-[#08a9f4] px-6 pb-12 pt-28 text-white sm:px-10 lg:px-20">
        <motion.div className="absolute inset-[-4%] bg-[radial-gradient(circle_at_68%_16%,rgba(255,255,255,0.34),transparent_15%),radial-gradient(circle_at_17%_70%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(132deg,#09aaf4_0%,#13b8ff_46%,#049ce9_100%)]" animate={{ scale: [1, 1.025, 1], x: [0, 12, 0], y: [0, -8, 0] }} transition={{ duration: 16, repeat: Infinity, ease }} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,.13)_44%,transparent_60%)] opacity-70" />
        <div className="absolute left-0 top-0 z-20 w-max whitespace-nowrap text-[12px] font-medium leading-none text-white/70 sm:text-sm">PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO</div>
        <WireField />
        <Pole />
        <Bird className="left-[13vw] top-[57vh]" delay={0.72} />
        <Bird className="right-[12vw] top-[32vh] scale-90" delay={0.94} />

        <div className="relative z-30 mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl content-between gap-12">
          <motion.div initial={{ opacity: 0, y: 30, filter: "blur(14px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.25, ease }} className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase text-sky-50/80">Graphic Design / Animation / Video / AIGC Creative Practice</p>
            <h1 className="flex flex-col text-[clamp(4.6rem,11vw,11rem)] font-black leading-[.76] tracking-normal drop-shadow-[0_18px_42px_rgba(0,93,170,.1)]">
              <span>PORTFOLIO</span>
              <span className="text-[.78em]">2026</span>
            </h1>
            <p className="mt-7 text-[clamp(1.7rem,4vw,4.5rem)] font-light leading-none text-white/94">林洪乐个人作品集</p>
            <p className="mt-6 max-w-xl text-base font-light leading-8 text-sky-50/78">平面设计、手绘、动画、视频与编剧分镜，多媒介创作从一根线展开。</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" onClick={scrollToSelected} data-glow="true" className="rounded-full border border-white/65 bg-white/16 px-6 py-3 text-sm font-semibold shadow-glass backdrop-blur-2xl transition duration-500 ease-apple hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white/24">View Works / 查看作品</button>
              <a href="mailto:lhl20040919@gmail.com" data-glow="true" className="rounded-full border border-white/30 px-6 py-3 text-sm text-white/82 transition duration-500 ease-apple hover:scale-[1.03] hover:border-white/65 hover:text-white">Contact / 联系我</a>
            </div>
          </motion.div>

          <div className="relative z-40 grid gap-4 md:grid-cols-4">
            {categoryLinks.map(({ category, firstItem }, index) => (
              <motion.a key={category.id} href={"#/category/" + category.id} data-glow="true" className="group rounded-[10px] border border-white/30 bg-white/16 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_18px_48px_rgba(0,95,170,.12)] backdrop-blur-2xl transition duration-700 ease-apple hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/22" initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9, delay: 0.78 + index * 0.1, ease }}>
                <p className="text-xs font-semibold uppercase text-sky-50/65">{category.partLabel}</p>
                <h2 className="mt-4 text-lg font-semibold">{category.titleEN}</h2>
                <p className="mt-2 text-sm font-light text-white/72">{category.titleCN}</p>
                {firstItem && <img src={firstItem.coverImage} alt={category.titleCN} className="mt-5 h-auto w-full rounded-md border border-white/18 bg-white/8 object-contain opacity-90 transition duration-700 ease-apple group-hover:scale-[1.02] group-hover:opacity-100" loading="lazy" />}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <SelectedWorksPreview />
    </main>
  );
}
