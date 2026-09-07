import { Cpu, Gem, Orbit, Wand2, Waves, Zap } from "lucide-react";
import { ElectricBorder } from "@/registry/components/cards/electric-border";
import { FluidDistortionCard } from "@/registry/components/cards/fluid-distortion-card";
import { GlareCard } from "@/registry/components/cards/glare-card";
import { GlassSurface } from "@/registry/components/cards/glass-surface";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";
import { TiltCard } from "@/registry/components/cards/tilt-card";
import { WobbleCard } from "@/registry/components/cards/wobble-card";
import type { RegistryEntry } from "@/registry/types";

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
      "内容层 relative 置于光层之上",
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
      "父层 perspective 1000px；指针在卡片内的归一化坐标映射到 ±12° 的 rotateX/rotateY",
      "旋转值经过弹簧（stiffness 200、damping 20、mass 0.4）平滑，离开后缓慢回正到 0",
      "悬停整体缩放 1.03；内容层 translateZ(30px) 与 preserve-3d 制造浮起层次",
      "镜面高光是随指针百分比移动的径向渐变，白色 35% 透明度，mix-blend-mode: overlay",
      "深色底 + 大范围柔和投影（0 30px 80px -30px 黑 90%）",
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
      <TiltCard className="w-72 @md:w-80">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Vol.01</p>
          <Orbit className="size-4 text-zinc-500" />
        </div>
        <h4 className="mt-8 text-2xl font-semibold tracking-tight text-white">组件词典</h4>
        <p className="mt-2 text-sm text-zinc-400">移动鼠标，感受景深。</p>
      </TiltCard>
    ),
  },
  {
    slug: "electric-border",
    title: "电流边框卡片",
    name: "Electric Border",
    category: "cards",
    description: "边框与辉光被湍流滤镜反复扭曲，像一圈不稳定的电弧箍住卡片。",
    designNotes: [
      "卡片分为两层：底层深色板（含 1px 青色 60% 边框与内外辉光）套 SVG 位移滤镜，上层内容不被扭曲",
      "滤镜为 feTurbulence（fractalNoise、baseFrequency 0.018、3 倍频）+ feDisplacementMap（scale 14）",
      "湍流 seed 用 SMIL 每 1.6s 在 6 个值之间离散跳变，形成电弧抖动；内容层正常排版",
      "辉光：外阴影 0 0 14px 青色 33%、内阴影 0 0 10px 青色 13%；滤镜同时扭曲阴影更添电流感",
      "prefers-reduced-motion 时不渲染 SMIL 动画，边框静止但保留发光；滤镜 id 由 useId 保证多实例独立",
    ],
    deps: [],
    file: "cards/electric-border.tsx",
    tags: ["电弧", "滤镜", "科幻", "辉光"],
    usage: `import { Zap } from "lucide-react";
import { ElectricBorder } from "@/components/ui/electric-border";

export function Warning() {
  return (
    <ElectricBorder className="w-full max-w-sm">
      <Zap className="size-6 text-cyan-300" />
      <h3 className="mt-4 text-lg font-semibold">高能预警</h3>
      <p className="mt-2 text-sm text-zinc-400">这圈边框正通着电，别碰。</p>
    </ElectricBorder>
  );
}`,
    preview: (
      <ElectricBorder className="w-full max-w-xs @md:max-w-sm">
        <Zap className="size-6 text-cyan-300" />
        <h4 className="mt-4 text-lg font-semibold tracking-tight text-white">高能预警</h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          这圈边框正通着电，别碰。
        </p>
      </ElectricBorder>
    ),
  },
  {
    slug: "glass-surface",
    title: "玻璃面板",
    name: "Glass Surface",
    category: "cards",
    description: "毛玻璃底叠顶部光泽、边缘内高光与细噪点，四层质感叠出的厚度感。",
    designNotes: [
      "基底：白色 4% 填充 + backdrop-blur(40px) + 1px 白色 10% 边框，rounded-2xl",
      "光泽层：左上 120%×90% 的径向渐变（白 8%，50% 处透明）叠一道自上而下的线性渐变（白 5%，40% 处消失）",
      "边缘层：inset 阴影写出顶边 1px 白 12% 高光与整体 24px 白 3% 内泛光",
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
      <GlassSurface className="w-full max-w-xs p-6 @md:max-w-sm @md:p-8">
        <Gem className="size-6 text-sky-300" />
        <h4 className="mt-4 text-lg font-semibold tracking-tight text-white">磨砂与光泽</h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          放在任何彩色背景上，玻璃质感都会透出来。
        </p>
      </GlassSurface>
    ),
  },
  {
    slug: "glare-card",
    title: "炫光卡片",
    name: "Glare Card",
    category: "cards",
    description: "一道斜向光带跟随鼠标横扫卡面，顶部边缘同时亮起一条高光线。",
    designNotes: [
      "光带是 107° 线性渐变：32% 处透明、48% 处白 14%、64% 处透明，背景尺寸 220%×220%",
      "background-position 由鼠标写入 CSS 变量 --gx/--gy（直接 setProperty，不触发重渲染）",
      "光带与顶边高光线默认透明，悬停 300ms 淡入；边框同时从白 10% 提到 25%",
      "顶部高光线是 inset-x-4 的 1px 横向渐变（两端透明、中间白 40%）",
      "与聚光灯卡片的径向光斑互补：这里的光是线性、有方向感的",
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
        <Wand2 className="size-6 text-sky-300" />
        <h4 className="mt-4 text-lg font-semibold tracking-tight text-white">流光掠过</h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">移动鼠标，光带会跟着走。</p>
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
