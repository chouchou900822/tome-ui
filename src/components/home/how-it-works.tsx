import { Bot, ClipboardCopy, MousePointer2 } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    title: "挑选组件",
    body: "在词典里实时预览每一个效果，悬停、点击、滚动，亲手确认它是不是你想要的。",
  },
  {
    icon: ClipboardCopy,
    title: "复制提示词",
    body: "一键复制。提示词里同时包含设计要点、完整源码与用法示例，AI 不用猜。",
  },
  {
    icon: Bot,
    title: "交给 AI",
    body: "粘贴到 Cursor、Claude Code、Windsurf 或 v0，AI 会把组件装进你的项目并接好数据。",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <ol className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative py-10 md:px-10 md:py-14 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-4xl text-accent md:text-5xl">0{i + 1}</span>
                  <Icon className="size-5 text-mute" />
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
