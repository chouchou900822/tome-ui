"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/registry/components/buttons/magnetic-button";

interface HeroActionsProps {
  github: string;
}

export function HeroActions({ github }: HeroActionsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center gap-5 sm:gap-7">
      <MagneticButton strength={reduceMotion ? 0 : 0.15} padding={10}
        className="bg-accent px-6 py-3.5 text-accent-ink shadow-[0_4px_24px_-12px_#d7ff3c80] hover:bg-[#e3ff7c]"
        onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" })}>
        探索组件<ArrowDown aria-hidden className="ml-3 size-4" />
      </MagneticButton>
      <a href={github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-xs text-mute transition-colors hover:text-ink">
        在 GitHub 上查看<ArrowUpRight aria-hidden className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
