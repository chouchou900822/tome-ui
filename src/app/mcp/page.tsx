import type { Metadata } from "next";
import { ArrowUpRight, FileText, List } from "lucide-react";
import { ChatDemo } from "@/components/mcp/chat-demo";
import { McpHero } from "@/components/mcp/mcp-hero";
import { CopyButton } from "@/components/site/copy-button";
import { SectionHeading } from "@/components/site/section-heading";
import { CodeTabs, type CodeTab } from "@/components/detail/code-tabs";
import { highlight } from "@/lib/highlight";
import { site } from "@/lib/site";
import { Marquee } from "@/registry/components/effects/marquee";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";

const ADD_CMD = "claude mcp add tome -- pnpm mcp";

const STDIO_SNIPPET = `# Claude Code · 本地 stdio（Windows 用 cmd /c 包装 pnpm 的 .cmd shim）
claude mcp add tome -- cmd /c pnpm mcp    # Windows
claude mcp add tome -- pnpm mcp           # macOS / Linux

# 不进项目直接跑：clone 仓库后
pnpm install && pnpm mcp`;

const HTTP_SNIPPET = `# 远程 streamable-http（服务器上 clone 仓库、pnpm install 之后）
pnpm mcp:http                       # 默认 http://127.0.0.1:8787/mcp
pnpm mcp:http -- --host 0.0.0.0 --port 9000

# 或直接用 Docker 镜像（见 /docker 页），然后在客户端接入：
claude mcp add --transport http tome http://<host>:8787/mcp`;

const SOURCE_SNIPPET = `# 从源码运行 MCP 服务器
git clone ${site.github}.git
cd tome-ui
pnpm install

pnpm mcp          # stdio 传输（本地客户端）
pnpm mcp:http     # streamable-http（远程部署）`;

const tools = [
  {
    icon: List,
    name: "list_components",
    title: "查词典",
    body: "把整本词典折叠成一张 Markdown 表格：编号、slug、中英文名、分类、描述、标签、依赖。模型一眼扫完，token 都花在刀刃上。",
    params: ["category?", "query?"],
    output: "| 07 | shimmer-button | 流光按钮 | buttons | … |",
  },
  {
    icon: FileText,
    name: "get_component_prompt",
    title: "取提示词",
    body: "按 slug 取回完整 AI 提示词，结构为「目标 → 前置条件 → 设计要点 → 源码 → 用法 → 验收标准」，AI 拿到即可 1:1 复现。",
    params: ["slug"],
    output: "目标 → 设计要点 → 源码 → 用法 → 验收标准",
  },
];

const highlights = [
  "双传输",
  "Markdown 表格省 token",
  "条目自动同步",
  "无状态 HTTP",
  "/llms.txt 索引",
  "/api/prompt 直取",
  "零维护",
];

export const metadata: Metadata = {
  title: "MCP 服务器",
  description:
    "Tome 内置 MCP 服务器：list_components 与 get_component_prompt 两个工具，把整本组件词典直接接进 Claude Code、Cursor 等 AI 客户端。",
};

export default async function McpPage() {
  const [stdioHtml, httpHtml, sourceHtml] = await Promise.all([
    highlight(STDIO_SNIPPET, "bash"),
    highlight(HTTP_SNIPPET, "bash"),
    highlight(SOURCE_SNIPPET, "bash"),
  ]);

  const tabs: CodeTab[] = [
    {
      id: "stdio",
      label: "stdio 接入",
      raw: STDIO_SNIPPET,
      html: stdioHtml,
      hint: "本地最省事的方式：AI 客户端自己拉起进程，关掉客户端服务即停。",
    },
    {
      id: "http",
      label: "HTTP 接入",
      raw: HTTP_SNIPPET,
      html: httpHtml,
      hint: "服务器或 Docker 部署后，多个客户端、多台机器共享同一个词典服务。",
    },
    {
      id: "source",
      label: "从源码运行",
      raw: SOURCE_SNIPPET,
      html: sourceHtml,
      hint: "想改词典条目或站点内容时，从源码跑，改完即生效。",
    },
  ];

  return (
    <>
      <McpHero addCommand={ADD_CMD} />

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="01"
            label="两个工具"
            title="词典的目录页与内页"
            description="先查目录锁定 slug，再取整页提示词——两步就是一次完整的检索。词典条目变动后数据自动同步，不需要任何维护。"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <SpotlightCard key={t.name} className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5">
                      <Icon className="size-4.5 text-accent" />
                    </span>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {t.params.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-1 font-mono text-xs text-accent">{t.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{t.body}</p>
                  <p className="mt-5 truncate rounded-lg border border-line bg-black/40 px-3 py-2 font-mono text-[11px] text-mute">
                    {t.output}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="02"
            label="真实对话"
            title="AI 自己翻词典的样子"
            description="你提需求，AI 检索词典、锁定组件、取回源码，再把组件装进你的项目——中间不需要你复制任何东西。"
          />
          <ChatDemo />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="03"
            label="接入方式"
            title="三行命令，连上词典"
            description="stdio 适合本地单人，HTTP 适合团队共享；Cursor、Windsurf 等 MCP 客户端同理配置。"
          />
          <CodeTabs tabs={tabs} />
        </div>
      </section>

      <section>
        <div className="border-b border-line py-6">
          <Marquee duration={28} gap="3.5rem">
            {highlights.map((h) => (
              <span key={h} className="flex items-center gap-14">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-mute">{h}</span>
                <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
              </span>
            ))}
          </Marquee>
        </div>
        <div className="mx-auto max-w-[1440px] px-5 py-28 text-center md:px-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            下一句话，就让 AI 开工。
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-mute">
            复制接入命令，回到你的 Agent 里说一句「帮我找个流光按钮」——词典自会递上答案。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CopyButton text={ADD_CMD} label="复制接入命令" variant="primary" />
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink"
            >
              GitHub
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
