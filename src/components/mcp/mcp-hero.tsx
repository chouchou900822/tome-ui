import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/site/copy-button";
import { registry } from "@/registry";
import { GridBeams } from "@/registry/components/backgrounds/grid-beams";
import { OrbitingCircles } from "@/registry/components/effects/orbiting-circles";
import { NumberTicker } from "@/registry/components/effects/number-ticker";
import { ShinyText } from "@/registry/components/text/shiny-text";
import { TextReveal } from "@/registry/components/text/text-reveal";
import { WordRotate } from "@/registry/components/text/word-rotate";

const stats = [
  { value: registry.length, label: "组件在线", suffix: "" },
  { value: 2, label: "MCP 工具", suffix: "" },
  { value: 0, label: "维护成本", suffix: "" },
];

const clients = ["Claude Code", "Cursor", "Windsurf", "Cline"];
const endpoints = ["list_components", "get_component_prompt", "/llms.txt", "/api/prompt"];

/** 轨道 chip：客户端名或接口名 */
function Chip({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-[11px] text-white/80 backdrop-blur-sm">
      {children}
    </span>
  );
}

/** 中心节点：词典 Logo，呼应站头的旋转方块 */
function Core() {
  return (
    <span className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-black/70 backdrop-blur-sm">
      <span className="size-5 rotate-45 bg-accent" />
    </span>
  );
}

interface McpHeroProps {
  /** 一键复制的接入命令 */
  addCommand: string;
}

/** MCP 页首屏：网格光束背景 + 双层星轨展示词典与 Agent 生态 */
export function McpHero({ addCommand }: McpHeroProps) {
  return (
    <section className="border-b border-line">
      <GridBeams className="min-h-[calc(100svh-3.5rem)]">
        <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-[1440px] items-center gap-14 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
              <span className="font-pixel text-accent">INTEGRATE</span>
              <span className="h-px w-8 bg-line" />
              <span>MODEL CONTEXT PROTOCOL</span>
            </p>

            <h1 className="mt-10 text-[clamp(2.4rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-tight">
              <TextReveal text="把词典，" />
              <br />
              <span className="text-outline">
                <TextReveal text="接进你的 Agent。" delay={0.35} />
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-mute">
              内置 MCP 服务器把整本词典暴露成两个工具。AI 自己检索、自己取提示词、自己装进项目——
              <ShinyText
                text="你只管提需求。"
                baseColor="rgba(255,255,255,0.8)"
                className="text-white/85"
              />
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-mute">
              在
              <WordRotate
                words={["Claude Code", "Cursor", "Windsurf", "任何 MCP 客户端"]}
                className="mx-1.5 font-medium text-ink"
              />
              里说一句「帮我找个流光按钮」，剩下的交给词典。
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CopyButton text={addCommand} label="复制接入命令" variant="primary" />
              <Link
                href="/#gallery"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink"
              >
                先浏览词典
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-12 grid max-w-sm grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {stats.map((s) => (
                <div key={s.label} className="bg-canvas/80 p-4 backdrop-blur-sm">
                  <NumberTicker
                    value={s.value}
                    suffix={s.suffix}
                    className="font-pixel text-2xl text-ink"
                  />
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center py-10 lg:col-span-6">
            <OrbitingCircles
              radius={158}
              duration={38}
              reverse
              items={endpoints.map((e) => (
                <Chip key={e}>{e}</Chip>
              ))}
              center={
                <OrbitingCircles
                  radius={92}
                  duration={24}
                  items={clients.map((c) => (
                    <Chip key={c}>{c}</Chip>
                  ))}
                  center={<Core />}
                />
              }
            />
          </div>
        </div>
      </GridBeams>
    </section>
  );
}
