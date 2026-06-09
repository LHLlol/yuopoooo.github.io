import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import InteractiveImage from "../components/InteractiveImage";
import Lightbox, { type PreviewImage } from "../components/Lightbox";
import Reveal from "../components/Reveal";
import SiteNav from "../components/SiteNav";
import { type PortfolioItem } from "../data/portfolioData";

type ProjectDetailPageProps = {
  item: PortfolioItem;
};

export default function ProjectDetailPage({ item }: ProjectDetailPageProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const previewImages: PreviewImage[] = useMemo(
    () => item.images.map((src) => ({ src, title: item.titleCN, subtitle: item.categorySubtitle })),
    [item],
  );

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-900">
      <SiteNav compact />

      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <a
            href={"#/category/" + item.category}
            className="mb-10 inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-inkBlue shadow-glass backdrop-blur-2xl transition hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white"
          >
            ← Back / 返回
          </a>

          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <aside>
              <div className="sticky top-28">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">{item.partLabel} · {item.categorySubtitle}</p>
                <h1 className="mt-4 text-[clamp(2.4rem,4.8vw,4.8rem)] font-black leading-[0.95] text-inkBlue">
                  {item.titleCN}
                </h1>
                <h2 className="mt-5 text-2xl font-light text-slate-700">{item.titleEN}</h2>

                <dl className="mt-10 space-y-6 border-t border-sky-200 pt-8 text-sm">
                  <div>
                    <dt className="font-semibold uppercase text-slate-400">Year</dt>
                    <dd className="mt-1 text-slate-700">{item.year}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase text-slate-400">Role</dt>
                    <dd className="mt-1 text-slate-700">{item.role}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase text-slate-400">Highlights</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {item.highlights.map((highlight) => (
                        <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-inkBlue">
                          {highlight}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>

            <div>
              <Reveal>
                <InteractiveImage
                  src={item.coverImage}
                  title={item.titleCN}
                  subtitle={item.categorySubtitle}
                  priority
                  onOpen={() => setPreviewIndex(0)}
                  className="p-3"
                />
              </Reveal>

              <section className="mt-12 grid gap-8 border-t border-sky-200 pt-10 md:grid-cols-2">
                <Reveal>
                  <div>
                    <p className="text-sm font-semibold uppercase text-portfolioBlue">Project Note</p>
                    <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <div>
                    <p className="text-sm font-semibold uppercase text-portfolioBlue">Responsibilities</p>
                    <div className="mt-4 grid gap-3">
                      {item.responsibilities.map((responsibility) => (
                        <p key={responsibility} className="rounded-xl bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-[0_10px_30px_rgba(0,90,160,.04)]">
                          {responsibility}
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>

              <section className="mt-12 border-t border-sky-200 pt-10">
                <p className="text-sm font-semibold uppercase text-portfolioBlue">Work Gallery</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {item.previewImages.map((src, index) => (
                    <InteractiveImage
                      key={src}
                      src={src}
                      title={item.titleCN}
                      subtitle={item.categorySubtitle}
                      onOpen={() => setPreviewIndex(index)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {previewIndex !== null && <Lightbox images={previewImages} activeIndex={previewIndex} onChange={setPreviewIndex} onClose={() => setPreviewIndex(null)} />}
      </AnimatePresence>
    </main>
  );
}
