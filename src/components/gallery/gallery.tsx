"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ComponentCard, type GalleryItem } from "@/components/gallery/component-card";
import { GalleryNav, type NavItem } from "@/components/gallery/gallery-nav";
import { GallerySection } from "@/components/gallery/gallery-section";
import { useSectionSpy } from "@/components/gallery/use-section-spy";
import { filterEntries } from "@/lib/search";
import { categories } from "@/registry/categories";
import type { Category, CategoryId } from "@/registry/types";

interface GalleryProps {
  items: GalleryItem[];
}

const SECTION_PREFIX = "cat-";

type Selection = CategoryId | "all";

interface Section {
  category: Category;
  items: GalleryItem[];
}

function isCategory(value: string | null): value is CategoryId {
  return categories.some((c) => c.id === value);
}

/** 按条目数降序分组（数量相同保持分类定义顺序）；画廊目录与分节顺序、Hero 索引条共用此排序 */
function groupByCategory(items: GalleryItem[]): Section[] {
  return categories
    .map((category) => ({
      category,
      items: items.filter((i) => i.summary.category === category.id),
    }))
    .filter((section) => section.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);
}

/**
 * 首页画廊编排层：目录选中式渲染 + 关键词搜索。
 * 选中态完全由 ?category= 派生（router.replace 驱动）：选中分类只渲染该节，
 * 「全部」为分节总览；被动滚动不回写 URL。
 */
export function Gallery({ items }: GalleryProps) {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get("category");
  const selected: Selection = isCategory(raw) ? raw : "all";
  const [query, setQuery] = useState("");

  const sections = useMemo(() => groupByCategory(items), [items]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const summaries = items.map((i) => i.summary);
    const kept = new Set(filterEntries(summaries, { category: "all", query }).map((s) => s.slug));
    return items.filter((i) => kept.has(i.summary.slug));
  }, [items, query]);

  const selectedSection = useMemo(
    () => (selected === "all" ? null : (sections.find((s) => s.category.id === selected) ?? null)),
    [sections, selected],
  );

  const navItems: NavItem[] = [
    { id: "all", label: "全部", code: "ALL", count: items.length },
    ...sections.map(({ category, items: sectionItems }) => ({
      id: category.id,
      label: category.label,
      code: category.code,
      count: sectionItems.length,
    })),
  ];

  // scrollspy 仅「全部」分节视图需要：单分类/搜索态传空数组断开观察，切回时对新元素重新 observe
  const showSections = selected === "all" && !results;
  const sectionIds = useMemo(
    () => (showSections ? sections.map((s) => `${SECTION_PREFIX}${s.category.id}`) : []),
    [showSections, sections],
  );
  const spyId = useSectionSpy(sectionIds);
  const activeId: Selection = useMemo(() => {
    if (selected !== "all") return selected;
    const id = spyId?.slice(SECTION_PREFIX.length) ?? null;
    return isCategory(id) ? id : "all";
  }, [selected, spyId]);

  const navigate = (id: Selection) => {
    setQuery("");
    router.replace(id === "all" ? "/" : `/?category=${id}`, { scroll: false });
  };

  // 软导航（目录点击、Hero 索引条、详情页返回）后滚到画廊顶部；首次挂载交给深链锚点
  const previousSelection = useRef(selected);
  useEffect(() => {
    if (previousSelection.current === selected) return;
    previousSelection.current = selected;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("gallery")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  }, [selected]);

  return (
    // lg 以下保持普通流：sticky 吸顶条若是单列 grid item，grid area 只有自身高度，sticky 会失效
    <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-9 xl:gap-12">
      <GalleryNav
        items={navItems}
        activeId={activeId}
        query={query}
        resultCount={results ? results.length : null}
        onQuery={setQuery}
        onNavigate={navigate}
      />

      <div className="min-w-0">
        {results ? <p role="status" className="mb-5 hidden text-xs text-mute lg:block">找到 <span className="font-mono text-accent">{results.length}</span> 个匹配的组件</p> : null}
        {results ? (
          results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <ComponentCard key={item.summary.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="surface-panel flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
              <SearchX aria-hidden className="size-7 text-mute/60" />
              <h3 className="mt-5 text-base font-medium">还没找到这份灵感</h3>
              <p className="mt-2 text-xs leading-6 text-mute">试试组件名称、动效描述，或「按钮」「发光」这样的关键词。</p>
              <button type="button" onClick={() => setQuery("")} className="button-secondary mt-6 h-9 text-xs">清空搜索，继续探索</button>
            </div>
          )
        ) : selectedSection ? (
          <GallerySection
            category={selectedSection.category}
            ordinal={sections.indexOf(selectedSection)}
            items={selectedSection.items}
            startExpanded
          />
        ) : (
          sections.map((section, ordinal) => (
            <GallerySection
              key={section.category.id}
              ordinal={ordinal}
              category={section.category}
              items={section.items}
            />
          ))
        )}
      </div>
    </div>
  );
}
