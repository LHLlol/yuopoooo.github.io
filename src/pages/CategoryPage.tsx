import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import InteractiveImage from "../components/InteractiveImage";
import Lightbox, { type PreviewImage } from "../components/Lightbox";
import Reveal from "../components/Reveal";
import SiteNav from "../components/SiteNav";
import WireBirdMark from "../components/WireBirdMark";
import {
  getCategoryById,
  getItemsByCategory,
  portfolioCategories,
  type PortfolioCategoryId,
} from "../data/portfolioData";

type CategoryPageProps = {
  categoryId: PortfolioCategoryId;
};

type CategoryPreviewImage = PreviewImage & {
  itemId: string;
  imageIndex: number;
};

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const category = getCategoryById(categoryId);
  const items = getItemsByCategory(categoryId);
  const previewImages: CategoryPreviewImage[] = useMemo(
    () =>
      items.flatMap((item) =>
        item.images.map((src, imageIndex) => ({
          src,
          title: item.titleCN,
          subtitle: item.categorySubtitle,
          itemId: item.id,
          imageIndex,
        })),
      ),
    [items],
  );

  const openImage = (itemId: string, imageIndex: number) => {
    const nextIndex = previewImages.findIndex((image) => image.itemId === itemId && image.imageIndex === imageIndex);
    if (nextIndex >= 0) setPreviewIndex(nextIndex);
  };

  if (!category) return null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteNav />

      <section className="px-5 pb-10 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl border-b border-sky-200 pb-12 text-center">
          <p className="text-sm font-semibold uppercase text-portfolioBlue">{category.partLabel} · {category.categorySubtitle}</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-[clamp(2.7rem,6vw,6.4rem)] font-black leading-[0.9] tracking-normal text-inkBlue">
            {category.titleEN}
          </h1>
          <h2 className="mt-6 text-2xl font-light text-slate-700">{category.titleCN}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600">{category.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {portfolioCategories.map((item) => (
              <a
                key={item.id}
                href={"#/category/" + item.id}
                className={
                  "rounded-full border px-4 py-2 text-sm transition hover:scale-[1.03] " +
                  (item.id === category.id
                    ? "border-portfolioBlue bg-portfolioBlue text-white"
                    : "border-sky-200 bg-sky-50 text-inkBlue hover:bg-white")
                }
              >
                {item.partLabel} · {item.titleCN}
              </a>
            ))}
          </div>
          <WireBirdMark />
        </div>
      </section>

      <section className="px-5 pb-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {items[0] && (
            <Reveal>
              <article className="mx-auto mb-16 max-w-6xl rounded-[18px] border border-sky-100 bg-[#f8fbff] p-4 shadow-[0_22px_80px_rgba(0,87,160,0.08)]">
                <div className="mb-6 text-center">
                  <p className="text-sm font-semibold uppercase text-portfolioBlue">Featured Project</p>
                  <h3 className="mt-2 text-3xl font-black text-slate-900 sm:text-5xl">{items[0].titleCN}</h3>
                  <p className="mt-3 text-base text-slate-500">{items[0].titleEN} · {items[0].role}</p>
                </div>
                <InteractiveImage
                  src={items[0].images[0]}
                  title={items[0].titleCN}
                  subtitle={items[0].categorySubtitle}
                  priority
                  onOpen={() => openImage(items[0].id, 0)}
                  className="p-3 shadow-none"
                  mediaClassName="aspect-[16/10] bg-white"
                />
                {items[0].images.length > 1 && (
                  <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
                    {items[0].images.slice(1).map((src, imageIndex) => (
                      <InteractiveImage
                        key={src}
                        src={src}
                        title={items[0].titleCN}
                        subtitle={items[0].categorySubtitle}
                        onOpen={() => openImage(items[0].id, imageIndex + 1)}
                        className="min-w-[220px] max-w-[220px] p-2 shadow-[0_16px_52px_rgba(0,92,170,0.07)] sm:min-w-[260px] sm:max-w-[260px]"
                        mediaClassName="aspect-[4/3] bg-white"
                      />
                    ))}
                  </div>
                )}
                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
                  {items[0].highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-inkBlue">{highlight}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          )}

          <div className="grid items-stretch gap-10 md:grid-cols-2">
            {items.slice(1).map((item, index) => (
              <Reveal key={item.id} delay={(index % 2) * 90} className="h-full">
                <article className="flex h-full flex-col rounded-[14px] border border-sky-100 bg-[#f8fbff] p-3 shadow-[0_18px_60px_rgba(0,87,160,0.07)]">
                  <InteractiveImage
                    src={item.images[0]}
                    title={item.titleCN}
                    subtitle={item.categorySubtitle}
                    onOpen={() => openImage(item.id, 0)}
                    className="shrink-0 shadow-none"
                    mediaClassName="aspect-[16/10] bg-white"
                  />
                  <div className="mt-4 flex min-h-[118px] gap-3 overflow-x-auto pb-2">
                    {item.images.length > 1 ? (
                      item.images.slice(1).map((src, imageIndex) => (
                        <InteractiveImage
                          key={src}
                          src={src}
                          title={item.titleCN}
                          subtitle={item.categorySubtitle}
                          onOpen={() => openImage(item.id, imageIndex + 1)}
                          className="min-w-[152px] max-w-[152px] rounded-[10px] p-1.5 shadow-none sm:min-w-[178px] sm:max-w-[178px]"
                          mediaClassName="aspect-[4/3] bg-white"
                        />
                      ))
                    ) : (
                      <div className="min-w-full rounded-[10px] border border-dashed border-sky-100 bg-white/56" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-3 pt-5">
                    <p className="text-xs font-semibold uppercase text-portfolioBlue">{item.partLabel} · Selected Work</p>
                    <h3 className="mt-2 min-h-[64px] text-2xl font-semibold leading-tight text-slate-900">{item.titleCN}</h3>
                    <p className="mt-1 min-h-[40px] text-sm leading-5 text-slate-500">{item.titleEN} · {item.role}</p>
                    <p className="mt-4 min-h-[112px] overflow-hidden text-sm leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">{item.description}</p>
                    <div className="mt-4 flex min-h-[58px] flex-wrap content-start gap-2">
                      {item.highlights.slice(0, 3).map((highlight) => (
                        <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-inkBlue">{highlight}</span>
                      ))}
                    </div>
                    <a href={"#/work/" + item.id} className="mt-auto inline-flex w-fit rounded-full border border-sky-200 px-4 py-2 text-sm font-medium text-inkBlue transition hover:scale-[1.03] hover:border-portfolioBlue hover:bg-white">
                      View Detail / 查看详情
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {previewIndex !== null && <Lightbox images={previewImages} activeIndex={previewIndex} onChange={setPreviewIndex} onClose={() => setPreviewIndex(null)} />}
      </AnimatePresence>
    </main>
  );
}
