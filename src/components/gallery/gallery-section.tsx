"use client";

import { ChevronsDown, ChevronsUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ComponentCard, type GalleryItem } from "@/components/gallery/component-card";
import type { Category } from "@/registry/types";

const GRID = "grid gap-5 md:grid-cols-2 xl:grid-cols-3";

interface GallerySectionProps {
  /** 节序号，从 0 开始 */
  ordinal: number;
  category: Category;
  items: GalleryItem[];
  /** 默认展示条数，超出折叠到「展开其余」 */
  limit?: number;
  /** 深链种子节默认展开全部 */
  startExpanded?: boolean;
}

/** 画廊的一个分类节：节头 + 网格；入场为节级 whileInView，替代原先逐卡片动画 */
export function GallerySection({ ordinal, category, items, limit = 8, startExpanded = false }: GallerySectionProps) {
  const [expanded, setExpanded] = useState(startExpanded);
  const reduceMotion = useReducedMotion();
  const shown = expanded ? items : items.slice(0, limit);
  const rest = items.length - shown.length;

  return (
    <motion.section
      id={`cat-${category.id}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-20 border-t border-line py-10 first:border-t-0 first:pt-0"
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
            <span className="font-pixel text-accent">{String(ordinal + 1).padStart(2, "0")}</span>
            <span> — </span>
            <span>{category.code}</span>
            <span> · {String(items.length).padStart(2, "0")} 项</span>
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{category.label}</h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">{category.description}</p>
        </div>
        {rest > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink"
          >
            {expanded ? <ChevronsUp className="size-3.5" /> : <ChevronsDown className="size-3.5" />}
            {expanded ? "收起" : `展开其余 ${rest} 项`}
          </button>
        ) : null}
      </div>

      <div className={`mt-6 ${GRID}`}>
        {shown.map((item) => (
          <ComponentCard key={item.summary.slug} item={item} />
        ))}
      </div>
    </motion.section>
  );
}
