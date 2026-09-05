import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import { CommandPalette } from "@/components/site/command-palette";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { site } from "@/lib/site";
import { registry, toSummary } from "@/registry";
import "./globals.css";

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
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CommandPalette entries={registry.map(toSummary)} />
      </body>
    </html>
  );
}
