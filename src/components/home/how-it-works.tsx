import { ArrowUpRight, Bot, ClipboardCopy, MousePointer2, type LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
}

const steps: Step[] = [
  { icon: MousePointer2, title: "遇见心动的组件", body: "悬停、点击、滚动，亲手感受每一个细节。" },
  { icon: ClipboardCopy, title: "复制完整提示词", body: "设计要点、源码与用法，一次复制就齐了。" },
  { icon: Bot, title: "交给你的 AI", body: "粘贴给 Cursor、Claude Code 或 v0，即刻实现。" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="如何使用组件词典" className="scroll-mt-24 border-b border-line bg-white/[0.012]">
      <ol className="page-shell grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 py-7 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0 lg:px-9">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.025]">
              <step.icon aria-hidden className="size-4 text-mute" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-accent/80">0{index + 1}</span>
                <h2 className="text-sm font-medium">{step.title}</h2>
                <ArrowUpRight aria-hidden className="ml-auto hidden size-3 text-mute/50 xl:block" />
              </div>
              <p className="mt-2 text-xs leading-6 text-mute">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
