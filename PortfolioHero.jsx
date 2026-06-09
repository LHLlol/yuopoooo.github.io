import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const motionConfig = {
  ease: [0.22, 1, 0.36, 1],
  page: { duration: 1.4 },
  title: { duration: 1.25, delay: 0.18 },
  secondary: { duration: 1.05, delay: 0.52 },
  card: { duration: 1.05 },
  staggerChildren: 0.12,
};

const heroCopyVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionConfig.staggerChildren,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionConfig.secondary.duration,
      ease: motionConfig.ease,
    },
  },
};

const delayedFadeUpVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionConfig.secondary.duration,
      delay: motionConfig.secondary.delay,
      ease: motionConfig.ease,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 34, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionConfig.title.duration,
      delay: motionConfig.title.delay,
      ease: motionConfig.ease,
    },
  },
};

const cardRevealVariants = {
  hidden: { opacity: 0, y: 42, scale: 0.965, filter: "blur(18px)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: motionConfig.card.duration,
      delay: 0.25 + index * 0.12,
      ease: motionConfig.ease,
    },
  }),
};

const workCards = [
  {
    number: "01",
    title: "Hand-drawn",
    detail: "Graphic Design",
    cn: "手绘 + 平面设计",
    className: "left-[4%] top-[8%]",
    tilt: "-5deg",
    depth: "0.58",
  },
  {
    number: "02",
    title: "Animation",
    detail: "2D / 3D Motion",
    cn: "二维三维动画",
    className: "right-[2%] top-[2%]",
    tilt: "4deg",
    depth: "0.82",
  },
  {
    number: "03",
    title: "Video",
    detail: "Film / Editing",
    cn: "视频方向",
    className: "right-[8%] bottom-[13%]",
    tilt: "-3deg",
    depth: "1.08",
  },
  {
    number: "04",
    title: "Script Design",
    detail: "Story / Board",
    cn: "编剧设计",
    className: "left-[0%] bottom-[2%]",
    tilt: "5deg",
    depth: "0.72",
  },
];

function Bird({ className = "", tilt = "0deg", scale = 1, depth = 1 }) {
  return (
    <div
      className={`bird-layer group absolute z-30 h-10 w-12 cursor-pointer ${className}`}
      style={{ "--depth": depth, "--bird-tilt": tilt, "--bird-scale": scale }}
      aria-hidden="true"
    >
      <div className="bird-shape">
        <div className="absolute bottom-1 right-2 h-7 w-6 rounded-[52%_48%_45%_55%] bg-white shadow-[0_10px_20px_rgba(0,86,160,0.14)]" />
        <div className="absolute bottom-3 right-4 h-5 w-4 origin-bottom-right rotate-[-28deg] rounded-[100%_0_100%_30%] bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-35deg]" />
        <div className="absolute bottom-1 right-8 h-3 w-5 bg-white [clip-path:polygon(0_96%,100%_0,68%_100%,100%_100%)]" />
        <div className="absolute bottom-6 right-1 h-2 w-3 bg-white [clip-path:polygon(0_42%,100%_0,34%_100%)]" />
      </div>
    </div>
  );
}

function WorkCard({ card, index, reduceMotion }) {
  return (
    <motion.div
      className={`absolute ${card.className}`}
      custom={index}
      variants={cardRevealVariants}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.24 }}
      style={{ "--depth": card.depth, "--tilt": card.tilt }}
    >
      <article
        className="glass-card card-depth w-[168px] overflow-hidden rounded-lg p-3 text-white sm:w-[192px]"
        style={{
          animation: reduceMotion ? "none" : `cardBreathe 8s ease-in-out ${index * 0.36}s infinite`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.36),transparent_48%)]" />
        <div className="relative mb-4 h-11">
          <span className="absolute left-0 top-3 h-px w-4/5 rotate-[-7deg] bg-white/90" />
          <span className="absolute bottom-2 right-0 h-px w-3/5 rotate-[8deg] bg-white/55" />
          <span className="absolute right-3 top-1 h-2.5 w-2.5 rounded-full bg-white/95" />
          <span className="absolute bottom-1 left-6 h-1.5 w-1.5 rounded-full bg-white/70" />
        </div>
        <div className="relative">
          <p className="mb-2 text-xs font-extrabold text-white/70">{card.number}</p>
          <h3 className="text-[16px] font-semibold leading-tight">{card.title}</h3>
          <p className="mt-1 text-[12px] leading-snug text-white/74">{card.detail}</p>
          <p className="mt-3 text-[11px] font-light leading-snug text-white/58">{card.cn}</p>
        </div>
      </article>
    </motion.div>
  );
}

