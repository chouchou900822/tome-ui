import { MousePointerClick } from "lucide-react";
import { ClickSpark } from "@/registry/components/effects/click-spark";
import { TextPressure } from "@/registry/components/effects/text-pressure";
import type { RegistryEntry } from "@/registry/types";

export const effectMoreEntries: RegistryEntry[] = [
  {
    slug: "click-spark",
    title: "点击火花",
    name: "Click Spark",
    category: "effects",
    description: "在容器内任意位置点击，迸出一圈白色短线向外飞散淡出。",
    designNotes: [
      "Canvas 绝对定位叠在内容之上、pointer-events-none，不拦截任何点击；点击坐标经 onClick 捕获换算为画布内坐标",
      "每次点击迸出 8 条 2px 圆头短线，角度均分圆周并带 ±0.25rad 随机抖动",
      "每条线在 420ms 内向外飞出约 22px，尾部逐渐追上头部完成消散，透明度线性归零",
      "画布按 devicePixelRatio（上限 2）缩放，ResizeObserver 跟随容器；空置时循环仅清屏",
      "prefers-reduced-motion 时点击不产生火花",
    ],
    deps: [],
    file: "effects/click-spark.tsx",
    tags: ["点击", "Canvas", "微交互", "包装器"],
    usage: `import { ClickSpark } from "@/components/ui/click-spark";

export function Panel() {
  return (
    <ClickSpark className="rounded-2xl border border-white/10 p-8">
      <p>在这一区域内的任意位置点击</p>
    </ClickSpark>
  );
}`,
    preview: (
      <ClickSpark className="w-full max-w-sm rounded-2xl border border-dashed border-white/15 p-8 text-center">
        <MousePointerClick className="mx-auto size-6 text-zinc-500" />
        <p className="mt-3 text-sm text-zinc-400">在框内任意位置点击</p>
      </ClickSpark>
    ),
  },
  {
    slug: "text-pressure",
    title: "压力字体",
    name: "Text Pressure",
    category: "effects",
    description: "指针靠近的字符被压粗，划过时像手指按过一行软字。",
    designNotes: [
      "每个字符独立 span，指针移动经 rAF 节流后逐字测量与指针的距离，字重直接写入 style，不触发 React 重渲染",
      "距离在 130px 半径内线性映射字重 400→850（font-weight 与 font-variation-settings 双写），离开区域回落",
      "需要可变字体才有平滑过渡（系统 UI 字体多为可变）；过渡加 100ms transition 消除跳变",
      "外层 aria-label 保留完整文本；prefers-reduced-motion 时保持静态字重",
    ],
    deps: ["motion"],
    file: "effects/text-pressure.tsx",
    tags: ["字体", "指针", "可变字体", "交互"],
    usage: `import { TextPressure } from "@/components/ui/text-pressure";

export function Headline() {
  return (
    <h1 className="text-7xl font-medium tracking-tight">
      <TextPressure text="PRESSURE" />
    </h1>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-3">
        <TextPressure
          text="PRESSURE"
          className="text-2xl font-medium tracking-tight text-white @md:text-4xl @xl:text-6xl"
        />
        <p className="text-xs text-zinc-500 @md:text-sm">把鼠标划过这行字</p>
      </div>
    ),
  },
];
