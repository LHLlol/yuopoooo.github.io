import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { portfolioCategories } from "../data/portfolioData";
import { profileData } from "../data/profileData";

type Stop = { offset: number; color: string };

const VIEWBOX_WIDTH = 1271;
const VIEWBOX_HEIGHT = 599;
const FOOTER_STOPS: Stop[] = [
  { offset: 0, color: "#06163f" },
  { offset: 0.18, color: "#0358f7" },
  { offset: 0.3, color: "#4f8fc7" },
  { offset: 0.44, color: "#dceaf5" },
  { offset: 0.58, color: "#f4fbff" },
  { offset: 0.72, color: "#8ed8f7" },
  { offset: 0.86, color: "#08a9f4" },
  { offset: 1, color: "#d9f3ff00" },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function bellHeights(count: number, peak: number, valley: number) {
  const heights: number[] = [];
  const middle = (count - 1) / 2;

  for (let index = 0; index < count; index += 1) {
    const distance = middle === 0 ? 0 : Math.abs(index - middle) / middle;
    const eased = 1 - Math.pow(distance, 1.24);
    heights.push(peak * VIEWBOX_HEIGHT * (valley + (1 - valley) * eased));
  }

  return heights;
}

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  const target = document.getElementById(sectionId);

  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  event.preventDefault();
  window.location.hash = "#/";
  window.setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 90);
}

function FooterLink({ href, children, sectionId }: { href: string; children: ReactNode; sectionId?: string }) {
  return (
    <a
      href={href}
      onClick={sectionId ? (event) => scrollToSection(event, sectionId) : undefined}
      className="portfolio-footer__link"
    >
      <span>{children}</span>
      <span className="portfolio-footer__link-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

function FooterLinks({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="portfolio-footer__mobile-groups">
        <details className="portfolio-footer__disclosure" open>
          <summary>
            <span>Explore / 浏览</span>
            <span className="portfolio-footer__disclosure-icon" aria-hidden="true">+</span>
          </summary>
          <div className="portfolio-footer__disclosure-content">
            <FooterLink href="#about-me" sectionId="about-me">About Me / 关于我</FooterLink>
            <FooterLink href="#selected-works" sectionId="selected-works">Selected Works / 精选作品</FooterLink>
          </div>
        </details>

        <details className="portfolio-footer__disclosure">
          <summary>
            <span>Archive / 作品分类</span>
            <span className="portfolio-footer__disclosure-icon" aria-hidden="true">+</span>
          </summary>
          <div className="portfolio-footer__disclosure-content">
            {portfolioCategories.map((category) => (
              <FooterLink key={category.id} href={`#/category/${category.id}`}>
                {category.titleCN}
              </FooterLink>
            ))}
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="portfolio-footer__desktop-groups">
      <div>
        <p className="portfolio-footer__group-label">Explore / 浏览</p>
        <div className="portfolio-footer__link-list">
          <FooterLink href="#about-me" sectionId="about-me">About Me / 关于我</FooterLink>
          <FooterLink href="#selected-works" sectionId="selected-works">Selected Works / 精选作品</FooterLink>
        </div>
      </div>
      <div>
        <p className="portfolio-footer__group-label">Archive / 作品分类</p>
        <div className="portfolio-footer__link-list">
          {portfolioCategories.map((category) => (
            <FooterLink key={category.id} href={`#/category/${category.id}`}>
              {category.titleCN}
            </FooterLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioFooter() {
  const uid = useId().replace(/:/g, "");
  const bandRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.045);
  const gradientHeight = "clamp(20rem, 84vh, 42rem)";

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return undefined;

    const doc = band.ownerDocument;
    const win = doc.defaultView ?? window;
    const measure = () => {
      const height = band.offsetHeight || 1;
      const scrollLeft = doc.documentElement.scrollHeight - win.innerHeight - win.scrollY;
      const reveal = clamp01((height - scrollLeft) / height);
      setProgress(0.045 + 0.955 * reveal);
    };

    measure();
    win.addEventListener("scroll", measure, { passive: true });
    win.addEventListener("resize", measure);

    return () => {
      win.removeEventListener("scroll", measure);
      win.removeEventListener("resize", measure);
    };
  }, []);

  const columnWidth = VIEWBOX_WIDTH / 9;

  return (
    <footer className="portfolio-footer" style={{ paddingBottom: `calc(${gradientHeight} + env(safe-area-inset-bottom))` }}>
      <div className="portfolio-footer__content">
        <div className="portfolio-footer__landing-line">
          <span>End of the page / 页面末端</span>
          <span className="portfolio-footer__landing-arrow" aria-hidden="true">↓</span>
          <span className="portfolio-footer__landing-status">Open for visual collaboration</span>
        </div>

        <div className="portfolio-footer__layout">
          <div className="portfolio-footer__intro">
            <p className="portfolio-footer__eyebrow">Let the next frame begin.</p>
            <h2 className="portfolio-footer__title">继续把想法<br />做成画面。</h2>
            <p className="portfolio-footer__copy">如果你有一个值得被看见的故事、品牌或视觉实验，欢迎从这里开始下一次合作。</p>
            <a className="portfolio-footer__contact" href={`mailto:${profileData.email}`}>
              <span>{profileData.email}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="portfolio-footer__navigation">
            <FooterLinks />
            <FooterLinks mobile />
          </div>
        </div>

        <div className="portfolio-footer__meta">
          <span>© 2026 Lin Hongle</span>
          <span>{profileData.location} · Available for selected projects</span>
          <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</a>
        </div>
      </div>

      <div
        ref={bandRef}
        className="portfolio-footer__gradient"
        aria-hidden="true"
        style={{
          height: gradientHeight,
          transform: `scaleY(${progress})`,
        }}
      >
        <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`portfolio-footer-gradient-${uid}`} x1="0" y1="1" x2="0" y2="0">
              {FOOTER_STOPS.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
            <filter id={`portfolio-footer-ambient-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>
          {bellHeights(9, 0.9, 0.45).map((barHeight, index) => (
            <rect
              key={index}
              x={index * columnWidth}
              y={VIEWBOX_HEIGHT - barHeight}
              width={columnWidth * 1.23}
              height={barHeight}
              fill={`url(#portfolio-footer-gradient-${uid})`}
              filter={`url(#portfolio-footer-ambient-${uid})`}
            />
          ))}
        </svg>
      </div>
    </footer>
  );
}
