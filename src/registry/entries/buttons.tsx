import { ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton } from "@/registry/components/buttons/magnetic-button";
import { ShimmerButton } from "@/registry/components/buttons/shimmer-button";
import type { RegistryEntry } from "@/registry/types";

export const buttonEntries: RegistryEntry[] = [
  {
    slug: "magnetic-button",
    title: "磁吸按钮",
    name: "Magnetic Button",
    category: "buttons",
    description: "鼠标靠近时按钮被吸向指针，文字以更小幅度跟随形成视差，离开后弹簧回弹。",
    designNotes: [
      "外层触发区比按钮四周各大 24px，让吸附在指针真正碰到按钮前就开始",
      "按钮位移 = 指针到按钮中心的偏移 × 0.35，内部文字再乘 0.45 形成两层视差",
      "位移经过弹簧平滑：stiffness 180、damping 16、mass 0.2，回弹带轻微过冲",
      "按下时缩放到 0.96；白底黑字胶囊形，外发光阴影强调可点击性",
      "用 MotionValue 直接驱动 transform，鼠标移动不触发 React 重渲染",
    ],
    deps: ["motion"],
    file: "buttons/magnetic-button.tsx",
    tags: ["CTA", "物理", "弹簧", "悬停"],
    usage: `import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Cta() {
  return (
    <MagneticButton onClick={() => console.log("clicked")}>
      开始使用
      <ArrowRight className="size-4" />
    </MagneticButton>
  );
}`,
    preview: (
      <MagneticButton className="@md:px-9 @md:py-4 @md:text-base">
        开始使用
        <ArrowRight className="size-4" />
      </MagneticButton>
    ),
  },
  {
    slug: "shimmer-button",
    title: "流光按钮",
    name: "Shimmer Button",
    category: "buttons",
    description: "一道锥形光沿按钮边缘持续旋转，形成会呼吸的发光边框。",
    designNotes: [
      "外层是 1px 内边距的胶囊容器，内部放一个放大到四周各 -100% 的锥形渐变，让旋转时不露边",
      "锥形渐变只有两段各约 10% 与 6% 的扇区带颜色（一主一次，相隔半圈），其余透明，旋转一圈 3s 线性匀速",
      "内层用略亮于页面的深灰底板（#161619）盖住中心，只露出 1px 光边；悬停时底部浮现一层同色径向光晕",
      "整体悬停上浮 2px，按下归位，用 300ms ease-out 过渡",
      "纯 CSS 动画实现，关键帧随组件内联，无需修改全局样式；尊重 prefers-reduced-motion",
    ],
    deps: [],
    file: "buttons/shimmer-button.tsx",
    tags: ["CTA", "发光", "边框", "纯 CSS"],
    usage: `import { Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function Cta() {
  return (
    <ShimmerButton shimmerColor="#d7ff3c">
      <Sparkles className="size-4" />
      生成组件
    </ShimmerButton>
  );
}`,
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ShimmerButton className="@md:text-base">
          <Sparkles className="size-4" />
          生成组件
        </ShimmerButton>
        <ShimmerButton shimmerColor="#7c3aed" speed={2} className="@md:text-base">
          紫色变体
        </ShimmerButton>
      </div>
    ),
  },
];
