import Lightbox, { type PreviewImage } from "./Lightbox";
import type { PortfolioItem } from "../data/portfolioData";

type ImagePreviewProps = {
  items: PortfolioItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

export default function ImagePreview({ items, activeIndex, onChange, onClose }: ImagePreviewProps) {
  const images: PreviewImage[] = items.map((item) => ({
    src: item.coverImage,
    title: item.titleCN,
    subtitle: item.categorySubtitle,
  }));

  return <Lightbox images={images} activeIndex={activeIndex} onChange={onChange} onClose={onClose} />;
}
