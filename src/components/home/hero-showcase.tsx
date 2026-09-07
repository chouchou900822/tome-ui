"use client";

import { ArrowUpRight, Check, MousePointer2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Ripple } from "@/registry/components/backgrounds/ripple";
import { ShimmerButton } from "@/registry/components/buttons/shimmer-button";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";
import { BorderBeam } from "@/registry/components/effects/border-beam";
import { NumberTicker } from "@/registry/components/effects/number-ticker";

interface HeroShowcaseProps {
  count: number;
}

export function HeroShowcase({ count }: HeroShowcaseProps) {
  const [illuminated, setIlluminated] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[540px] motion-safe:animate-fade-up">
      <div aria-hidden className="pointer-events-none absolute -inset-5 rounded-full bg-accent/[0.025] blur-3xl" />
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="eyebrow text-[9px]">精选交互 / LIVE CANVAS</span>
        <span className="flex items-center gap-1.5 text-[9px] text-mute"><MousePointer2 aria-hidden className="size-3" />试着与它们互动</span>
      </div>
      <SpotlightCard radius={400} color="rgba(215,255,60,0.09)" className="relative rounded-[20px] border-white/12 bg-[#10130f] p-0 shadow-[0_24px_80px_-36px_#000]">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
          <span className="eyebrow text-[9px] text-white/45">灵感标本 — 001</span>
          <span className="rounded-full border border-accent/15 bg-accent/5 px-2 py-1 font-mono text-[8px] tracking-[0.12em] text-accent/75">INTERACTIVE</span>
        </div>
        <Ripple rings={5} speed={7} className="bg-transparent">
          <div className="flex h-[265px] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#d7ff3c0d,transparent_65%)] pt-4 sm:h-[280px]">
            <span aria-hidden className="mb-3 h-7 w-px bg-gradient-to-b from-transparent to-accent/50" />
            <p className="text-center text-[clamp(2.2rem,4.2vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.065em]">
              Make it<br /><span className="font-serif font-normal italic tracking-[-0.055em] text-accent">memorable.</span>
            </p>
            <p className="mt-5 text-[10px] tracking-[0.22em] text-white/45">让每一个细节，都值得停留</p>
          </div>
        </Ripple>
        <div className="flex items-center justify-between border-t border-white/8 bg-black/20 px-5 py-3.5">
          <span className="text-[10px] text-mute">同心波纹<span className="ml-2 font-mono text-[9px] text-mute/50">Ripple</span></span>
          <Link href="/c/ripple" aria-label="探索同心波纹组件" className="flex items-center gap-2 text-[10px] text-mute transition-colors hover:text-accent">探索组件<ArrowUpRight aria-hidden className="size-3.5" /></Link>
        </div>
        <BorderBeam size={100} duration={14} colorFrom="#d7ff3c" colorTo="#657b30" />
      </SpotlightCard>
      <div className="mt-3 grid grid-cols-[1.15fr_1fr] gap-3">
        <div className="surface-panel flex min-h-[140px] flex-col items-center justify-center gap-4 bg-[#101113] p-4 sm:min-h-[154px]">
          <ShimmerButton speed={4} background={illuminated ? "#252e12" : "#151714"} onClick={() => setIlluminated((value) => !value)} className="[&>span.relative]:px-5 [&>span.relative]:py-3 [&>span.relative]:text-xs">
            {illuminated ? <Check aria-hidden className="size-3.5 text-accent" /> : <Sparkles aria-hidden className="size-3.5 text-accent" />}
            <span aria-live="polite">{illuminated ? "灵感已点亮" : "点亮灵感"}</span>
          </ShimmerButton>
          <Link href="/c/shimmer-button" className="flex items-center gap-1.5 text-[9px] text-mute transition-colors hover:text-accent">流光按钮<ArrowUpRight aria-hidden className="size-3" /></Link>
        </div>
        <SpotlightCard color="rgba(215,255,60,0.08)" className="flex items-center justify-center rounded-2xl bg-[#101113] p-4 text-center">
          <NumberTicker value={count} className="font-mono text-5xl font-light tracking-[-0.08em] text-ink sm:text-6xl" />
          <p className="mt-3 text-[9px] tracking-wider text-mute">种方式，让界面多一点心动</p>
        </SpotlightCard>
      </div>
    </div>
  );
}
