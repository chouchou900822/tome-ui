import { Cpu, Orbit, Zap } from "lucide-react";
import { ElectricBorder } from "@/registry/components/cards/electric-border";
import { MetricCard } from "@/registry/components/cards/metric-card";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";
import { TiltCard } from "@/registry/components/cards/tilt-card";
import type { RegistryEntry } from "@/registry/types";
import { surfaceEntries } from "./surfaces";

export const cardEntries: RegistryEntry[] = [
  {
    slug: "spotlight-card",
    title: "聚光灯卡片",
    name: "Spotlight Card",
    category: "cards",
    description: "一束柔光跟随鼠标在卡片表面游走，同时点亮靠近指针的那段边框。",
    designNotes: [
      "卡片为 rounded-2xl、1px 白色 10% 边框、近黑底色，内边距 32px",
      "光斑是 320px 半径的径向渐变，颜色为带 16% 透明度的品牌色，70% 处完全透明",
      "另一层更亮的径向渐变通过双层 mask（content-box 与 border-box 相减）只保留 1px 边框区域，做出边框被点亮的效果",
      "两层光斑默认透明，悬停时 500ms 淡入；鼠标坐标用 MotionValue 直接写入渐变，不触发重渲染",
      "内容层 relative 置于光层之上；prefers-reduced-motion 时改为中心 50%/30% 的固定柔光，关闭移动边光与渐变过渡",
    ],
    deps: ["motion"],
    file: "cards/spotlight-card.tsx",
    tags: ["悬停", "光斑", "特性卡", "定价"],
    usage: `import { Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function Feature() {
  return (
    <SpotlightCard className="max-w-sm">
      <Cpu className="size-6 text-lime-300" />
      <h3 className="mt-4 text-lg font-semibold">本地优先</h3>
      <p className="mt-2 text-sm text-zinc-400">
        所有组件源码随仓库分发，不依赖任何远端服务。
      </p>
    </SpotlightCard>
  );
}`,
    preview: (
      <SpotlightCard className="w-full max-w-sm">
        <Cpu className="size-6 text-lime-300" />
        <h4 className="mt-5 text-lg font-semibold text-white">本地优先</h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          所有组件源码随仓库分发，不依赖任何远端服务。移动鼠标试试。
        </p>
      </SpotlightCard>
    ),
  },
  {
    slug: "tilt-card",
    title: "3D 倾斜卡片",
    name: "Tilt Card",
    category: "cards",
    description: "卡片随指针位置绕 X/Y 轴旋转，镜面高光跟随角度移动，内容微微浮起。",
    designNotes: [
      "固定外框建立 perspective 1000px 并测量指针，归一化坐标钳制到 0–1 后映射为 ±8° 倾斜，卡面旋转不干扰测量",
      "旋转值经过弹簧（stiffness 200、damping 20、mass 0.4）平滑，离开后缓慢回正到 0",
      "悬停整体缩放 1.02；内容 translateZ(24px)，卡面保留 preserve-3d 且不使用 overflow-hidden，避免三维层级被压平",
      "高光为 rgba(219,228,245,0.16) 的径向渐变，65% 处淡出；底色 #12141b、1px 白 15% 边框、28px 内边距、24px/60px/-28px 黑 85% 投影",
      "触屏不触发倾斜；prefers-reduced-motion 时立即归零旋转与景深，缩放固定为 1，保留静态左上高光",
    ],
    deps: ["motion"],
    file: "cards/tilt-card.tsx",
    tags: ["3D", "视差", "悬停", "展示卡"],
    usage: `import { TiltCard } from "@/components/ui/tilt-card";

export function Showcase() {
  return (
    <TiltCard className="w-80">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Vol.01</p>
      <h3 className="mt-3 text-2xl font-semibold">组件词典</h3>
      <p className="mt-2 text-sm text-zinc-400">移动鼠标，感受景深。</p>
    </TiltCard>
  );
}`,
    preview: (
      <TiltCard className="h-48 w-72 @md:h-56 @md:w-80">
        <div aria-hidden className="pointer-events-none absolute -right-2 top-7 size-28 rounded-full border border-sky-200/15 bg-[radial-gradient(circle_at_30%_25%,rgba(186,214,239,0.12),transparent_70%)] shadow-[inset_0_0_28px_rgba(186,214,239,0.06)] @md:size-36" />
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.24em] text-slate-400">OBJECT / 001</p>
          <Orbit aria-hidden className="size-4 text-slate-400" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <h4 className="text-2xl font-medium tracking-tight text-white @md:text-3xl">浮于表面之上</h4>
          <p className="mt-2 text-xs text-slate-400">移动光标，换一个视角。</p>
        </div>
      </TiltCard>
    ),
  },
  {
    slug: "electric-border",
    title: "电流边框卡片",
    name: "Electric Border",
    category: "cards",
    description: "细电丝沿深色卡面缓缓游走，保留轻微张力与冷色辉光，内容始终安静清晰。",
    designNotes: [
      "固定底板为 #0e1419、1px 白 8% 边框，24px 内容内边距；只有外侧细电丝参与滤镜，底板与正文保持完整",
      "feTurbulence 使用 fractalNoise、2 倍频、seed 7；feDisplacementMap 强度 4px、R/G 通道，滤镜区域扩展至 140% 防止裁边",
      "SMIL 在 6s 内把 baseFrequency 从 0.012/0.025 连续过渡到 0.018/0.035 再返回，避免随机 seed 造成突兀跳变",
      "电丝默认 #8bbdcc、65% 透明度；外辉光 10px/16%、内辉光 16px/6%，使用 color-mix 支持任意 CSS 颜色",
      "动态监听 prefers-reduced-motion：开启时移除 SMIL、位移强度归零；滤镜 id 使用 useId 保证多实例独立",
    ],
    deps: [],
    file: "cards/electric-border.tsx",
    tags: ["电弧", "滤镜", "科幻", "辉光"],
    usage: `import { Zap } from "lucide-react";
import { ElectricBorder } from "@/components/ui/electric-border";

export function Warning() {
  return (
    <ElectricBorder className="w-full max-w-sm">
      <Zap className="size-5 text-[#8bbdcc]" />
      <h3 className="mt-5 text-xl font-medium text-white">保持共振</h3>
      <p className="mt-2 text-sm text-slate-400">微弱的电流，沿边界流动。</p>
    </ElectricBorder>
  );
}`,
    preview: (
      <ElectricBorder className="w-full max-w-xs @md:max-w-sm">
        <div className="flex items-center justify-between text-[#8bbdcc]">
          <Zap aria-hidden className="size-5" /><span className="font-mono text-[9px] tracking-[0.2em]">LIVE SIGNAL</span>
        </div>
        <h4 className="mt-6 text-xl font-medium tracking-tight text-white @md:text-2xl">保持共振</h4>
        <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-[10px] text-slate-400">
          <span>微弱电流，沿边界流动</span><span className="font-mono text-slate-300">50.00 Hz</span>
        </div>
      </ElectricBorder>
    ),
  },
  ...surfaceEntries,
  {
    slug: "metric-card",
    title: "趋势指标卡",
    name: "Metric Card",
    category: "cards",
    description: "大号指标搭配一条轻盈趋势线，划过曲线即可读出每个时刻的数据。",
    designNotes: [
      "底色 #141719、16px 圆角、1px 白色 10% 边框；数值使用等宽字体，小舞台 28px、大舞台 36px，字距 -0.06em",
      "SVG viewBox 为 320×100，横轴内缩 8px，纵轴数据映射到 16–80；相邻数据以中点控制的三次贝塞尔连接，线宽固定 2px",
      "正向趋势色 #bdd5ac、负向 #e8b4a4、中性 #adbed4；面积渐变从同色 18% 衰减到 0%，3 条网格线透明度 6%",
      "指针或原生 range 键盘操作选取数据点，当前点显示 3px 实心圆与 7px 淡色光圈，同时更新日期和数值；离开且失焦后恢复汇总",
      "过滤非有限数值，空数据展示占位，单点与等值序列固定在 y=48；没有挂载动画，焦点环 2px，渐变 id 由 useId 隔离",
    ],
    deps: [],
    file: "cards/metric-card.tsx",
    tags: ["数据", "图表", "趋势", "仪表盘", "指标"],
    usage: `import { MetricCard, type MetricPoint } from "@/components/ui/metric-card";

const data: MetricPoint[] = [
  { label: "周一", value: 1200 }, { label: "周二", value: 1800 },
  { label: "周三", value: 1600 }, { label: "周四", value: 2400 },
  { label: "周五", value: 3100 },
];

export function Analytics() {
  return <MetricCard label="每周访问" value="10,100" change="+24.8%"
    footnote="较上一周" data={data} className="max-w-sm" />;
}`,
    preview: (
      <MetricCard label="本月营收" value="¥48,290" change="+18.6%" footnote="较上月 · 划过曲线查看数据" className="max-w-sm" data={[
        { label: "09.01", value: 21400, formattedValue: "¥21,400" },
        { label: "09.04", value: 28200, formattedValue: "¥28,200" },
        { label: "09.07", value: 26300, formattedValue: "¥26,300" },
        { label: "09.10", value: 35200, formattedValue: "¥35,200" },
        { label: "09.13", value: 31400, formattedValue: "¥31,400" },
        { label: "09.16", value: 38700, formattedValue: "¥38,700" },
        { label: "09.19", value: 36600, formattedValue: "¥36,600" },
        { label: "09.22", value: 43100, formattedValue: "¥43,100" },
        { label: "09.25", value: 41200, formattedValue: "¥41,200" },
        { label: "09.28", value: 48290, formattedValue: "¥48,290" },
      ]} />
    ),
    previewClassName: "px-4 pb-3 pt-11 @md:p-8",
  },
];
