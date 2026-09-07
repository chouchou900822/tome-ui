import { Suspense } from "react";
import type { GalleryItem } from "@/components/gallery/component-card";
import { Gallery } from "@/components/gallery/gallery";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SectionHeading } from "@/components/site/section-heading";
import { registry, toSummary } from "@/registry";

export default function HomePage() {
  const items: GalleryItem[] = registry.map((entry, index) => ({
    summary: toSummary(entry),
    index,
    preview: entry.preview,
    previewClassName: entry.previewClassName,
  }));

  return (
    <>
      <Hero />
      <HowItWorks />
      <section id="gallery" className="page-shell scroll-mt-[88px] pb-24 pt-16 md:pb-32 md:pt-20">
        <SectionHeading no="01" label="组件词典 / THE COLLECTION" title="值得收藏的每一处细节。"
          description="每一个预览，都是真实运行的组件。找到喜欢的效果，把设计、源码与灵感一起带走。" />
        <Suspense fallback={<p className="py-16 text-center text-sm text-mute">正在打开组件词典…</p>}>
          <Gallery items={items} />
        </Suspense>
      </section>
    </>
  );
}
