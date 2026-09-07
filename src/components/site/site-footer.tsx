import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";
import { categories } from "@/registry";

interface ResourceLink {
  href: string;
  label: string;
}

const resources: ResourceLink[] = [
  { href: "/mcp", label: "MCP 接入" },
  { href: "/docker", label: "部署指南" },
  { href: "/llms.txt", label: "llms.txt 索引" },
  { href: "/api/prompt/text-reveal", label: "提示词 API" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#0c0d0e]">
      <div className="page-shell pb-7 pt-14 md:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.65fr] lg:gap-20">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-semibold tracking-[-0.06em]">{site.name}<span className="text-accent">.</span></Link>
            <p className="mt-5 text-xl font-medium tracking-tight">好界面，从一个好组件开始。</p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-mute">收集值得反复使用的交互与细节，<br />让灵感与实现之间，只差一段提示词。</p>
            <a href={site.github} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs text-mute transition-colors hover:text-accent">
              在 GitHub 上一起构建<ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          </div>
          <div>
            <p className="eyebrow">浏览词典</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3.5 text-xs">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={"/?category=" + category.id + "#gallery"} className="text-mute transition-colors hover:text-accent">{category.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">连接你的工作流</p>
            <ul className="mt-5 space-y-3.5 text-xs">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <a href={resource.href} className="group inline-flex items-center gap-2 text-mute transition-colors hover:text-accent">
                    {resource.label}<ArrowUpRight aria-hidden className="size-3 opacity-40 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex items-end justify-between gap-6 border-b border-line pb-7 md:mt-20">
          <span aria-hidden className="text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.8] tracking-[-0.085em] text-white/[0.06]">tome<span className="text-accent/25">.</span></span>
          <Link href="/#gallery" aria-label="浏览组件词典" className="group mb-1 flex items-center gap-3 text-xs text-mute transition-colors hover:text-ink">
            <span className="hidden sm:inline">把下一份灵感，变成界面</span>
            <span className="grid size-10 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent"><ArrowUpRight aria-hidden className="size-4" /></span>
          </Link>
        </div>
        <div className="mt-6 flex flex-col gap-3 text-[10px] text-mute sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">{site.name} · MIT 开源协议</span>
          <span className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-accent/70" />由词典中的组件构建<span className="ml-3 font-mono text-mute/65">{site.volume}</span></span>
        </div>
      </div>
    </footer>
  );
}
