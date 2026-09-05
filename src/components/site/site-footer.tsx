import Link from "next/link";
import { site } from "@/lib/site";
import { categories } from "@/registry";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.25em]">{site.shortName}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{site.description}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">分类</p>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/?category=${c.id}#gallery`} className="text-ink/80 transition-colors hover:text-accent">
                    {c.label}
                    <span className="ml-2 font-mono text-[10px] text-mute">{c.code}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">给 AI 用</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/llms.txt" className="text-ink/80 transition-colors hover:text-accent">
                  llms.txt 索引
                </Link>
              </li>
              <li>
                <Link href="/api/prompt/text-reveal" className="text-ink/80 transition-colors hover:text-accent">
                  提示词 API 示例
                </Link>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noreferrer" className="text-ink/80 transition-colors hover:text-accent">
                  源码仓库
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-mute sm:flex-row sm:items-center sm:justify-between">
          <span>{site.name} · MIT License</span>
          <span>{site.volume} · Built with the components it catalogs</span>
        </div>
      </div>
    </footer>
  );
}
