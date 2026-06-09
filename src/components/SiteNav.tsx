import { type MouseEvent } from "react";

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

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={
          "mx-auto flex h-12 max-w-7xl items-center justify-between rounded-full px-5 text-[13px] shadow-glass backdrop-blur-2xl " +
          (dark ? "border border-white/28 bg-white/16 text-white" : "border border-white/70 bg-white/72 text-slate-700")
        }
      >
        <a href="#/archive" className={"font-semibold transition hover:scale-[1.03] " + (dark ? "text-white" : "text-inkBlue")}>Portfolio</a>
        <div className="hidden items-center gap-7 sm:flex">
          <a href="#selected-works" onClick={(event) => scrollToSection(event, "selected-works")} className={"transition hover:scale-[1.03] " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>Works</a>
          <a href="#about-me" onClick={(event) => scrollToSection(event, "about-me")} className={"transition hover:scale-[1.03] " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>About</a>
          <a href="mailto:lhl20040919@gmail.com" className={"transition hover:scale-[1.03] " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>Contact</a>
        </div>
        <div className="flex items-center gap-3 sm:hidden">
          <a href="#selected-works" onClick={(event) => scrollToSection(event, "selected-works")} className={"transition hover:scale-[1.03] " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>Works</a>
          <a href="#about-me" onClick={(event) => scrollToSection(event, "about-me")} className={"transition hover:scale-[1.03] " + (dark ? "hover:text-sky-100" : "hover:text-inkBlue")}>About</a>
        </div>
      </nav>
      {!compact && (
        <div className={"pointer-events-none mx-auto mt-3 hidden max-w-7xl justify-end pr-5 text-[11px] uppercase md:flex " + (dark ? "text-white/44" : "text-inkBlue/45")}>PORTFOLIO 2026</div>
      )}
    </header>
  );
}
