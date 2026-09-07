"use client";

import { ChevronsDown, ChevronsUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ComponentCard, type GalleryItem } from "@/components/gallery/component-card";
import type { Category } from "@/registry/types";

const GRID = "grid gap-4 md:grid-cols-2 xl:grid-cols-3";

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
      className="scroll-mt-56 border-t border-line py-10 first:border-t-0 first:pt-0 lg:scroll-mt-24"
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute/70">
            <span className="text-accent/80">{String(ordinal + 1).padStart(2, "0")}</span>
            <span> — </span>
            <span>{category.code}</span>
            <span> · {String(items.length).padStart(2, "0")} 项</span>
          </p>
          <h3 className="mt-2.5 text-xl font-medium tracking-tight md:text-2xl">{category.label}</h3>
          <p className="mt-2 max-w-lg text-xs leading-6 text-mute">{category.description}</p>
        </div>
        {items.length > limit ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="button-secondary h-9 shrink-0 px-3.5 text-xs"
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
