"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/registry/components/buttons/magnetic-button";
import { ShimmerButton } from "@/registry/components/buttons/shimmer-button";

interface HeroActionsProps {
  github: string;
}

/** 首屏两个 CTA，直接复用词典里的按钮组件 */
export function HeroActions({ github }: HeroActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <MagneticButton
        onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
      >
        浏览词典
        <ArrowDown className="size-4" />
      </MagneticButton>
      <ShimmerButton onClick={() => window.open(github, "_blank", "noreferrer")}>
        GitHub
        <ArrowUpRight className="size-4" />
      </ShimmerButton>
    </div>
  );
}
