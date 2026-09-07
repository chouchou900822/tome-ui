import { ArrowDownRight } from "lucide-react";
import type { ReactNode } from "react";
import { DotGrid } from "@/registry/components/backgrounds/dot-grid";
import { NumberTicker } from "@/registry/components/effects/number-ticker";
import { TextReveal } from "@/registry/components/text/text-reveal";

export interface GuideStat {
  value: number;
  label: string;
  suffix?: string;
}

interface GuideSectionLink {
  id: string;
  label: string;
}

interface GuideHeroProps {
  label: string;
  code: string;
  title: [string, string];
  description: ReactNode;
  actions: ReactNode;
  stats: GuideStat[];
  links: GuideSectionLink[];
  children: ReactNode;
}

export function GuideHero({ label, code, title, description, actions, stats, links, children }: GuideHeroProps) {
  return (
    <section className="border-b border-line">
      <DotGrid gap={32} dotColor="rgba(255,255,255,0.045)" className="bg-canvas">
        <div className="page-shell">
          <div className="grid items-center gap-12 py-14 md:py-20 lg:min-h-[640px] lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-2">
                <span aria-hidden className="size-1.5 rounded-full bg-accent" />{label}<span className="ml-2 text-mute/55">{code}</span>
              </p>
              <h1 className="mt-8 text-[clamp(2.6rem,4.5vw,4.25rem)] font-medium leading-[1.2] tracking-[-0.055em]">
                <TextReveal text={title[0]} /><br />
                <span className="text-accent"><TextReveal text={title[1]} delay={0.25} /></span>
              </h1>
              <div className="mt-6 max-w-lg text-sm leading-7 text-mute">{description}</div>
              <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
              <dl className="mt-10 grid max-w-sm grid-cols-3 divide-x divide-line border-t border-line pt-6">
                {stats.map((stat, index) => (
                  <div key={stat.label} className={index ? "pl-6" : ""}>
                    <dt className="mt-1 text-[10px] text-mute">{stat.label}</dt>
                    <dd className="mt-2"><NumberTicker value={stat.value} suffix={stat.suffix} className="font-mono text-3xl font-light tracking-[-0.06em] text-ink" /></dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative min-w-0">{children}</div>
          </div>
          <nav aria-label="本页目录" className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line py-5">
            <span className="eyebrow hidden items-center gap-2 text-mute/65 sm:flex">本页指南<ArrowDownRight aria-hidden className="size-3.5" /></span>
            {links.map((link, index) => (
              <a key={link.id} href={"#" + link.id} className="inline-flex items-center gap-2 text-[11px] text-mute transition-colors hover:text-accent">
                <span className="font-mono text-[9px] text-mute/50">0{index + 1}</span>{link.label}
              </a>
            ))}
          </nav>
        </div>
      </DotGrid>
    </section>
  );
}
