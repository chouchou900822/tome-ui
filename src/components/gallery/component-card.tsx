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

/** 词典卡片：预览进入视口才挂载（LazyMount），复制按钮点击时才拉取提示词 */
export function ComponentCard({ item }: ComponentCardProps) {
  const { summary, index, preview, previewClassName } = item;
  const category = getCategory(summary.category);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-white/20">
      {/* 舞台不包链接：预览内的交互（拖动、点击）不触发跳转，进详情走标题或右上角箭头 */}
      <LazyMount placeholder={<div className="aspect-[4/3] bg-white/[0.02] motion-safe:animate-pulse" />}>
        <PreviewFrame className="aspect-[4/3]" contentClassName={previewClassName}>
          {preview}
        </PreviewFrame>
      </LazyMount>

      <div className="flex items-start justify-between gap-4 px-5 pb-5 pt-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            <span>{formatIndex(index)}</span>
            <span className="size-0.5 rounded-full bg-mute" />
            <span>{category.code}</span>
          </div>
          <h3 className="mt-2 flex items-baseline gap-2">
            <Link href={`/c/${summary.slug}`} className="text-base font-semibold tracking-tight text-ink">
              {summary.title}
            </Link>
            <span className="truncate text-xs text-mute">{summary.name}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mute">{summary.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <PromptCopyButton slug={summary.slug} iconOnly />
          <Link
            href={`/c/${summary.slug}`}
            aria-label="查看详情"
            className="grid size-8 place-items-center rounded-full border border-line text-mute transition-colors hover:border-white/20 hover:text-ink"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
