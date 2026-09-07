import type { Metadata } from "next";
import { Bot, Globe, SlidersHorizontal } from "lucide-react";
import { CodeTabs, type CodeTab } from "@/components/detail/code-tabs";
import { DockerHero } from "@/components/docker/docker-hero";
import { GuideSection } from "@/components/docs/guide-section";
import { GuideOutro } from "@/components/docs/guide-outro";
import { TerminalWindow } from "@/components/site/terminal-window";
import { highlight } from "@/lib/highlight";
import { site } from "@/lib/site";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";

const RUN_CMD = `docker run -d --name tome \\
  -p 3000:3000 -p 8787:8787 \\
  ${site.dockerImage}`;

const PULL_SNIPPET = `# 方式一：Docker Hub 直接拉取（推荐）
docker run -d --name tome \\
  -p 3000:3000 -p 8787:8787 \\
  ${site.dockerImage}

# 启动后日志会打印两个访问地址
docker logs -f tome`;

const BUILD_SNIPPET = `# 方式二：从源码本地构建
git clone ${site.github}.git
cd tome-ui
docker build -t tome-ui .
docker run -d --name tome -p 3000:3000 -p 8787:8787 tome-ui`;

const OPS_SNIPPET = `docker logs -f tome        # 启动日志里打印两个访问地址
docker restart tome        # 重启容器
docker rm -f tome          # 停止并移除

# 覆盖容器内监听端口（-p 映射需同步调整）
docker run -d --name tome \\
  -e WEB_PORT=8080 -e MCP_PORT=9090 \\
  -p 3000:8080 -p 8787:9090 \\
  ${site.dockerImage}`;

const services = [
  {
    icon: Globe,
    title: "站点 · 端口 3000",
    body: "nginx 伺服 Next 静态导出产物。浏览词典、实时预览、复制提示词，全部走静态文件，没有运行时渲染开销。",
    meta: "http://localhost:3000/",
  },
  {
    icon: Bot,
    title: "MCP · 端口 8787",
    body: "streamable-http 传输的 MCP 服务器。AI 客户端连上 /mcp，即可调用词典的两个查询工具，接口细节见下一页。",
    meta: "http://localhost:8787/mcp",
  },
  {
    icon: SlidersHorizontal,
    title: "端口可调 · 日志可查",
    body: "WEB_PORT / MCP_PORT 环境变量覆盖容器内监听端口；docker logs -f tome 随时查看启动日志与访问地址。",
    meta: "WEB_PORT · MCP_PORT",
  },
];

const highlights = [
  "双服务封装",
  "静态优先",
  "一键启动",
  "端口可调",
  "Alpine 底座",
  "无状态 MCP",
  "条目自动同步",
];

export const metadata: Metadata = {
  title: "Docker 部署",
  description:
    "一条 docker run 同时启动 Tome 站点与 MCP 服务器：nginx 伺服静态页面，8787 端口把词典暴露给 AI 客户端。",
};

export default async function DockerPage() {
  const [runHtml, pullHtml, buildHtml, opsHtml] = await Promise.all([
    highlight(RUN_CMD, "bash"),
    highlight(PULL_SNIPPET, "bash"),
    highlight(BUILD_SNIPPET, "bash"),
    highlight(OPS_SNIPPET, "bash"),
  ]);

  const tabs: CodeTab[] = [
    {
      id: "pull",
      label: "拉取镜像",
      raw: PULL_SNIPPET,
      html: pullHtml,
      hint: "镜像已推送至 Docker Hub，适合大多数场景；启动日志会打印两个访问地址。",
    },
    {
      id: "build",
      label: "本地构建",
      raw: BUILD_SNIPPET,
      html: buildHtml,
      hint: "想改词典内容或站点文案时，从源码构建自己的镜像。",
    },
  ];

  return (
    <>
      <DockerHero terminal={{ title: "终端 — 一键启动", code: RUN_CMD, html: runHtml }} />
      <GuideSection id="install" no="01" label="获取镜像" title="两种方式，一样开箱即用。"
        description="直接拉取镜像，或从源码构建自己的版本。一个容器，同时提供组件站点与 MCP 服务。">
        <CodeTabs tabs={tabs} className="mx-auto max-w-5xl" />
      </GuideSection>

      <GuideSection id="services" no="02" label="容器服务" title="为人，也为 AI 准备。"
        description="页面与接口各有一个入口。浏览器用来探索，AI 客户端用来取用，端口可以按需要调整。">
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <SpotlightCard key={service.title} color="rgba(215,255,60,0.08)" className="h-full bg-panel p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/15 bg-accent/[0.04]"><service.icon aria-hidden className="size-4.5 text-accent/80" /></span>
                <span className="font-mono text-[10px] text-mute/50">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-base font-medium tracking-tight">{service.title}</h3>
              <p className="mt-3 text-xs leading-7 text-mute">{service.body}</p>
              <p className="mt-5 break-all rounded-lg border border-line bg-black/20 px-3 py-3 font-mono text-[10px] leading-5 text-mute/75">{service.meta}</p>
            </SpotlightCard>
          ))}
        </div>
      </GuideSection>

      <GuideSection id="operations" no="03" label="日常维护" title="常用命令，随手可查。"
        description="查看日志、重启容器，或调整监听端口。日常需要的操作，都收在这里。">
        <TerminalWindow title="终端 — 运维速查" code={OPS_SNIPPET} html={opsHtml} beam={false} className="mx-auto max-w-5xl" />
      </GuideSection>

      <GuideOutro highlights={highlights} title="你的组件词典，随时就绪。"
        description="一条命令，为自己和团队留下一份随时可用的灵感库。部署完成后，再把 MCP 接入你的工作流。"
        command={RUN_CMD} copyLabel="复制启动命令" href="/mcp" linkLabel="继续了解 MCP" />
    </>
  );
}
