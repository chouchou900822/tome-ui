import { Gem, Wand2, Waves } from "lucide-react";
import { FluidDistortionCard } from "@/registry/components/cards/fluid-distortion-card";
import { GlareCard } from "@/registry/components/cards/glare-card";
import { GlassSurface } from "@/registry/components/cards/glass-surface";
import { WobbleCard } from "@/registry/components/cards/wobble-card";
import type { RegistryEntry } from "@/registry/types";

export const surfaceEntries: RegistryEntry[] = [
  {
    slug: "glass-surface",
    title: "玻璃面板",
    name: "Glass Surface",
    category: "cards",
    description: "毛玻璃底叠顶部光泽、边缘内高光与细噪点，四层质感叠出的厚度感。",
    designNotes: [
      "基底为白色 4.5% 填充、backdrop-blur 40px、1px 白色 15% 边框、16px 圆角；20px/60px/-30px 黑 80% 外投影表现悬浮厚度",
      "左上 120%×90% 径向渐变从白 12% 到 55% 处透明，叠加 135° 斜面渐变（白 4%→透明→白 2.5%）",
      "边缘用 1px 白 20% 顶部高光、1px 白 4% 底部高光，以及 24px 白 3% 内泛光形成细腻倒角",
      "噪点层：feTurbulence 贴图以 5% 透明度 mix-blend-overlay 平铺，消除毛玻璃的塑料感",
      "全静态无动画、无 JavaScript；内容层 relative 置于四层之上",
    ],
    deps: [],
    file: "cards/glass-surface.tsx",
    tags: ["毛玻璃", "质感", "静态", "容器"],
    usage: `import { Gem } from "lucide-react";
import { GlassSurface } from "@/components/ui/glass-surface";

export function Feature() {
  return (
    <GlassSurface className="w-full max-w-sm p-6">
      <Gem className="size-6 text-sky-300" />
      <h3 className="mt-4 text-lg font-semibold">磨砂与光泽</h3>
      <p className="mt-2 text-sm text-zinc-400">
        放在任何彩色背景上，玻璃质感都会透出来。
      </p>
    </GlassSurface>
  );
}`,
    preview: (
      <div className="relative w-full max-w-xs py-6 @md:max-w-sm">
        <div aria-hidden className="absolute -left-4 -top-2 size-28 rounded-full bg-linear-to-br from-[#a4bec6] to-[#355d70] @md:size-36" />
        <div aria-hidden className="absolute -bottom-4 right-0 size-28 rounded-full bg-linear-to-br from-[#b8a1c8] to-[#605075] @md:size-36" />
        <GlassSurface className="h-44 p-6 @md:h-52 @md:p-8">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between text-white/65"><span className="font-mono text-[9px] tracking-[0.2em]">MATERIAL / 01</span><Gem aria-hidden className="size-4" /></div>
            <div><h4 className="text-2xl font-medium tracking-tight text-white">光的收藏</h4><p className="mt-2 text-xs text-white/60">透过磨砂，留下温柔的轮廓。</p></div>
          </div>
        </GlassSurface>
      </div>
    ),
  },
  {
    slug: "glare-card",
    title: "炫光卡片",
    name: "Glare Card",
    category: "cards",
    description: "细密拉丝与斜向柔光构成金属卡面，指针掠过时，反光随角度缓缓移动。",
    designNotes: [
      "底板 #141519、1px 白 15% 边框、24px 内边距，叠加间距 3px、线宽 1px、白 2% 的横向拉丝纹理",
      "background-position 由鼠标写入 CSS 变量 --gx/--gy（直接 setProperty，不触发重渲染）",
      "115° 光带以 220%×220% 背景承载，48% 处白 16% 为峰值；常态透明度 35%，悬停或内部聚焦时 500ms 淡入至 100%",
      "顶部为左右内缩 16px、1px 高的白 40% 高光线，常态透明度 40%；悬停时边框提高到白 25%",
      "prefers-reduced-motion 时停止光带跟随与渐变过渡，保留静态金属反光；命名 group 避免父卡片的悬停误触发",
    ],
    deps: [],
    file: "cards/glare-card.tsx",
    tags: ["悬停", "光带", "反光", "特性卡"],
    usage: `import { Wand2 } from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";

export function Feature() {
  return (
    <GlareCard className="max-w-sm">
      <Wand2 className="size-6 text-sky-300" />
      <h3 className="mt-4 text-lg font-semibold">流光掠过</h3>
      <p className="mt-2 text-sm text-zinc-400">移动鼠标，光带会跟着走。</p>
    </GlareCard>
  );
}`,
    preview: (
      <GlareCard className="w-full max-w-xs @md:max-w-sm">
        <div className="flex items-center justify-between text-zinc-400"><Wand2 aria-hidden className="size-4" /><span className="font-mono text-[9px] tracking-[0.2em]">BRUSHED ALLOY</span></div>
        <h4 className="mt-6 text-4xl font-light tracking-[-0.06em] text-zinc-200 @md:text-5xl">FORM / 01</h4>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-zinc-400"><span>形态研究</span><span>移动光标，捕捉反光</span></div>
      </GlareCard>
    ),
  },
  {
    slug: "wobble-card",
    title: "果冻卡片",
    name: "Wobble Card",
    category: "cards",
    description: "指尖揉动时柔软形变，按住挤扁、松手弹颤，像一块有厚度的半透明果冻。",
    designNotes: [
      "悬停挤压量 0.06、按压 0.18，横向缩放为 1 + 挤压量 + 方向差 × 0.035，纵向取倒数保持面积；中心按压稳定在约 1.18 × 0.85",
      "移动弹簧 stiffness 180、damping 10、mass 0.8；挤压弹簧 240、9、0.8，松开或离开后衰减振荡回到原形",
      "父层 perspective 800px；位移目标 ±10/6px、倾斜 ±5°、平面旋转 ±2°、剪切 ±4°；32px 圆角随方向与挤压变化，最小 14px，外层固定测量避免坐标抖动",
      "底色 #111225、白色 20% 边框；224px 天蓝 30% 与 256px 紫色 35% 色晕均模糊 40px、反向位移 18–24px；叠加白色 18% 内高光与跟随指针的 18% 光泽",
      "支持主指针按压与 Enter / 空格操作，指针取消或失焦即回弹；prefers-reduced-motion 时保持零形变，触屏保留原生滚动",
    ],
    deps: ["motion"],
    file: "cards/wobble-card.tsx",
    tags: ["弹簧", "挤压", "果冻", "悬停", "回弹"],
    usage: `import { WobbleCard } from "@/components/ui/wobble-card";

export function Showcase() {
  return (
    <WobbleCard className="w-80 max-w-full">
      <h3 className="text-2xl font-semibold">软软的容器</h3>
      <p className="mt-2 text-sm text-zinc-300">移动揉一揉，按住再松手。</p>
    </WobbleCard>
  );
}`,
    preview: (
      <WobbleCard className="w-64 p-6 @md:w-96 @md:p-8">
        <Waves aria-hidden className="mb-5 size-6 text-sky-200 @md:mb-8 @md:size-8" />
        <h4 className="text-xl font-semibold tracking-tight text-white @md:text-2xl">
          软软的容器
        </h4>
        <p className="mt-2 text-xs text-zinc-300 @md:text-sm">移动揉一揉，按住再松手。</p>
      </WobbleCard>
    ),
  },
  {
    slug: "fluid-distortion-card",
    title: "流体扭曲卡片",
    name: "Fluid Distortion Card",
    category: "cards",
    description: "指针掠过卡面时，局部彩色色场像透过液体玻璃一样产生折射与流动形变。",
    designNotes: [
      "卡体使用 rounded-3xl、1px 白色 12% 边框与 #09090b 底色，演示高度 240px、内容内边距 28px",
      "背景由 190px 青色 #22d3ee（42% 透明度、42px 模糊）与 220px 紫色 #a855f7（40% 透明度、52px 模糊）两团色场构成，叠加 14px 间距的白色 12% 斜向流线",
      "SVG 滤镜组合 fractalNoise（baseFrequency 0.012 0.025、2 倍频、seed 7）与 feDisplacementMap（scale 32、R/B 通道）",
      "扭曲副本只在指针周围 110px 径向遮罩内显示，中心至 42% 保持完整，边缘渐隐；坐标通过 CSS 变量更新而不触发 React 重渲染",
      "进入时 180ms 淡入、离开时 260ms 淡出；prefers-reduced-motion 下停止 8–10s 色场漂移并显示 26% 静态低强度纹理",
    ],
    deps: [],
    file: "cards/fluid-distortion-card.tsx",
    tags: ["流体", "SVG 滤镜", "鼠标跟随", "交互卡片"],
    usage: `import { Waves } from "lucide-react";
import { FluidDistortionCard } from "@/components/ui/fluid-distortion-card";

export function Feature() {
  return (
    <FluidDistortionCard className="h-60 w-full max-w-sm">
      <div className="flex h-full flex-col justify-between">
        <Waves className="size-6 text-cyan-200" />
        <div>
          <h3 className="text-2xl font-semibold text-white">流动界面</h3>
          <p className="mt-2 text-sm text-zinc-300">
            移动指针，让色彩像液体一样发生偏折。
          </p>
        </div>
      </div>
    </FluidDistortionCard>
  );
}`,
    preview: (
      <FluidDistortionCard className="h-52 w-full max-w-xs @md:h-60 @md:max-w-sm">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <Waves className="size-5 text-cyan-100 @md:size-6" />
            <span className="font-mono text-[9px] tracking-[0.24em] text-white/45 @md:text-[10px]">
              INTERACTIVE SURFACE
            </span>
          </div>
          <div>
            <h4 className="text-xl font-semibold tracking-tight text-white @md:text-2xl">
              流动界面
            </h4>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-300 @md:text-sm">
              移动指针，让色彩像液体一样发生偏折。
            </p>
          </div>
        </div>
      </FluidDistortionCard>
    ),
  },
];
