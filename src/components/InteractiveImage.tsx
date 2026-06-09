type InteractiveImageProps = {
  src: string;
  title: string;
  subtitle?: string;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  onOpen: () => void;
};

export default function InteractiveImage({
  src,
  title,
  subtitle,
  className = "",
  mediaClassName = "",
  imageClassName = "",
  priority = false,
  onOpen,
}: InteractiveImageProps) {
  const framed = mediaClassName.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      data-interactive-image="true"
      className={
        "group relative block w-full overflow-hidden rounded-[12px] border border-sky-100 bg-white p-2 text-left shadow-[0_24px_80px_rgba(0,92,170,0.08)] transition duration-700 ease-apple hover:-translate-y-1 hover:scale-[1.025] hover:border-sky-200 hover:shadow-[0_28px_92px_rgba(0,145,230,0.2)] " +
        className
      }
    >
      <div className={"relative overflow-hidden rounded-lg " + mediaClassName}>
        <img
          src={src}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          className={
            (framed ? "h-full w-full object-contain " : "h-auto w-full object-contain ") +
            "rounded-lg transition duration-700 ease-apple group-hover:scale-[1.025] " +
            imageClassName
          }
        />
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 rounded-lg border border-white/40 bg-white/20 px-4 py-3 text-white opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,.36),0_12px_34px_rgba(0,90,170,.16)] backdrop-blur-2xl transition duration-500 ease-apple group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-sm font-semibold drop-shadow-[0_1px_10px_rgba(0,43,90,.45)]">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-white/82 drop-shadow-[0_1px_8px_rgba(0,43,90,.35)]">{subtitle}</p>}
      </div>
    </button>
  );
}
