import { site } from "@/lib/site";
import { categories, registry } from "@/registry";

export const dynamic = "force-static";

/** 给 AI 代理读的纯文本索引，遵循 llms.txt 约定 */
export function GET(): Response {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.tagline}。${site.description}`,
    "",
    "每个组件都提供一段可直接粘贴给 AI 编程助手的提示词，提示词内含完整源码与设计要点。",
    "获取提示词：GET /api/prompt/{slug}（text/markdown）。",
    "",
  ];

  for (const category of categories) {
    lines.push(`## ${category.label}（${category.code}）`, "");
    for (const entry of registry.filter((e) => e.category === category.id)) {
      lines.push(`- [${entry.title} ${entry.name}](/api/prompt/${entry.slug}): ${entry.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
