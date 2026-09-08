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
      "MotionValue 直接驱动位移，不触发重渲染；禁用或 prefers-reduced-motion 时按钮与文字位移均为 0，停用按压缩放；键盘聚焦显示 2px 白 60% 焦点环、偏移 4px",
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
      "外层是 1px 内边距、白 10% 静态底边的胶囊容器；150% 宽的正方形光层居中旋转，独立 translate 与 rotate 避免位移叠加",
      "锥形渐变从 55% 处透明开始，在 75% 处为主色 20%、88% 处达到主色、90% 处消失，默认每 3s 匀速绕行一圈",
      "内层底色 #161619、顶部 1px 白 8% 高光、底部 1px 黑 40% 内阴影；悬停或键盘聚焦时浮现主色 12% 的底部光晕，500ms 淡入",
      "整体悬停上浮 2px，按下归位，用 300ms ease-out 过渡",
      "纯 CSS 动画；禁用时暂停旋转，prefers-reduced-motion 时停止旋转与上浮；字体从外层继承，支持容器查询调整字号",
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
        <ShimmerButton shimmerColor="#c9dbc5" speed={4} className="@md:text-base">
          <Sparkles className="size-4" />
          生成组件
        </ShimmerButton>
        <ShimmerButton shimmerColor="#aaa7d8" speed={5} className="@md:text-base">
          暮紫变体
        </ShimmerButton>
      </div>
    ),
  },
];
