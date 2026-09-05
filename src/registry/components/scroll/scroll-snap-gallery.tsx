import { cn } from "@/lib/utils";

interface ScrollSnapItem {
  eyebrow: string;
  title: string;
  description: string;
  color: string;
}

interface ScrollSnapGalleryProps {
  items: ScrollSnapItem[];
  className?: string;
}

export function ScrollSnapGallery({ items, className }: ScrollSnapGalleryProps) {
  return (
    <div
      className={cn(
        "h-full min-h-64 w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-[#0b0b0d] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      tabIndex={0}
      aria-label="横向滚动吸附画廊"
    >
      <div className="flex h-full w-max gap-3 py-4 @md:gap-5 @md:py-6">
        <div
          aria-hidden
          className="w-[calc(14cqw-12px)] shrink-0 @md:w-[calc(16cqw-20px)]"
        />
        {items.map((item, index) => (
          <article
            key={item.title}
            className="relative h-full w-[72cqw] shrink-0 snap-center snap-always overflow-hidden rounded-2xl border border-white/10 p-5 text-white @md:w-[68cqw] @md:p-8"
            style={{ backgroundColor: item.color }}
          >
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),transparent_45%,rgba(0,0,0,0.45))]" />
            <p className="relative text-[9px] uppercase tracking-[0.28em] text-white/55">{item.eyebrow}</p>
            <p aria-hidden className="absolute right-4 top-1 text-7xl font-semibold tracking-tighter text-white/[0.06] @md:text-9xl">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div className="absolute inset-x-5 bottom-5 @md:inset-x-8 @md:bottom-8">
              <h3 className="text-xl font-semibold tracking-[-0.035em] @md:text-3xl">{item.title}</h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/55 @md:text-sm">{item.description}</p>
            </div>
          </article>
        ))}
        <div
          aria-hidden
          className="w-[calc(14cqw-12px)] shrink-0 @md:w-[calc(16cqw-20px)]"
        />
      </div>
    </div>
  );
}
