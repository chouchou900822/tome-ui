"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { SearchTrigger } from "@/components/site/search-trigger";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface NavigationLink {
  href: string;
  label: string;
  path: string;
}

const links: NavigationLink[] = [
  { href: "/#gallery", label: "组件词典", path: "/" },
  { href: "/mcp", label: "MCP 接入", path: "/mcp" },
  { href: "/docker", label: "部署指南", path: "/docker" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isActive = (path: string) => path === "/" ? pathname === "/" || pathname.startsWith("/c/") : pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-2xl">
      <div className="page-shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="Tome 首页" onClick={() => setMenuOpen(false)} className="group inline-flex shrink-0 items-center gap-3">
          <span aria-hidden className="relative grid size-8 place-items-center rounded-lg border border-accent/25 bg-accent/5">
            <span className="size-3 rotate-45 rounded-[1px] bg-accent motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:rotate-[225deg]" />
          </span>
          <span className="text-xl font-semibold tracking-[-0.06em]">{site.name}<span className="text-accent">.</span></span>
          <span className="ml-1 hidden border-l border-line pl-3 text-[11px] text-mute xl:inline">组件与灵感的词典</span>
        </Link>
        <nav aria-label="主导航" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.path) ? "page" : undefined}
              className={cn("relative py-6 text-xs transition-colors hover:text-ink", isActive(link.path) ? "text-ink" : "text-mute")}>
              {link.label}
              {isActive(link.path) ? <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent" /> : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchTrigger />
          <a href={site.github} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 pl-2 text-xs text-mute transition-colors hover:text-ink lg:inline-flex">
            GitHub <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
          <button ref={menuButtonRef} type="button" aria-label={menuOpen ? "关闭导航" : "打开导航"} aria-expanded={menuOpen} aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)} className="icon-button md:hidden">
            {menuOpen ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav id="mobile-navigation" aria-label="移动端导航" className="absolute inset-x-0 top-full border-b border-line bg-panel p-5 shadow-2xl md:hidden"
          onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); } }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={isActive(link.path) ? "page" : undefined}
              className={cn("flex items-center justify-between rounded-lg px-4 py-3.5 text-sm", isActive(link.path) ? "bg-accent/8 text-accent" : "text-mute hover:bg-white/5 hover:text-ink")}>
              {link.label}<ArrowUpRight aria-hidden className="size-4" />
            </Link>
          ))}
          <a href={site.github} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-between border-t border-line px-4 pt-5 text-sm text-mute">
            GitHub 源码仓库<ArrowUpRight aria-hidden className="size-4" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
