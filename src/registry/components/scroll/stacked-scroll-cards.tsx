import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface StackedScrollItem {
  number: string;
  title: string;
  description: string;
  color: string;
}

interface StackedScrollCardsProps {
  items: StackedScrollItem[];
  className?: string;
}

export function StackedScrollCards({ items, className }: StackedScrollCardsProps) {
  return (
    <div
      className={cn(
        "h-full min-h-64 w-full overflow-y-auto overscroll-contain bg-[#0b0b0d] [container-type:size] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      tabIndex={0}
      aria-label="滚动叠层卡片"
    >
      <div className="relative min-h-full px-4 pt-4 @md:px-7 @md:pt-7">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="sticky top-[var(--stack-top-small)] mb-20 flex h-[76cqh] min-h-52 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 text-white shadow-[0_-18px_50px_rgba(0,0,0,0.35)] @md:top-[var(--stack-top-large)] @md:mb-28 @md:p-8"
            style={
              {
                backgroundColor: item.color,
                zIndex: index + 1,
                "--stack-top-small": `${16 + index * 12}px`,
                "--stack-top-large": `${28 + index * 14}px`,
              } as CSSProperties
            }
          >
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.14),transparent_38%),linear-gradient(145deg,transparent,rgba(0,0,0,0.38))]" />
            <div className="relative flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">Layer {item.number}</p>
              <span className="size-2 rounded-full bg-white/65" />
            </div>
            <div className="relative">
              <h3 className="text-xl font-semibold tracking-[-0.035em] @md:text-3xl">{item.title}</h3>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-white/55 @md:text-sm">{item.description}</p>
            </div>
          </article>
        ))}
        <div aria-hidden className="h-[52cqh]" />
      </div>
    </div>
  );
}
