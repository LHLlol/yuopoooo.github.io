import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { portfolioCategories } from "../data/portfolioData";

type SiteNavProps = {
  compact?: boolean;
  theme?: "light" | "dark";
};

const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
  event.preventDefault();
  const scroll = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (document.getElementById(sectionId)) {
    scroll();
    return;
  }

  window.location.hash = "/archive";
  window.setTimeout(scroll, 120);
};

export default function SiteNav({ compact = false, theme = "light" }: SiteNavProps) {
  const dark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const frameRef = useRef<HTMLElement>(null);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrollState = () => {
      scrollFrameRef.current = null;
      frameRef.current?.classList.toggle("site-nav-frame--scrolled", window.scrollY > 18);
    };

    const onScroll = () => {
      if (scrollFrameRef.current === null) scrollFrameRef.current = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const scrollFromMenu = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    scrollToSection(event, sectionId);
    closeMenu();
  };

  return (
    <header ref={frameRef} className={"site-nav-frame fixed left-0 right-0 top-0 z-50 px-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6" + (dark ? " site-nav-frame--dark" : "")}>
      <nav
        aria-label="Primary navigation"
        className={
          "mx-auto flex min-h-12 max-w-7xl items-center justify-between rounded-full px-5 py-2 text-[13px] shadow-glass backdrop-blur-2xl " +
          (dark ? "border border-white/28 bg-white/16 text-white" : "border border-white/70 bg-white/72 text-slate-700")
        }
      >
        <a href="#/archive" data-nav-link="true" className={"site-nav-link rounded-full font-semibold focus-visible:outline-white/90 " + (dark ? "text-white" : "text-inkBlue")}>Portfolio</a>
        <div className="hidden items-center gap-7 sm:flex">
          <a href="#selected-works" data-nav-link="true" onClick={(event) => scrollToSection(event, "selected-works")} className={"site-nav-link rounded-full focus-visible:outline-white/90 " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>Works</a>
          <a href="#about-me" data-nav-link="true" onClick={(event) => scrollToSection(event, "about-me")} className={"site-nav-link rounded-full focus-visible:outline-white/90 " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>About</a>
          <a href="mailto:lhl20040919@gmail.com" data-nav-link="true" className={"site-nav-link rounded-full focus-visible:outline-white/90 " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>Contact</a>
        </div>
        <div className="flex items-center gap-3 sm:hidden">
          <button
            type="button"
            className={(dark ? "text-white" : "text-inkBlue") + " site-nav-menu-button min-h-11 rounded-full px-3 font-medium focus-visible:outline-white/90"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {!compact && (
        <div className={"pointer-events-none mx-auto mt-3 hidden max-w-7xl justify-end pr-5 text-[11px] uppercase md:flex " + (dark ? "text-white/44" : "text-inkBlue/45")}>PORTFOLIO 2026</div>
      )}

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div id="mobile-navigation" className="site-nav-mobile-layer sm:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="site-nav-mobile-backdrop" aria-label="关闭导航菜单" onClick={closeMenu} />
            <motion.div
              className={(dark ? "bg-[#079fe7] text-white" : "bg-white/96 text-slate-900") + " site-nav-mobile-sheet"}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Navigate</p>
                <button type="button" className="min-h-11 min-w-11 rounded-full border border-current/25 px-3 text-xs font-semibold" onClick={closeMenu} aria-label="关闭导航菜单">×</button>
              </div>
              <div className="grid gap-1 pt-4">
                <a href="#selected-works" onClick={(event) => scrollFromMenu(event, "selected-works")} className="site-nav-mobile-link">Works / 作品</a>
                <a href="#about-me" onClick={(event) => scrollFromMenu(event, "about-me")} className="site-nav-mobile-link">About / 关于</a>
                <div className="mt-4 border-t border-current/15 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-55">Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {portfolioCategories.map((category) => (
                      <a key={category.id} href={"#/category/" + category.id} onClick={closeMenu} className="site-nav-mobile-category">
                        {category.titleCN}
                      </a>
                    ))}
                  </div>
                </div>
                <a href="mailto:lhl20040919@gmail.com" onClick={closeMenu} className="site-nav-mobile-link mt-4 border-t border-current/15 pt-4">Contact / 联系我</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
