import { useEffect, useState } from "react";

const openingDuration = 1140;
const reducedOpeningDuration = 180;

export default function OpeningTransition() {
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    let frame = 0;
    let timer = 0;
    let released = false;

    document.body.classList.add("opening-active", "opening-ready");
    document.body.style.overflow = "hidden";

    const release = () => {
      if (released) return;
      released = true;
      document.body.classList.remove("opening-active");
      document.body.classList.remove("opening-leaving");
      document.body.classList.remove("opening-ready");
      document.body.style.overflow = previousOverflow;
      setFinished(true);
    };

    frame = window.requestAnimationFrame(() => {
      document.body.classList.add("opening-leaving");
      setLeaving(true);
    });
    timer = window.setTimeout(release, reduceMotion ? reducedOpeningDuration : openingDuration);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      if (!released) {
        document.body.classList.remove("opening-active");
        document.body.classList.remove("opening-leaving");
        document.body.classList.remove("opening-ready");
        document.body.style.overflow = previousOverflow;
      }
    };
  }, []);

  if (finished) return null;

  return (
    <div className={`opening-transition ${leaving ? "is-leaving" : ""}`} aria-hidden="true">
      <span className="opening-transition__panel opening-transition__panel--shadow" />
      <span className="opening-transition__panel opening-transition__panel--primary" />
    </div>
  );
}
