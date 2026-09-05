import { Compass, Folder, Mail, Music, Settings, Terminal } from "lucide-react";
import { BorderBeam } from "@/registry/components/effects/border-beam";
import { Dock } from "@/registry/components/effects/dock";
import { Marquee } from "@/registry/components/effects/marquee";
import { NumberTicker } from "@/registry/components/effects/number-ticker";
import type { RegistryEntry } from "@/registry/types";

const marqueeItems = ["Next.js", "Tailwind CSS", "TypeScript", "motion", "React 19", "Lucide", "shiki", "pnpm"];

export const effectEntries: RegistryEntry[] = [
  {
    slug: "marquee",
    title: "无限跑马灯",
    name: "Marquee",
    category: "effects",
    description: "内容无缝横向滚动，悬停暂停，两侧柔和淡出，适合展示合作方与技术栈。",
    designNotes: [
      "内容渲染两份首尾相接，每份用 translateX(-100%) 位移自身宽度后循环，第二份 aria-hidden",
      "元素间距同时作为每份的右内边距计入宽度，保证接缝处距离与其他间距一致",
      "默认 30s 一轮线性匀速，支持 reverse 反向；悬停时 animation-play-state: paused",
      "容器两侧用线性渐变 mask 淡出（12% 与 88% 处开始）",
      "纯 CSS 动画，关键帧随组件内联，尊重 prefers-reduced-motion",
    ],
    deps: [],
    file: "effects/marquee.tsx",
    tags: ["Logo 墙", "循环", "纯 CSS", "横向滚动"],
    usage: `import { Marquee } from "@/components/ui/marquee";

const logos = ["Next.js", "Tailwind CSS", "TypeScript", "motion"];

export function LogoWall() {
  return (
    <Marquee duration={24}>
      {logos.map((name) => (
        <span key={name} className="text-2xl font-semibold text-zinc-400">
          {name}
        </span>
      ))}
    </Marquee>
  );
}`,
    previewClassName: "px-0",
    preview: (
      <div className="flex w-full flex-col gap-4">
        <Marquee duration={22}>
          {marqueeItems.map((name) => (
            <span key={name} className="text-lg font-semibold tracking-tight text-zinc-300 @md:text-2xl">
              {name}
            </span>
          ))}
        </Marquee>
        <Marquee duration={28} reverse>
          {marqueeItems.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 @md:text-sm"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    slug: "number-ticker",
    title: "数字滚动",
    name: "Number Ticker",
    category: "effects",
    description: "进入视口后数字从 0 平滑增长到目标值，用于统计数据与里程碑展示。",
    designNotes: [
      "使用 useInView 监听，元素有一半进入视口后只播放一次",
      "用 motion 的 animate(0, value) 驱动，时长 1.8s，缓动 cubic-bezier(0.16,1,0.3,1) 先快后慢",
      "通过 Intl.NumberFormat 格式化，支持千分位、小数位、前后缀",
      "使用 tabular-nums 等宽数字，滚动时宽度不抖动",
      "等宽数字加千分位后整串不可换行，并排多项数据时用 flex-wrap 并给足间距，防止长数字（如 12,800+）溢出与相邻项重合",
      "服务端渲染最终值利于 SEO，客户端挂载后再重置为 0 开始播放；尊重 prefers-reduced-motion",
    ],
    deps: ["motion"],
    file: "effects/number-ticker.tsx",
    tags: ["统计", "数据", "滚动触发", "里程碑"],
    usage: `import { NumberTicker } from "@/components/ui/number-ticker";

export function Stats() {
  return (
    <div className="flex flex-wrap gap-x-12 gap-y-4">
      <div>
        <NumberTicker value={12800} suffix="+" className="text-5xl font-semibold" />
        <p className="text-sm text-zinc-500">开发者</p>
      </div>
      <div>
        <NumberTicker value={99.9} decimals={1} suffix="%" className="text-5xl font-semibold" />
        <p className="text-sm text-zinc-500">可用性</p>
      </div>
    </div>
  );
}`,
    preview: (
      <div className="flex w-full max-w-md flex-wrap items-baseline justify-center gap-x-10 gap-y-4 text-center">
        {[
          { value: 12800, suffix: "+", label: "开发者", decimals: 0 },
          { value: 99.9, suffix: "%", label: "可用性", decimals: 1 },
          { value: 48, suffix: "ms", label: "延迟", decimals: 0 },
        ].map((s) => (
          <div key={s.label}>
            <NumberTicker
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals}
              className="text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-5xl"
            />
            <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500 @md:text-xs">{s.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: "border-beam",
    title: "边框光束",
    name: "Border Beam",
    category: "effects",
    description: "一段渐变光沿着容器边框匀速绕行，让静态卡片拥有可见的「心跳」。",
    designNotes: [
      "光束是一个 64px 的正方形渐变（品牌色→紫→透明），沿 offset-path: rect(0 auto auto 0 round 64px) 运动",
      "通过 offset-distance 从 0% 到 100% 的关键帧完成绕行，默认 6s 线性无限循环",
      "外层用双层 mask（padding-box 与 border-box 相减）只保留 1.5px 边框区域，光束在其他区域不可见",
      "组件绝对定位、pointer-events-none、rounded-[inherit]，父元素需 relative + overflow-hidden 并设定圆角",
      "支持 delay 与 reverse，多条光束叠加时可错开相位；纯 CSS 动画",
    ],
    deps: [],
    file: "effects/border-beam.tsx",
    tags: ["边框", "发光", "卡片", "纯 CSS"],
    usage: `import { BorderBeam } from "@/components/ui/border-beam";

export function Card() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8">
      <h3 className="text-lg font-semibold">Pro 计划</h3>
      <p className="mt-2 text-sm text-zinc-400">每月 ¥99，含全部组件。</p>
      <BorderBeam />
      <BorderBeam delay={3} colorFrom="#06b6d4" colorTo="#7c3aed" />
    </div>
  );
}`,
    preview: (
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-7">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Pro 计划</p>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
          ¥99<span className="text-sm text-zinc-500"> / 月</span>
        </p>
        <p className="mt-2 text-sm text-zinc-400">含全部组件与未来更新。</p>
        <BorderBeam />
        <BorderBeam delay={3} colorFrom="#06b6d4" colorTo="#7c3aed" />
      </div>
    ),
  },
  {
    slug: "dock",
    title: "程序坞",
    name: "Dock",
    category: "effects",
    description: "仿 macOS Dock：图标随指针距离平滑放大，相邻图标被推开，附悬停标签。",
    designNotes: [
      "容器记录指针 clientX 到一个 MotionValue，离开时置为 Infinity 让所有图标回到基础尺寸",
      "每个图标计算自身中心与指针的水平距离，在 ±140px 范围内把尺寸从 44px 插值到 44×1.7px",
      "尺寸经过弹簧（mass 0.1、stiffness 170、damping 14）平滑，放大与回弹带惯性",
      "容器 items-end 让图标向上生长；毛玻璃底（白 5% + backdrop-blur-xl）、1px 白色 10% 边框、rounded-2xl",
      "悬停时图标上方浮现标签（role=tooltip），图标按钮带 aria-label",
    ],
    deps: ["motion"],
    file: "effects/dock.tsx",
    tags: ["导航", "macOS", "弹簧", "图标"],
    usage: `import { Compass, Folder, Mail, Music, Settings } from "lucide-react";
import { Dock } from "@/components/ui/dock";

export function AppDock() {
  return (
    <Dock
      items={[
        { label: "探索", icon: <Compass /> },
        { label: "文件", icon: <Folder /> },
        { label: "邮件", icon: <Mail /> },
        { label: "音乐", icon: <Music /> },
        { label: "设置", icon: <Settings /> },
      ]}
    />
  );
}`,
    preview: (
      <Dock
        items={[
          { label: "探索", icon: <Compass /> },
          { label: "文件", icon: <Folder /> },
          { label: "终端", icon: <Terminal /> },
          { label: "邮件", icon: <Mail /> },
          { label: "音乐", icon: <Music /> },
          { label: "设置", icon: <Settings /> },
        ]}
      />
    ),
  },
];
