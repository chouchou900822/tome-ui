import { ArrowDown, FileText, List } from "lucide-react";
import { GuideHero, type GuideStat } from "@/components/docs/guide-hero";
import { CopyButton } from "@/components/site/copy-button";
import { registry } from "@/registry";
import { GridBeams } from "@/registry/components/backgrounds/grid-beams";
import { OrbitingCircles } from "@/registry/components/effects/orbiting-circles";

const stats: GuideStat[] = [
  { value: registry.length, label: "可检索组件" },
  { value: 2, label: "查询工具" },
  { value: 2, label: "接入方式" },
];

const clients = ["Claude Code", "Cursor", "Windsurf", "Cline"];

interface McpHeroProps {
  addCommand: string;
}

export function McpHero({ addCommand }: McpHeroProps) {
  return (
    <GuideHero label="连接你的 AI 工作流" code="MCP" title={["把灵感，", "接进你的 Agent。"]}
      description={<p>让 AI 直接检索组件、读取提示词，把完整源码装进项目。在你习惯的编辑器里，描述想要的效果，剩下的交给词典。</p>}
      actions={<><CopyButton text={addCommand} label="复制接入命令" variant="primary" /><a href="#connect" className="button-secondary text-xs">查看接入指南<ArrowDown aria-hidden className="size-3.5" /></a></>}
      stats={stats} links={[{ id: "tools", label: "两个工具" }, { id: "conversation", label: "对话示例" }, { id: "connect", label: "开始接入" }]}>
      <div className="surface-panel mx-auto max-w-[520px] overflow-hidden bg-[#0d1010]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="eyebrow text-[9px]">TOME / 连接示意</span>
          <span className="rounded-full border border-accent/15 bg-accent/5 px-2.5 py-1 text-[9px] text-accent/80">一个词典，多个客户端</span>
        </div>
        <GridBeams size={36} lineColor="rgba(255,255,255,0.025)" beamColor="#d7ff3c45" columns={[2, 7, 11]} className="bg-transparent">
          <div role="img" aria-label="Tome 通过 MCP 连接 Claude Code、Cursor、Windsurf 和 Cline" className="relative flex h-[350px] items-center justify-center overflow-hidden sm:h-[370px]">
            <div aria-hidden className="pointer-events-none absolute size-[272px] rounded-full border border-white/[0.07]" />
            <div aria-hidden className="pointer-events-none absolute size-[180px] rounded-full border border-dashed border-white/[0.045]" />
            <div aria-hidden className="pointer-events-none absolute size-56 rounded-full bg-accent/[0.035] blur-3xl" />
            <div className="shrink-0 scale-[0.83] sm:scale-100">
              <OrbitingCircles radius={132} duration={44} startAngle={45}
                items={clients.map((client) => <span key={client} className="whitespace-nowrap rounded-full border border-white/12 bg-[#151816] px-4 py-2.5 font-mono text-[10px] text-ink/80 shadow-xl">{client}</span>)}
                center={<div className="relative flex size-24 flex-col items-center justify-center rounded-3xl border border-accent/25 bg-[#191e12] shadow-[0_0_70px_-20px_#d7ff3c35]"><span aria-hidden className="size-5 rotate-45 rounded-[2px] bg-accent" /><span className="mt-3 text-sm font-medium tracking-tight">Tome</span></div>} />
            </div>
          </div>
        </GridBeams>
        <div className="grid grid-cols-2 divide-x divide-line border-t border-line bg-black/20">
          <span className="flex flex-col items-center gap-2 px-3 py-4 font-mono text-[9px] text-mute"><List aria-hidden className="size-3.5 text-accent/60" />list_components</span>
          <span className="flex flex-col items-center gap-2 px-3 py-4 font-mono text-[9px] text-mute"><FileText aria-hidden className="size-3.5 text-accent/60" />get_component_prompt</span>
        </div>
      </div>
    </GuideHero>
  );
}
