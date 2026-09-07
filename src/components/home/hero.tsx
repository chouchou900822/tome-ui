import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { HeroActions } from "@/components/home/hero-actions";
import { HeroShowcase } from "@/components/home/hero-showcase";
import { site } from "@/lib/site";
import { categories, registry } from "@/registry";
import { DotGrid } from "@/registry/components/backgrounds/dot-grid";
import { TextReveal } from "@/registry/components/text/text-reveal";

const categoryIndex = categories
  .map((category) => ({ ...category, count: registry.filter((entry) => entry.category === category.id).length }))
  .filter((category) => category.count > 0)
  .sort((a, b) => b.count - a.count);

/** 用词典中的交互组件组成首屏展台。 */
export function Hero() {
  return (
    <section className="border-b border-line">
      <DotGrid gap={32} dotColor="rgba(255,255,255,0.065)" radius={280} className="bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,#d7ff3c06,transparent_55%)]" />
        <div className="page-shell">
          <div className="grid items-center gap-12 pb-14 pt-14 md:pb-16 md:pt-20 lg:min-h-[650px] lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-16 xl:gap-20">
            <div className="relative">
              <p className="eyebrow inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-2">
                <span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_#d7ff3c60]" />
                为灵感，找到实现<span className="ml-2 text-mute/60">{site.volume}</span>
              </p>
              <h1 className="mt-8 text-[clamp(2.9rem,6vw,5.5rem)] font-medium leading-[1.18] tracking-[-0.055em]">
                <TextReveal text="让好设计，" />
                <br />
                <span className="text-accent"><TextReveal text="触手可及。" delay={0.25} /></span>
              </h1>
              <p className="mt-7 max-w-[26rem] text-sm leading-7 text-mute sm:text-base sm:leading-8">
                精心打磨的交互组件，开箱即用的 AI 提示词。<br className="hidden sm:block" />
                发现喜欢的效果，复制给 AI，让它出现在你的作品里。
              </p>
              <div className="mt-9"><HeroActions github={site.github} /></div>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-mute">
                <span><span className="mr-1.5 font-mono text-ink">{registry.length}</span>精选组件</span>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span><span className="mr-1.5 font-mono text-ink">{categories.length}</span>设计分类</span>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span>源码开放 · 自由创作</span>
              </div>
            </div>
            <HeroShowcase count={registry.length} />
          </div>
          <nav aria-label="组件分类索引" className="flex items-center gap-6 overflow-x-auto border-t border-line py-5 whitespace-nowrap">
            <span className="eyebrow flex shrink-0 items-center gap-2 text-mute/70">探索目录<ArrowDownRight aria-hidden className="size-3.5" /></span>
            <div className="flex items-center gap-6">
              {categoryIndex.map((category) => (
                <Link key={category.id} href={"/?category=" + category.id + "#gallery"} className="group flex items-center gap-2 text-[11px] text-mute transition-colors hover:text-accent">
                  {category.label}<span className="font-mono text-[9px] text-mute/50 group-hover:text-accent/60">{String(category.count).padStart(2, "0")}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </DotGrid>
    </section>
  );
}
