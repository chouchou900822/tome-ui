import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { CommandPalette } from "@/components/site/command-palette";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { site } from "@/lib/site";
import { registry, toSummary } from "@/registry";
import "./globals.css";

// 只加载实际使用的方形像素字体，避免预加载整个像素字体家族。
const GeistPixelSquare = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
  preload: false,
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ["组件库", "提示词", "Vibe Coding", "Tailwind CSS", "React", "AI 编程"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded-full bg-accent px-5 py-3 text-sm text-accent-ink focus:not-sr-only">跳到主要内容</a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">{children}</main>
        <SiteFooter />
        <CommandPalette entries={registry.map(toSummary)} />
      </body>
    </html>
  );
}
