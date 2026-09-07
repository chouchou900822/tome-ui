import { ArrowLeft, ArrowRight, ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeTabs, type CodeTab } from "@/components/detail/code-tabs";
import { PreviewStage } from "@/components/detail/preview-stage";
import { CopyButton } from "@/components/site/copy-button";
import { highlight } from "@/lib/highlight";
import { buildPrompt } from "@/lib/prompt";
import { readComponentSource } from "@/lib/source";
import { formatIndex, getCategory, getEntry, getEntryIndex, registry, toSummary } from "@/registry";

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return registry.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return { title: `${entry.title} ${entry.name}`, description: entry.description };
}

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const index = getEntryIndex(slug);
  const category = getCategory(entry.category);
  const summary = toSummary(entry);
  const source = await readComponentSource(entry.file);
  const prompt = buildPrompt({ entry: summary, source });
  const fileName = entry.file.split("/").pop() ?? entry.file;

  const [promptHtml, sourceHtml, usageHtml] = await Promise.all([
    highlight(prompt, "markdown"),
    highlight(source, "tsx"),
    highlight(entry.usage, "tsx"),
  ]);

  const tabs: CodeTab[] = [
    {
      id: "prompt",
      label: "提示词",
      raw: prompt,
      html: promptHtml,
      hint: "粘贴到 Cursor / Claude Code / Windsurf / v0 的对话框即可。提示词包含完整源码，AI 无需联网访问本站。",
    },
    {
      id: "source",
      label: "源码",
      raw: source,
      html: sourceHtml,
      hint: `保存为 src/components/ui/${fileName}，依赖 @/lib/utils 中的 cn 函数。`,
    },
    { id: "usage", label: "用法", raw: entry.usage, html: usageHtml },
  ];

  const prev = registry[index - 1];
  const next = registry[index + 1];

  return (
    <article className="page-shell pb-20 pt-7 md:pb-28 md:pt-9">
      <nav aria-label="面包屑导航" className="flex min-w-0 items-center gap-2.5 text-[11px] text-mute">
        <Link href="/#gallery" className="inline-flex shrink-0 items-center gap-2 transition-colors hover:text-ink">
          <ArrowLeft aria-hidden className="size-3.5" />组件词典
        </Link>
        <ChevronRight aria-hidden className="size-3 shrink-0 text-mute/40" />
        <Link href={"/?category=" + category.id + "#gallery"} className="shrink-0 transition-colors hover:text-ink">{category.label}</Link>
        <ChevronRight aria-hidden className="size-3 shrink-0 text-mute/40" />
        <span className="truncate text-ink/65">{entry.title}</span>
      </nav>

      <header className="mb-9 mt-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end md:mb-11 md:mt-12">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-3">
            <span className="text-accent">No.{formatIndex(index)}</span><span aria-hidden className="h-px w-5 bg-white/20" />{entry.name}
          </p>
          <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">{entry.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-mute">{entry.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
          <CopyButton text={prompt} variant="primary" className="h-11 px-6 text-sm" />
          <span className="text-[10px] text-mute">复制给 AI，把效果带进你的项目</span>
        </div>
      </header>

      <PreviewStage contentClassName={entry.previewClassName}>{entry.preview}</PreviewStage>

      <div className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.8fr)] lg:gap-9">
        <aside className="order-2 min-w-0 lg:order-1">
          <div className="surface-panel p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="eyebrow">设计手记</p>
            <h2 className="mt-2 text-lg font-medium tracking-tight">好效果，藏在这些细节里。</h2>
            <ol className="mt-6 space-y-5">
              {entry.designNotes.map((note, noteIndex) => (
                <li key={note} className="flex gap-3.5 text-xs leading-6">
                  <span className="mt-0.5 font-mono text-[10px] text-accent/70">{String(noteIndex + 1).padStart(2, "0")}</span>
                  <span className="text-mute">{note}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 border-t border-line pt-5">
              <p className="flex items-center gap-2 text-[10px] text-mute"><Package aria-hidden className="size-3" />{entry.deps.length ? "依赖 " + entry.deps.join(" · ") : "无需额外依赖"}</p>
              <ul aria-label="组件标签" className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <li key={tag} className="rounded-md border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-mute">{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <div className="order-1 min-w-0 lg:order-2"><CodeTabs tabs={tabs} /></div>
      </div>

      <nav aria-label="组件翻页" className="mt-14 border-t border-line pt-7 md:mt-20">
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow">继续翻阅</p>
          <span className="font-mono text-[10px] text-mute">{formatIndex(index)} / {registry.length}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link href={"/c/" + prev.slug} className="surface-panel group flex items-center gap-5 p-5 transition-colors hover:border-accent/25 sm:p-6">
              <span className="grid size-9 place-items-center rounded-full border border-line text-mute transition-colors group-hover:border-accent/25 group-hover:text-accent"><ArrowLeft aria-hidden className="size-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-0.5" /></span>
              <span className="min-w-0">
                <span className="block text-[10px] text-mute">上一个组件</span>
                <span className="mt-2 block text-sm font-medium">{prev.title}</span>
                <span className="mt-1 block truncate font-mono text-[10px] text-mute/60">{prev.name}</span>
              </span>
            </Link>
          ) : <span className="hidden md:block" />}
          {next ? (
            <Link href={"/c/" + next.slug} className="surface-panel group flex items-center justify-end gap-5 p-5 text-right transition-colors hover:border-accent/25 sm:p-6">
              <span className="min-w-0">
                <span className="block text-[10px] text-mute">下一个组件</span>
                <span className="mt-2 block text-sm font-medium">{next.title}</span>
                <span className="mt-1 block truncate font-mono text-[10px] text-mute/60">{next.name}</span>
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-line text-mute transition-colors group-hover:border-accent/25 group-hover:text-accent"><ArrowRight aria-hidden className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" /></span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
