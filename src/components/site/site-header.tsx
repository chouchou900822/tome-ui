import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SearchTrigger } from "@/components/site/search-trigger";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-6 place-items-center">
            <span className="size-3 rotate-45 bg-accent transition-transform duration-500 group-hover:rotate-[225deg]" />
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-semibold tracking-[0.25em]">{site.shortName}</span>
            <span className="hidden text-xs text-mute sm:inline">组件词典</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/docker"
            className="hidden text-xs text-mute transition-colors hover:text-ink sm:inline"
          >
            Docker
          </Link>
          <Link
            href="/mcp"
            className="hidden text-xs text-mute transition-colors hover:text-ink sm:inline"
          >
            MCP
          </Link>
          <Link
            href="/#gallery"
            className="hidden text-xs text-mute transition-colors hover:text-ink sm:inline"
          >
            浏览组件
          </Link>
          <SearchTrigger />
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink"
          >
            GitHub
            <ArrowUpRight className="size-3.5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
