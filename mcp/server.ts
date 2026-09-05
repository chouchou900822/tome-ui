import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { site } from "../src/lib/site";
import { categories, getCategory } from "../src/registry/categories";
import type { CategoryId } from "../src/registry/types";
import { componentCount, getComponentPrompt, listComponents, suggestSlugs, type ComponentRow } from "./data";

/** category 枚举从 categories 派生，新增分类自动同步，无需改这里 */
const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];
const categorySchema = z.enum(categoryIds);

/** Markdown 表格单元格里的竖线会破坏结构，统一转义 */
function cell(text: string): string {
  return text.replace(/\|/g, "\\|");
}

/** 把组件列表渲染成 Markdown 表格（比 JSON 省 token，模型可读性也好） */
function renderTable(rows: ComponentRow[]): string {
  const body = rows
    .map((r) => {
      const name = cell(`${r.title} ${r.name}`);
      const label = cell(getCategory(r.category).label);
      const tags = cell(r.tags.join("、"));
      const deps = r.deps.length > 0 ? cell(r.deps.join("、")) : "–";
      return `| ${r.no} | ${r.slug} | ${name} | ${label} | ${cell(r.description)} | ${tags} | ${deps} |`;
    })
    .join("\n");
  return [
    `Tome 组件词典：共 ${componentCount} 个组件（本次列出 ${rows.length} 个）。`,
    "",
    "| No. | slug | 名称 | 分类 | 描述 | 标签 | 依赖 |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    body,
    "",
    "调用 get_component_prompt(slug) 可获取该组件的完整 AI 实现提示词。",
  ].join("\n");
}

/** 空结果时列出全部可用分类，引导模型修正参数 */
function renderEmpty(): string {
  const list = categories.map((c) => `${c.id}（${c.label}）`).join("、");
  return `没有匹配的组件。可用分类：${list}。请调整 category 或 query 后重试。`;
}

/** 构建一个全新的 MCP 服务器实例；HTTP 无状态模式下每个请求调用一次 */
export function buildServer(): McpServer {
  const server = new McpServer({
    name: `${site.name.toLowerCase()}-mcp`,
    version: "0.1.0",
  });

  server.registerTool(
    "list_components",
    {
      title: "Tome 组件列表",
      description:
        "列出词典全部组件（编号、slug、中英文名、分类、描述、标签、依赖）。" +
        "可用 category 按分类过滤，query 按关键词（名称/描述/标签）过滤。" +
        "拿到 slug 后用 get_component_prompt 获取完整实现提示词。",
      inputSchema: {
        category: categorySchema.optional().describe("分类 id，不传返回全部"),
        query: z.string().optional().describe("关键词，空格分隔多词按 AND 匹配"),
      },
    },
    async ({ category, query }) => {
      const rows = listComponents({ category: category ?? "all", query: query ?? "" });
      const text = rows.length > 0 ? renderTable(rows) : renderEmpty();
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "get_component_prompt",
    {
      title: "获取组件 AI 提示词",
      description:
        "返回指定组件的完整 Markdown 提示词：任务目标、前置条件、设计要点、完整源码、用法、验收标准。" +
        "直接粘贴给 AI 编程助手即可复现该组件。",
      inputSchema: {
        slug: z.string().describe("组件 slug，来自 list_components，如 shimmer-button"),
      },
    },
    async ({ slug }) => {
      const prompt = await getComponentPrompt(slug);
      if (prompt === undefined) {
        return {
          content: [
            {
              type: "text",
              text: `未找到组件「${slug}」。相近的 slug：${suggestSlugs(slug).join("、")}。请先用 list_components 查询。`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: prompt }] };
    },
  );

  return server;
}
