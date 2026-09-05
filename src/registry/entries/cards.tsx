import { Cpu, Orbit } from "lucide-react";
import { SpotlightCard } from "@/registry/components/cards/spotlight-card";
import { TiltCard } from "@/registry/components/cards/tilt-card";
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
];
