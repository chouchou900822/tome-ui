import { ArrowLeft, ArrowRight } from "lucide-react";
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
    <article className="mx-auto max-w-[1440px] px-5 pb-28 pt-10 md:px-8">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
        <Link href="/#gallery" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
          <ArrowLeft className="size-3.5" />
          返回词典
        </Link>
        <span>
          <span className="font-pixel text-accent">No.{formatIndex(index)}</span>
          <span className="mx-3">/</span>
          <Link href={`/?category=${category.id}#gallery`} className="hover:text-ink">
            {category.code}
          </Link>
        </span>
      </div>

      <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            {entry.title}
            <span className="ml-4 align-middle font-mono text-base font-normal tracking-normal text-mute md:text-lg">
              {entry.name}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute md:text-lg">{entry.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
          <CopyButton text={prompt} variant="primary" className="h-11 px-6 text-sm" />
          <span className="font-mono text-[11px] text-mute">
            {entry.deps.length ? `依赖 ${entry.deps.join(" · ")}` : "无额外依赖"}
          </span>
        </div>
      </header>

      <div className="mt-10">
        <PreviewStage contentClassName={entry.previewClassName}>{entry.preview}</PreviewStage>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">设计要点</p>
          <ol className="mt-5 space-y-4">
            {entry.designNotes.map((note, i) => (
              <li key={note} className="flex gap-4 text-sm leading-relaxed">
                <span className="font-pixel text-accent">0{i + 1}</span>
                <span className="text-ink/85">{note}</span>
              </li>
            ))}
          </ol>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">标签</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-mute">
                {tag}
              </li>
            ))}
          </ul>
        </aside>
        <div className="lg:col-span-8">
          <CodeTabs tabs={tabs} />
        </div>
      </div>

      <nav className="mt-20 grid gap-4 border-t border-line pt-8 md:grid-cols-2">
        {prev ? (
          <Link href={`/c/${prev.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line p-5 transition-colors hover:border-white/20">
            <ArrowLeft className="size-4 text-mute transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mute">上一个</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/c/${next.slug}`} className="group flex items-center justify-end gap-4 rounded-2xl border border-line p-5 text-right transition-colors hover:border-white/20">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mute">下一个</span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </span>
            <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
