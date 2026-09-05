"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { PreviewFrame } from "@/components/gallery/preview-frame";
import { CopyButton } from "@/components/site/copy-button";
import { formatIndex, getCategory, type RegistrySummary } from "@/registry";

export interface GalleryItem {
  summary: RegistrySummary;
  index: number;
  preview: ReactNode;
  previewClassName?: string;
  prompt: string;
}

interface ComponentCardProps {
  item: GalleryItem;
}

export function ComponentCard({ item }: ComponentCardProps) {
  const { summary, index, preview, previewClassName, prompt } = item;
  const category = getCategory(summary.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-white/20"
    >
      {/* 舞台不包链接：预览内的交互（拖动、点击）不触发跳转，进详情走标题或右上角箭头 */}
      <PreviewFrame className="aspect-[4/3]" contentClassName={previewClassName}>
        {preview}
      </PreviewFrame>

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
          <CopyButton text={prompt} iconOnly />
          <Link
            href={`/c/${summary.slug}`}
            aria-label="查看详情"
            className="grid size-8 place-items-center rounded-full border border-line text-mute transition-colors hover:border-white/20 hover:text-ink"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
