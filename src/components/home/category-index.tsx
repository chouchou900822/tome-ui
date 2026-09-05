import Link from "next/link";
import { categories } from "@/registry/categories";
import { registry } from "@/registry";

/** Hero 底部的静态分类索引：按条目数降序的印刷目录式排印，发丝线分格，点击直达画廊对应分类 */
export function CategoryIndex() {
  // 与画廊目录/分节共用「数量降序、并列保持定义顺序」的排序
  const grouped = categories
    .map((category) => ({
      category,
      count: registry.filter((e) => e.category === category.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="border-t border-line py-5">
      <nav aria-label="词典分类" className="mx-auto max-w-[1440px] px-5 md:px-8">
        <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-8">
          {grouped.map(({ category, count }) => (
            <li key={category.id}>
              <Link
                href={`/?category=${category.id}#gallery`}
                scroll={false}
                className="group flex h-full flex-col justify-between gap-3 bg-canvas/80 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  {category.code}
                </span>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-ink/80 transition-colors group-hover:text-ink">
                    {category.label}
                  </span>
                  <span className="font-pixel text-xs text-accent">{String(count).padStart(2, "0")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
