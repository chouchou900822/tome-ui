import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/site/copy-button";
import { TerminalWindow } from "@/components/site/terminal-window";
import { site } from "@/lib/site";
import { AuroraBackground } from "@/registry/components/backgrounds/aurora-background";
import { NumberTicker } from "@/registry/components/effects/number-ticker";
import { ShinyText } from "@/registry/components/text/shiny-text";
import { TextReveal } from "@/registry/components/text/text-reveal";

const stats = [
  { value: 2, label: "内置服务", suffix: "" },
  { value: 1, label: "启动命令", suffix: "" },
  { value: 100, label: "静态导出", suffix: "%" },
];

interface DockerHeroProps {
  /** 启动命令终端窗口（shiki 已高亮） */
  terminal: { title: string; code: string; html: string };
}

/** Docker 页首屏：极光背景 + 启动命令终端 + 数字滚动统计 */
export function DockerHero({ terminal }: DockerHeroProps) {
  return (
    <section className="border-b border-line">
      <AuroraBackground className="min-h-[calc(100svh-3.5rem)]">
        <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-[1440px] items-center gap-14 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-6">
            {/* 左栏局部暗化底衬：压住极光亮区，保证文字对比度 */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-10 -inset-y-12 rounded-[3rem] bg-black/50 blur-3xl"
            />
            <div className="relative">
              <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
                <span className="font-pixel text-accent">DEPLOY</span>
                <span className="h-px w-8 bg-white/15" />
                <span>DOCKER</span>
              </p>

              <h1 className="mt-10 text-[clamp(2.4rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-tight">
                <TextReveal text="一条命令，" />
                <br />
                <span className="text-outline">
                  <TextReveal text="跑起整本词典。" delay={0.35} />
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-base leading-relaxed text-mute">
                容器里同时住着两个服务：
                <ShinyText
                  text="静态站点给人看，MCP 服务器给 AI 用。"
                  baseColor="rgba(255,255,255,0.8)"
                  className="text-white/85"
                />
                拉下镜像、映射两个端口，组件词典就在你的机器上开张。
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <CopyButton text={terminal.code} label="复制启动命令" variant="primary" />
                <a
                  href={`${site.github}/blob/main/Dockerfile`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-white/15 px-4 text-xs text-mute transition-colors hover:border-white/30 hover:text-ink"
                >
                  查看 Dockerfile
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>

              <div className="mt-12 grid max-w-sm grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                {stats.map((s) => (
                  <div key={s.label} className="bg-black/60 p-4 backdrop-blur-sm">
                    <NumberTicker
                      value={s.value}
                      suffix={s.suffix}
                      className="font-pixel text-2xl text-white"
                    />
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <TerminalWindow {...terminal} beam={false} className="backdrop-blur-sm" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-wide text-white/60 backdrop-blur-sm">
                页面 http://localhost:3000/
              </span>
              <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-wide text-white/60 backdrop-blur-sm">
                MCP http://localhost:8787/mcp
              </span>
            </div>
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
}