export default function PortfolioHero() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduceMotion) return undefined;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetScroll = 0;
    let currentScroll = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      currentScroll += (targetScroll - currentScroll) * 0.08;

      hero.style.setProperty("--mx", currentX.toFixed(3));
      hero.style.setProperty("--my", currentY.toFixed(3));
      hero.style.setProperty("--scroll", currentScroll.toFixed(3));

      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      targetScroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={heroRef}
      className="portfolio-hero relative h-screen min-h-[680px] overflow-hidden bg-[#08a9f4] text-white"
      style={{ "--mx": 0, "--my": 0, "--scroll": 0 }}
    >
      <style>{`
        @keyframes wireDraw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes wireBreathe {
          0%, 100% { transform: translate3d(0, 0, 0) scaleX(1); }
          50% { transform: translate3d(0, -7px, 0) scaleX(1.008); }
        }

        @keyframes wireFlow {
          to { stroke-dashoffset: -90; }
        }

        @keyframes skyBreathe {
          0%, 100% { transform: scale(1) translate3d(0, 0, 0); filter: saturate(1); }
          50% { transform: scale(1.025) translate3d(1.2%, -1%, 0); filter: saturate(1.08); }
        }

        @keyframes glowMove {
          from { transform: translate3d(-18px, 10px, 0); }
          to { transform: translate3d(24px, -18px, 0); }
        }

        @keyframes cardBreathe {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -8px; }
        }

        @keyframes birdBreathe {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -4px; }
        }

        .sky-motion {
          animation: skyBreathe 16s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          transform-origin: 68% 18%;
        }

        .hero-wire {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation:
            wireDraw 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards,
            wireBreathe 7.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .hero-wire-flow {
          stroke-dasharray: 10 22;
          animation: wireFlow 8s linear infinite;
          opacity: .34;
        }

        .parallax-soft {
          transform: translate3d(calc(var(--mx) * var(--depth) * 10px), calc(var(--my) * var(--depth) * 8px), 0);
          will-change: transform;
        }

        .glow-one {
          animation: glowMove 12s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
        }

        .glow-two {
          animation: glowMove 14s cubic-bezier(0.22, 1, 0.36, 1) -3s infinite alternate;
        }

        .wire-depth {
          transform: translate3d(calc(var(--mx) * -7px), calc(var(--my) * -5px), 0);
          will-change: transform;
        }

        .bird-layer {
          transform: translate3d(
            calc((var(--mx) * var(--depth) * 12px) + (var(--scroll) * var(--depth) * 14px)),
            calc((var(--my) * var(--depth) * 9px) + (var(--scroll) * var(--depth) * -18px)),
            0
          );
          will-change: transform;
        }

        .bird-shape {
          position: relative;
          height: 100%;
          width: 100%;
          animation: birdBreathe 5.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          transform: rotate(var(--bird-tilt)) scale(var(--bird-scale));
          transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .bird-layer:hover .bird-shape {
          transform:
            translate3d(0, -4px, 0)
            rotate(var(--bird-tilt))
            scale(calc(var(--bird-scale) * 1.035));
        }

        .card-depth {
          transform:
            translate3d(
              calc(var(--mx) * var(--depth) * -14px),
              calc((var(--my) * var(--depth) * -10px) + (var(--scroll) * var(--depth) * -24px) + var(--hover-lift, 0px)),
              0
            )
            rotate(var(--tilt))
            scale(var(--hover-scale, 1));
          transition:
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            background 700ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .glass-card {
          position: relative;
          border: 1px solid rgba(255, 255, 255, .46);
          background: rgba(255, 255, 255, .18);
          backdrop-filter: blur(22px) saturate(1.35);
          -webkit-backdrop-filter: blur(22px) saturate(1.35);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .34),
            inset 0 -1px 0 rgba(255, 255, 255, .12),
            0 18px 48px rgba(0, 70, 145, .13);
        }

        .glass-card:hover {
          --hover-lift: -4px;
          --hover-scale: 1.015;
          background: rgba(255, 255, 255, .23);
          border-color: rgba(255, 255, 255, .58);
        }

        .glass-pill {
          border: 1px solid rgba(255, 255, 255, .58);
          background: rgba(255, 255, 255, .18);
          backdrop-filter: blur(18px) saturate(1.25);
          -webkit-backdrop-filter: blur(18px) saturate(1.25);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .34),
            0 16px 42px rgba(0, 70, 145, .12);
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-hero *,
          .portfolio-hero *::before,
          .portfolio-hero *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .001ms !important;
          }

          .parallax-soft,
          .wire-depth,
          .bird-layer,
          .card-depth {
            transform: none !important;
          }
        }
      `}</style>

      <motion.div
        className="sky-motion absolute inset-[-3%] bg-[radial-gradient(circle_at_68%_16%,rgba(255,255,255,0.34),transparent_15%),radial-gradient(circle_at_18%_68%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(132deg,#09aaf4_0%,#13b8ff_46%,#049ce9_100%)]"
        initial={reduceMotion ? false : { opacity: 0.88 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: motionConfig.page.duration, ease: motionConfig.ease }}
      />
      <div className="parallax-soft absolute right-[10vw] top-[8vh] h-[28vw] w-[28vw] [--depth:.4]">
        <div className="glow-one h-full w-full rounded-full bg-white/20 blur-2xl" />
      </div>
      <div className="parallax-soft absolute bottom-[10vh] right-[38vw] h-[18vw] w-[18vw] [--depth:.25]">
        <div className="glow-two h-full w-full rounded-full bg-white/15 blur-2xl" />
      </div>

      <motion.nav
        className="glass-pill absolute left-4 right-4 top-4 z-40 flex h-11 items-center justify-between rounded-full px-5 text-xs text-white/78 sm:left-8 sm:right-8 md:left-12 md:right-12"
        initial={reduceMotion ? false : { opacity: 0, y: -12, filter: "blur(10px)" }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.35, ease: motionConfig.ease }}
      >
        <span>LIN HONGLE</span>
        <span>PORTFOLIO 2026</span>
      </motion.nav>

      <div className="absolute left-0 top-0 z-20 w-max whitespace-nowrap pt-[1px] text-[12px] font-medium leading-none text-white/50 sm:text-sm">
        PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO PORTFOLIO
      </div>

      <svg
        className="wire-depth absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 1440 780"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="hero-wire"
          d="M -40 225 C 260 190, 530 188, 810 220 S 1210 304, 1480 272"
          fill="none"
          stroke="rgba(255,255,255,.82)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="hero-wire hero-wire-flow"
          d="M -40 225 C 260 190, 530 188, 810 220 S 1210 304, 1480 272"
          fill="none"
          stroke="rgba(255,255,255,.9)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="hero-wire"
          d="M -60 350 C 285 316, 490 276, 790 312 S 1215 392, 1500 354"
          fill="none"
          stroke="rgba(255,255,255,.72)"
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
          style={{ animationDelay: "120ms, -1.2s" }}
        />
        <path
          className="hero-wire"
          d="M -70 478 C 260 450, 540 396, 850 420 S 1210 510, 1490 492"
          fill="none"
          stroke="rgba(255,255,255,.58)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ animationDelay: "240ms, -2.4s" }}
        />
      </svg>

      <div className="parallax-soft absolute right-[18vw] top-[23vh] z-20 hidden h-[48vh] w-24 [--depth:.24] md:block">
        <div className="relative h-full w-20 skew-y-[-5deg] rounded-t-[32px] bg-[linear-gradient(180deg,#dbe4f5,#aab6d4)] shadow-[18px_22px_44px_rgba(0,70,145,0.16)]">
          <div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-[50%] bg-white/75 shadow-[inset_-18px_-4px_0_rgba(0,70,145,0.12)]" />
        </div>
      </div>

      <div className="parallax-soft absolute right-[14vw] top-[27vh] z-20 hidden h-24 w-[360px] [--depth:.34] md:block">
        <div className="relative h-11 w-[340px] rotate-[-13deg] rounded-md bg-[linear-gradient(180deg,#0a559b,#082a58)] shadow-[0_16px_34px_rgba(0,60,130,0.18)]">
          <div className="absolute -top-2 left-4 h-2.5 w-full rounded-md bg-[#9ed2ff]" />
          <span className="absolute -top-16 left-[20%] h-16 w-8 rounded-t-full bg-[repeating-linear-gradient(180deg,#d6ecff_0_9px,#6688c8_9px_16px)] shadow-[inset_-8px_0_0_rgba(0,50,120,.2)]" />
          <span className="absolute -top-16 left-[52%] h-16 w-8 rounded-t-full bg-[repeating-linear-gradient(180deg,#d6ecff_0_9px,#6688c8_9px_16px)] shadow-[inset_-8px_0_0_rgba(0,50,120,.2)]" />
          <span className="absolute -top-16 left-[78%] h-16 w-8 rounded-t-full bg-[repeating-linear-gradient(180deg,#d6ecff_0_9px,#6688c8_9px_16px)] shadow-[inset_-8px_0_0_rgba(0,50,120,.2)]" />
        </div>
      </div>

      <Bird className="left-[14vw] bottom-[31vh]" tilt="-6deg" depth={0.72} />
      <Bird className="right-[12vw] top-[34vh]" tilt="5deg" scale={0.9} depth={1.04} />

      <motion.div
        className="relative z-30 flex h-full items-start px-6 pt-28 sm:px-10 md:px-16 md:pt-32 lg:px-20"
        variants={heroCopyVariants}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
      >
        <div className="max-w-[700px]">
          <motion.p
            className="mb-4 text-xs font-semibold uppercase leading-none text-white/75 sm:text-sm"
            variants={fadeUpVariants}
          >
            LIN HONGLE / MULTI-MEDIA DESIGN
          </motion.p>
          <motion.h1
            className="flex flex-col text-[clamp(4rem,10vw,10rem)] font-black leading-[.76] tracking-normal text-white drop-shadow-[0_16px_34px_rgba(0,85,160,0.12)]"
            variants={titleVariants}
          >
            <span>PORTFOLIO</span>
            <span className="text-[.78em]">2026</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-[clamp(1.55rem,4.4vw,4.2rem)] font-light leading-none text-white/95"
            variants={delayedFadeUpVariants}
          >
            林洪乐个人作品集
          </motion.p>
          <motion.p
            className="mt-5 max-w-[460px] text-sm font-light leading-7 text-white/78 sm:text-base"
            variants={delayedFadeUpVariants}
          >
            平面设计、手绘、动画、视频与编剧设计，从一根细线展开为完整的作品系统。
          </motion.p>
          <motion.a
            href="#works"
            className="glass-pill mt-8 inline-flex h-12 items-center gap-3 rounded-full px-6 text-sm font-semibold text-white hover:bg-white/25"
            variants={delayedFadeUpVariants}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.45, ease: motionConfig.ease }}
          >
            <span>View Works</span>
            <span className="font-light text-white/75">查看作品</span>
            <span className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-white" />
          </motion.a>
        </div>
      </motion.div>

      <div
        id="works"
        className="absolute bottom-[9vh] right-[5vw] z-30 h-[42vh] w-[min(500px,40vw)] max-w-[520px] max-md:bottom-16 max-md:left-5 max-md:right-5 max-md:h-[30vh] max-md:w-auto"
      >
        {workCards.map((card, index) => (
          <WorkCard key={card.number} card={card} index={index} reduceMotion={reduceMotion} />
        ))}
      </div>

      <motion.div
        className="absolute bottom-5 left-6 right-6 z-30 flex justify-between text-xs text-white/65 sm:left-10 sm:right-10 md:left-16 md:right-16"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.05, ease: motionConfig.ease }}
      >
        <span>2026 05 01</span>
        <span>Sky / Wire / Bird</span>
      </motion.div>
    </section>
  );
}
