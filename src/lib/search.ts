import type { CategoryId, RegistrySummary } from "@/registry/types";

export interface SearchFilter {
  category: CategoryId | "all";
  query: string;
}

/** 组件列表与命令面板共用的过滤逻辑：先按分类，再按关键词匹配名称/描述/标签 */
export function filterEntries<T extends RegistrySummary>(entries: readonly T[], filter: SearchFilter): T[] {
  const q = filter.query.trim().toLowerCase();
  return entries.filter((e) => {
    if (filter.category !== "all" && e.category !== filter.category) return false;
    if (!q) return true;
    const haystack = [e.title, e.name, e.slug, e.description, ...e.tags].join(" ").toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
