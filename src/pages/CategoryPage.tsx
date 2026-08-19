import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import CardDeck from "../components/CardDeck";
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
import { assetPath } from "../utils/assetPath";

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
    <main id="main-content" className="min-h-screen bg-white text-slate-900">
      <SiteNav />

      <section className="px-5 pb-10 pt-32 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-7xl">
          <div className="border-b border-sky-200 pb-12 text-center">
          <p className="text-sm font-semibold uppercase text-portfolioBlue">{category.partLabel} · {category.categorySubtitle}</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-balance text-[clamp(2.7rem,6vw,6.4rem)] font-black leading-[0.9] tracking-normal text-inkBlue">
            {category.titleEN}
          </h1>
          <h2 className="mt-6 text-2xl font-light text-slate-700">{category.titleCN}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-8 text-slate-600">{category.intro}</p>
          <div className="category-pills mt-8 flex flex-wrap justify-center gap-3">
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
        </Reveal>
      </section>

      <section className="px-5 pb-28 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-7xl">
          <CardDeck
            items={items}
            variant="category"
            ariaLabel={`${category.titleCN} 作品卡组`}
            className="card-deck--category-page"
            renderCard={(item, state) => (
              <article className="card-deck-category-card flex h-full flex-col p-3 sm:p-4">
                <div className="card-deck__text-layer flex items-start justify-between gap-4 px-2 pb-4 sm:px-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-portfolioBlue">{item.partLabel} · Selected Work</p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">{item.titleCN}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{item.titleEN} · {item.role}</p>
                  </div>
                  <span className="shrink-0 pt-1 text-sm text-slate-400">{item.year}</span>
                </div>

                <div className="card-deck__media-layer min-h-0 flex-1">
                  <InteractiveImage
                    src={item.images[0]}
                    title={item.titleCN}
                    subtitle={item.categorySubtitle}
                    priority={state.isActive}
                    onOpen={() => openImage(item.id, 0)}
                    className="h-full min-h-0 p-2 shadow-none"
                    mediaClassName="h-full min-h-0 bg-white"
                  />
                </div>

                <div className="card-deck__media-layer mt-3 flex min-h-[4.5rem] gap-3 overflow-x-auto px-2 pb-1 sm:px-3">
                  {item.images.length > 1 ? item.images.slice(1, 4).map((src, imageIndex) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => openImage(item.id, imageIndex + 1)}
                      className="w-24 shrink-0 overflow-hidden rounded-lg border border-sky-100 bg-white transition duration-500 ease-apple hover:scale-[1.02] hover:border-portfolioBlue focus-visible:outline-portfolioBlue sm:w-28"
                      aria-label={`查看 ${item.titleCN} 图片 ${imageIndex + 2}`}
                    >
                      <img src={assetPath(src)} alt="" className="h-16 w-full object-cover sm:h-[4.5rem]" loading="lazy" />
                    </button>
                  )) : (
                    <span className="flex items-center text-xs text-slate-400">Single image study / 单张视觉展示</span>
                  )}
                </div>

                <div className="card-deck__text-layer px-2 pb-1 pt-3 sm:px-3">
                  <p className="min-h-[4.5rem] overflow-hidden text-sm leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">{item.description}</p>
                  <div className="mt-3 flex min-h-[2.5rem] flex-wrap content-start gap-2">
                    {item.highlights.slice(0, 3).map((highlight) => (
                      <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-inkBlue">{highlight}</span>
                    ))}
                  </div>
                  <a href={"#/work/" + item.id} className="mt-3 inline-flex w-fit rounded-full border border-sky-200 px-4 py-2 text-sm font-medium text-inkBlue transition hover:scale-[1.02] hover:border-portfolioBlue hover:bg-white">
                    View Detail / 查看详情
                  </a>
                </div>
              </article>
            )}
          />
        </Reveal>
      </section>

      <AnimatePresence>
        {previewIndex !== null && <Lightbox images={previewImages} activeIndex={previewIndex} onChange={setPreviewIndex} onClose={() => setPreviewIndex(null)} />}
      </AnimatePresence>
    </main>
  );
}
