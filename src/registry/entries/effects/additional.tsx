import { MousePointerClick } from "lucide-react";
import { ClickSpark } from "@/registry/components/effects/click-spark";
import { TextPressure } from "@/registry/components/effects/text-pressure";
import { ThinkingMarquee } from "@/registry/components/effects/thinking-marquee";
import type { RegistryEntry } from "@/registry/types";

const thinkingText = "先确认问题的边界，再把复杂的目标拆成几个可以验证的步骤。比较不同路径的成本，保留真正影响结果的约束。让新的线索从右侧安静地浮现，旧的思绪在左侧缓慢消散。等待不必被进度条填满，一点轻微的流动，就足以说明思考仍在继续。重新检查最初的假设，把零散的信息连接起来，再用清晰、简洁的语言组织最终回答。";

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
  {
    slug: "thinking-marquee",
    title: "思考流跑马灯",
    name: "Thinking Marquee",
    category: "effects",
    description: "推理文字向左轻柔流动，微光掠过字面，让等待拥有安静的呼吸感。",
    designNotes: [
      "默认字号 15px、字重 300、行高 1.85、字距 0.024em；深色舞台文字使用 oklch(72% 0.01 250)，右侧指示点为 4px、间距 12px",
      "每 48ms 追加 2 个字素，620ms、cubic-bezier(0.25,1,0.5,1) 纯透明度淡入；左侧渐隐取 148px 与 22% 的较小值，右侧取 64px 与 9% 的较小值，尾部保留 56px",
      "速度由 24px/s 起步，积压系数 1.8、指数平滑时间常数 90ms、上限 2400px/s；积压限制为 max(600px,2.5 屏)，离开左侧 1 屏后回收节点并补偿位移",
      "扫光固定在视口上：110deg 渐变、白色 12% 透明度、200% 背景，3s 线性循环；4px 圆点以 3.4s 呼吸，透明度 0.2–0.55、scale 0.78–1",
      "streaming 接收实时追加，结束后显示完待处理文字再触发 onComplete；loop 默认关闭，开启后完成停顿 2s 重播；每 900ms 礼貌播报新增文字，减少动态效果时直接显示末尾并关闭循环、扫光与呼吸",
    ],
    deps: [],
    file: "effects/thinking-marquee.tsx",
    tags: ["AI", "流式文本", "等待反馈", "跑马灯", "扫光"],
    usage: `import { ThinkingMarquee } from "@/components/ui/thinking-marquee";

export function ThinkingIndicator() {
  return (
    <div className="max-w-xl rounded-[14px] border border-white/10 bg-[#111214] px-[18px] py-3.5">
      <p className="mb-2 text-xs text-zinc-500">推理过程</p>
      <ThinkingMarquee text="先确认问题的边界，再比较不同方案。检查关键假设，整理线索，形成清晰的回答。" />
    </div>
  );
}

// 接入实时输出：把累计文本传入 text，生成期间保持 streaming 为 true。
// 结束后设为 false；传入空字符串可清空，paused 可暂停，onComplete 可接收完成通知。
export function LiveThinking({ text, streaming }: { text: string; streaming: boolean }) {
  return <ThinkingMarquee text={text} streaming={streaming} />;
}`,
    preview: (
      <div className="w-full max-w-xl space-y-5 @md:space-y-7">
        <p className="border-l border-white/15 pl-3 text-xs leading-relaxed text-zinc-300 @md:text-sm @xl:text-base">
          为一段等待，设计安静的反馈。
        </p>
        <div className="rounded-[14px] border border-white/10 bg-[#111214] px-4 py-3 @md:px-[18px] @md:py-3.5">
          <p className="mb-2.5 font-mono text-[10px] tracking-[0.09em] text-zinc-500 @md:text-xs">推理过程</p>
          <ThinkingMarquee text={thinkingText} loop className="text-xs @md:text-[15px]" />
        </div>
        <p className="text-[10px] tracking-wide text-zinc-500 @md:text-xs">思绪轻轻流过，答案正在成形。</p>
      </div>
    ),
  },
];
