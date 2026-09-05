import type { Metadata } from "next";
import { ArrowRight, Bot, Globe, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { CodeTabs, type CodeTab } from "@/components/detail/code-tabs";
import { DockerHero } from "@/components/docker/docker-hero";
import { CopyButton } from "@/components/site/copy-button";
import { SectionHeading } from "@/components/site/section-heading";
import { TerminalWindow } from "@/components/site/terminal-window";
import { highlight } from "@/lib/highlight";
import { site } from "@/lib/site";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";
import { Marquee } from "@/registry/components/effects/marquee";

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
      <DockerHero terminal={{ title: "bash — 一键启动", code: RUN_CMD, html: runHtml }} />

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="01"
            label="获取镜像"
            title="两种方式，同一个容器"
            description="容器内同时运行静态站点（nginx 伺服 out/）与 MCP 服务器（streamable-http），启动即双服务就绪。"
          />
          <CodeTabs tabs={tabs} />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="02"
            label="容器内部"
            title="容器里跑着什么"
            description="Alpine 底座上的双进程封装：页面与接口各守一个端口，互不干扰、同时就绪。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <SpotlightCard key={s.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5">
                      <Icon className="size-4.5 text-accent" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      {s.meta}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{s.body}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 md:px-8">
          <SectionHeading
            no="03"
            label="运维速查"
            title="日常就这几条命令"
            description="无数据库、无状态、无配置文件。容器挂了重启即可，词典内容跟着镜像走。"
          />
          <TerminalWindow title="bash — 运维速查" code={OPS_SNIPPET} html={opsHtml} beam={false} className="mx-auto max-w-3xl" />
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
            镜像已备好，就等你按下回车。
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-mute">
            一条命令的时间，你的团队就有自己的组件词典——以及一个随叫随到的 AI 组件接口。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CopyButton text={RUN_CMD} label="复制启动命令" variant="primary" />
            <Link
              href="/mcp"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink"
            >
              下一页：MCP 接入
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
