import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import InteractiveImage from "../components/InteractiveImage";
import Lightbox, { type PreviewImage } from "../components/Lightbox";
import Reveal from "../components/Reveal";
import SiteNav from "../components/SiteNav";
import { type PortfolioItem } from "../data/portfolioData";
import { assetPath } from "../utils/assetPath";

type ProjectDetailPageProps = {
  item: PortfolioItem;
};

export default function ProjectDetailPage({ item }: ProjectDetailPageProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [storyboardIndex, setStoryboardIndex] = useState<number | null>(null);
  const previewImages: PreviewImage[] = useMemo(
    () => item.images.map((src) => ({ src, title: item.titleCN, subtitle: item.categorySubtitle })),
    [item],
  );
  const storyboardImages: PreviewImage[] = useMemo(
    () =>
      item.storyboard?.images.map((src, index) => ({
        src,
        title: item.storyboard?.title ?? item.titleCN,
        subtitle: `Storyboard ${String(index + 1).padStart(2, "0")}`,
      })) ?? [],
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

              {item.aigcWorkflow && (
                <section className="mt-14 border-t border-sky-200 pt-10">
                  <Reveal>
                    <div className="max-w-3xl">
                      <p className="text-sm font-semibold uppercase text-portfolioBlue">AIGC Creative Pipeline</p>
                      <h3 className="mt-3 text-3xl font-black text-inkBlue">AIGC 创作流程</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        以视觉设定、构图和关键帧为核心控制层，将生成模型用于概念探索与动态执行，并通过人工筛选、修复和后期确保风格与叙事连续性。
                      </p>
                    </div>
                  </Reveal>
                  <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
                    {item.aigcWorkflow.map((stage, index) => (
                      <Reveal key={stage.title} delay={(index % 2) * 80}>
                        <article className="border-t border-sky-200 pt-5">
                          <div className="flex items-start gap-4">
                            <span className="text-sm font-black text-portfolioBlue">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <h4 className="text-xl font-semibold text-slate-950">{stage.title}</h4>
                              <p className="mt-1 text-xs font-semibold uppercase text-slate-400">{stage.tools}</p>
                              <p className="mt-4 text-sm leading-7 text-slate-600">{stage.detail}</p>
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {item.promptExamples && (
                <section className="mt-14 border-t border-sky-200 pt-10">
                  <Reveal>
                    <div className="max-w-3xl">
                      <p className="text-sm font-semibold uppercase text-portfolioBlue">Prompt Engineering</p>
                      <h3 className="mt-3 text-3xl font-black text-inkBlue">镜头提示词应用</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        提示词按视觉条件、摄影机运动和稳定性约束分层编写，便于在 Lovart 中迭代关键帧，并向 Seedance 传递明确的动态意图。
                      </p>
                    </div>
                  </Reveal>
                  <div className="mt-8 grid gap-7">
                    {item.promptExamples.map((example, index) => (
                      <Reveal key={example.shot + example.title} delay={(index % 2) * 70}>
                        <article className="grid gap-5 border-t border-sky-200 py-6 lg:grid-cols-[190px_1fr]">
                          <div>
                            <p className="text-xs font-semibold uppercase text-portfolioBlue">{example.shot}</p>
                            <h4 className="mt-2 text-xl font-semibold text-slate-950">{example.title}</h4>
                          </div>
                          <dl className="grid gap-5 text-sm leading-7 text-slate-600">
                            <div>
                              <dt className="font-semibold text-slate-900">Visual Prompt / 画面</dt>
                              <dd className="mt-1">{example.visualPrompt}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-slate-900">Motion Prompt / 动态</dt>
                              <dd className="mt-1">{example.motionPrompt}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-slate-900">Control / 约束</dt>
                              <dd className="mt-1">{example.control}</dd>
                            </div>
                          </dl>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {item.storyboard && (
                <section className="mt-14 border-t border-sky-200 pt-10">
                  <Reveal>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                      <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase text-portfolioBlue">Storyboard Breakdown</p>
                        <h3 className="mt-3 text-3xl font-black text-inkBlue">{item.storyboard.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-slate-600">{item.storyboard.summary}</p>
                      </div>
                      <a
                        href={assetPath(item.storyboard.document)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit shrink-0 rounded-full border border-portfolioBlue px-5 py-2 text-sm font-semibold text-inkBlue transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Open Full Storyboard / 查看完整分镜
                      </a>
                    </div>
                  </Reveal>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {item.storyboard.images.map((src, index) => (
                      <InteractiveImage
                        key={src}
                        src={src}
                        title={item.storyboard?.title ?? item.titleCN}
                        subtitle={`Storyboard ${String(index + 1).padStart(2, "0")}`}
                        onOpen={() => setStoryboardIndex(index)}
                        mediaClassName="aspect-[16/11] bg-white"
                      />
                    ))}
                  </div>
                </section>
              )}

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
        {storyboardIndex !== null && (
          <Lightbox images={storyboardImages} activeIndex={storyboardIndex} onChange={setStoryboardIndex} onClose={() => setStoryboardIndex(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
