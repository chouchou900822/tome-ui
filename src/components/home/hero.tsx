import { HeroActions } from "@/components/home/hero-actions";
import { site } from "@/lib/site";
import { categories, formatIndex, registry } from "@/registry";
import { DotGrid } from "@/registry/components/backgrounds/dot-grid";
import { Marquee } from "@/registry/components/effects/marquee";
import { NumberTicker } from "@/registry/components/effects/number-ticker";
import { TextReveal } from "@/registry/components/text/text-reveal";

const stats = [
  { value: registry.length, label: "组件条目", suffix: "" },
  { value: categories.length, label: "分类", suffix: "" },
  { value: 100, label: "开源 · MIT", suffix: "%" },
];

/** 首屏：词典自身的组件搭出来的门面 */
export function Hero() {
  return (
    <section className="border-b border-line">
      <DotGrid className="min-h-[calc(100svh-3.5rem)]">
        <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[1440px] flex-col px-5 md:px-8">
          <div className="flex flex-1 flex-col justify-center pb-16 pt-16 lg:pt-20">
            <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
              <span className="font-pixel text-accent">{site.volume}</span>
              <span className="h-px w-8 bg-line" />
              <span>{site.tagline}</span>
            </p>

            <h1 className="mt-10 text-[clamp(2.6rem,7.4vw,7.25rem)] font-semibold leading-[1.02] tracking-tight">
              <TextReveal text="复制一段提示词，" />
              <br />
              <span className="text-outline">
                <TextReveal text="得到一个惊艳的组件。" delay={0.45} />
              </span>
            </h1>

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="max-w-xl text-base leading-relaxed text-mute md:text-lg">
                  {site.description}
                  <span className="text-ink"> 没有前端基础也能做出好看的界面。</span>
                </p>
                <div className="mt-10">
                  <HeroActions github={site.github} />
                </div>
              </div>

              <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end">
                <div className="grid w-full grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:max-w-md">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-canvas/80 p-5 backdrop-blur-sm">
                      <NumberTicker
                        value={s.value}
                        suffix={s.suffix}
                        className="font-pixel text-3xl text-ink md:text-4xl"
                      />
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-mute lg:text-right">
                  本站界面全部由词典中的组件搭建
                  <br />
                  点阵背景 · 文字显现 · 磁吸按钮 · 流光按钮 · 数字滚动 · 跑马灯
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line py-5">
          <Marquee duration={40}>
            {registry.map((entry, i) => (
              <span key={entry.slug} className="flex items-baseline gap-3 whitespace-nowrap">
                <span className="font-pixel text-xs text-accent">{formatIndex(i)}</span>
                <span className="text-lg font-medium tracking-tight text-ink/80">{entry.title}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{entry.name}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </DotGrid>
    </section>
  );
}
