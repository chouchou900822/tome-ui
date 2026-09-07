"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LazyMount } from "@/components/gallery/lazy-mount";
import { PreviewFrame } from "@/components/gallery/preview-frame";
import { PromptCopyButton } from "@/components/site/prompt-copy-button";
import { formatIndex, getCategory } from "@/registry/categories";
import type { RegistrySummary } from "@/registry/types";

export interface GalleryItem {
  summary: RegistrySummary;
  index: number;
  preview: ReactNode;
  previewClassName?: string;
}

interface ComponentCardProps {
  item: GalleryItem;
}

/** 预览保持独立交互，标题与角标负责进入详情。 */
export function ComponentCard({ item }: ComponentCardProps) {
  const { summary, index, preview, previewClassName } = item;
  const category = getCategory(summary.category);

  return (
    <article className="group/card relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_4px_24px_-16px_#000] transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_12px_40px_-20px_#000]">
      <div className="relative border-b border-line">
        <LazyMount placeholder={<div className="aspect-[4/3] bg-white/[0.015] motion-safe:animate-pulse" />}>
          <PreviewFrame className="aspect-[4/3]" contentClassName={previewClassName}>{preview}</PreviewFrame>
        </LazyMount>
        <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-md border border-white/5 bg-black/30 px-2 py-1 font-mono text-[9px] tracking-wider text-white/40 backdrop-blur-sm">No.{formatIndex(index)}</span>
        <Link href={"/c/" + summary.slug} aria-label={"查看" + summary.title + "详情"}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/10 bg-canvas/60 text-white/60 backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent">
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-4 xl:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] tracking-[0.14em] text-mute/65">{category.code}</span>
          <span aria-hidden className="h-px w-5 bg-white/10 transition-colors group-hover/card:bg-accent/50" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-medium tracking-tight">
              <Link href={"/c/" + summary.slug} className="transition-colors hover:text-accent">{summary.title}</Link>
            </h4>
            <p className="mt-1 truncate font-mono text-[10px] text-mute/70">{summary.name}</p>
          </div>
          <PromptCopyButton slug={summary.slug} iconOnly className="size-8 border-transparent bg-transparent text-mute hover:border-line" />
        </div>
        <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-mute">{summary.description}</p>
      </div>
    </article>
  );
}
