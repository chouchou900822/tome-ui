import { Suspense } from "react";
import type { GalleryItem } from "@/components/gallery/component-card";
import { Gallery } from "@/components/gallery/gallery";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { buildPrompt } from "@/lib/prompt";
import { readComponentSource } from "@/lib/source";
import { registry, toSummary } from "@/registry";

async function loadGalleryItems(): Promise<GalleryItem[]> {
  return Promise.all(
    registry.map(async (entry, index) => {
      const source = await readComponentSource(entry.file);
      return {
        summary: toSummary(entry),
        index,
        preview: entry.preview,
        previewClassName: entry.previewClassName,
        prompt: buildPrompt({ entry: toSummary(entry), source }),
      };
    }),
  );
}

export default async function HomePage() {
  const items = await loadGalleryItems();

  return (
    <>
      <Hero />
      <HowItWorks />
      <section id="gallery" className="mx-auto max-w-[1440px] scroll-mt-14 px-5 pb-28 pt-16 md:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
              <span className="font-pixel text-accent">01</span> — 词典
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">全部组件</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-mute">
            每张卡片都是真实运行的组件。右下角的复制按钮直接把这一条的完整提示词放进剪贴板。
          </p>
        </div>
        <Suspense fallback={null}>
          <Gallery items={items} />
        </Suspense>
      </section>
    </>
  );
}
