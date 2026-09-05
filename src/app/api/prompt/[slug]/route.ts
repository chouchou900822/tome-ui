import { buildPrompt } from "@/lib/prompt";
import { readComponentSource } from "@/lib/source";
import { getEntry, registry, toSummary } from "@/registry";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return registry.map((e) => ({ slug: e.slug }));
}

/** 返回某个组件的完整提示词，供 AI 代理或 curl 直接拉取 */
export async function GET(_request: Request, ctx: RouteContext<"/api/prompt/[slug]">): Promise<Response> {
  const { slug } = await ctx.params;
  const entry = getEntry(slug);
  if (!entry) return new Response("未找到该组件", { status: 404 });

  const source = await readComponentSource(entry.file);
  const prompt = buildPrompt({ entry: toSummary(entry), source });

  return new Response(prompt, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
