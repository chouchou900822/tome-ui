"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ComponentCard, type GalleryItem } from "@/components/gallery/component-card";
import { FilterBar } from "@/components/gallery/filter-bar";
import { filterEntries } from "@/lib/search";
import { categories, type CategoryId } from "@/registry";

interface GalleryProps {
  items: GalleryItem[];
}

function isCategory(value: string | null): value is CategoryId {
  return categories.some((c) => c.id === value);
}

/** 首页画廊：分类与关键词筛选，卡片增删带布局动画，分类同步到 URL */
export function Gallery({ items }: GalleryProps) {
  const params = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<CategoryId | "all">(isCategory(initial) ? initial : "all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const summaries = items.map((i) => i.summary);
    const kept = new Set(filterEntries(summaries, { category, query }).map((s) => s.slug));
    return items.filter((i) => kept.has(i.summary.slug));
  }, [items, category, query]);

  const changeCategory = (next: CategoryId | "all") => {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <FilterBar
        category={category}
        query={query}
        total={visible.length}
        onCategory={changeCategory}
        onQuery={setQuery}
      />

      <LayoutGroup>
        <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <ComponentCard key={item.summary.slug} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-sm text-mute">没有匹配的组件，换个关键词试试。</p>
      ) : null}
    </div>
  );
}
