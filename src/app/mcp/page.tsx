import type { Metadata } from "next";
import { FileText, List } from "lucide-react";
import { ChatDemo } from "@/components/mcp/chat-demo";
import { McpHero } from "@/components/mcp/mcp-hero";
import { GuideSection } from "@/components/docs/guide-section";
import { GuideOutro } from "@/components/docs/guide-outro";
import { CodeTabs, type CodeTab } from "@/components/detail/code-tabs";
import { highlight } from "@/lib/highlight";
import { site } from "@/lib/site";
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
      <GuideSection id="tools" no="01" label="两个工具" title="目录与内页，刚好够用。"
        description="先找到适合的组件，再取回完整提示词。两次调用，把检索、设计与实现接在一起。">
        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((tool, index) => (
            <SpotlightCard key={tool.name} color="rgba(215,255,60,0.08)" className="bg-panel p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/15 bg-accent/[0.04]"><tool.icon aria-hidden className="size-4.5 text-accent/80" /></span>
                <span className="font-mono text-[10px] text-mute/50">TOOL / 0{index + 1}</span>
              </div>
              <h3 className="mt-7 text-xl font-medium tracking-tight">{tool.title}</h3>
              <p className="mt-2 break-all font-mono text-xs text-accent/80">{tool.name}</p>
              <p className="mt-4 text-sm leading-7 text-mute">{tool.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <span className="mr-1 text-[10px] text-mute/65">参数</span>
                {tool.params.map((param) => <span key={param} className="rounded-md border border-line bg-white/[0.025] px-2 py-1 font-mono text-[10px] text-mute">{param}</span>)}
              </div>
              <p className="mt-4 overflow-x-auto rounded-lg border border-line bg-black/25 px-3 py-3 font-mono text-[10px] whitespace-nowrap text-mute/70">{tool.output}</p>
            </SpotlightCard>
          ))}
        </div>
      </GuideSection>

      <GuideSection id="conversation" no="02" label="对话示例" title="从一句话，到一个好界面。"
        description="描述你的想法，AI 会自己翻阅词典，把合适的组件带回项目。">
        <div className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="max-w-sm">
            <p className="eyebrow text-accent/70">灵感无需中转</p>
            <h3 className="mt-4 text-2xl font-medium leading-relaxed tracking-tight">留在熟悉的编辑器里，<br />让创作保持连贯。</h3>
            <p className="mt-5 text-sm leading-7 text-mute">从挑选效果，到读取设计要点和完整源码，AI 会完成中间的检索。你可以继续调整颜色、文案与布局，让组件成为作品的一部分。</p>
            <p className="mt-7 border-l border-accent/30 pl-4 text-xs leading-6 text-mute">支持 Claude Code、Cursor、Windsurf 等 MCP 客户端。右侧为组件检索与接入的对话演示。</p>
          </div>
          <div className="min-w-0"><ChatDemo /></div>
        </div>
      </GuideSection>

      <GuideSection id="connect" no="03" label="接入方式" title="选一种方式，开始连接。"
        description="本地使用选 stdio，团队共享选 HTTP。先在仓库目录安装依赖，再将服务添加到你的 AI 客户端。">
        <CodeTabs tabs={tabs} className="mx-auto max-w-5xl" />
      </GuideSection>

      <GuideOutro highlights={highlights} title="下一句话，就让 AI 开工。"
        description="复制接入命令，在仓库目录完成配置，再试着说一句「帮我找个流光按钮」。"
        command={ADD_CMD} copyLabel="复制接入命令" href={site.github} linkLabel="查看项目源码" external />
    </>
  );
}
