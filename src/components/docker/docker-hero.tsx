import { ArrowDown, Globe, Network } from "lucide-react";
import { GuideHero, type GuideStat } from "@/components/docs/guide-hero";
import { CopyButton } from "@/components/site/copy-button";
import { TerminalWindow } from "@/components/site/terminal-window";
import { AuroraBackground } from "@/registry/components/backgrounds/aurora-background";

const stats: GuideStat[] = [
  { value: 2, label: "内置服务" },
  { value: 1, label: "启动命令" },
  { value: 100, label: "静态导出", suffix: "%" },
];

interface DockerHeroProps {
  terminal: { title: string; code: string; html: string };
}

export function DockerHero({ terminal }: DockerHeroProps) {
  return (
    <GuideHero label="把词典，留在自己的空间" code="DOCKER" title={["一条命令，", "拥有整本词典。"]}
      description={<p>把组件站点与 MCP 服务一起打包，部署到你的机器或团队服务器。打开浏览器挑选灵感，让 AI 随时取用。</p>}
      actions={<><CopyButton text={terminal.code} label="复制启动命令" variant="primary" /><a href="#install" className="button-secondary text-xs">查看部署步骤<ArrowDown aria-hidden className="size-3.5" /></a></>}
      stats={stats} links={[{ id: "install", label: "获取镜像" }, { id: "services", label: "容器服务" }, { id: "operations", label: "日常维护" }]}>
      <div className="relative mx-auto max-w-[560px]">
        <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden rounded-full opacity-40 blur-3xl">
          <AuroraBackground colors={["#233b19", "#122b28", "#343e18"]} speed={22} className="h-full" />
        </div>
        <div className="relative">
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="eyebrow text-[9px]">从这一条命令开始</span>
            <span className="font-mono text-[9px] text-mute/55">tome-ui / latest</span>
          </div>
          <TerminalWindow {...terminal} beam={false} className="bg-[#101314]/95" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="surface-panel bg-[#101314]/90 p-4 sm:p-5">
              <Globe aria-hidden className="size-4 text-accent/75" />
              <p className="mt-4 text-xs font-medium">组件站点</p>
              <p className="mt-2 font-mono text-[10px] text-mute">localhost:3000</p>
              <p className="mt-3 text-[10px] leading-5 text-mute/65">为每一位创作者准备</p>
            </div>
            <div className="surface-panel bg-[#101314]/90 p-4 sm:p-5">
              <Network aria-hidden className="size-4 text-accent/75" />
              <p className="mt-4 text-xs font-medium">MCP 服务器</p>
              <p className="mt-2 font-mono text-[10px] text-mute">localhost:8787/mcp</p>
              <p className="mt-3 text-[10px] leading-5 text-mute/65">让 AI 与词典保持连接</p>
            </div>
          </div>
          <p className="mt-4 text-right text-[10px] text-mute/60">容器启动后，即可通过以上地址访问</p>
        </div>
      </div>
    </GuideHero>
  );
}
