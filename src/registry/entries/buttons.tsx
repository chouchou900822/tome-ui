import { ArrowRight, Fingerprint, Sparkles, Terminal } from "lucide-react";
import { CopyCommand } from "@/registry/components/buttons/copy-command";
import { HoldToConfirm } from "@/registry/components/buttons/hold-to-confirm";
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
  {
    slug: "hold-to-confirm",
    title: "长按确认",
    name: "Hold To Confirm",
    category: "buttons",
    description: "带机械压感的长按按钮，蓄满柔光才确认，松手即取消。",
    designNotes: [
      "按钮高 56px、圆角 16px，#e3e7d9 浅鼠尾草底搭配 #262e22 文字，6px 实体底边与顶部 1px 高光构成立体按键",
      "默认按住 1200ms，#bacda2 填充由左向右从 0 到 100%；按下位移 4px、底边缩到 2px，提前松开立刻清空进度",
      "只接受 1 个主指针、空格与 Enter，屏蔽键盘重复触发；移出按钮、失焦、窗口失焦、页面隐藏及 pointercancel 都取消长按",
      "onConfirm 支持 Promise，等待时禁止再次触发；成功或失败反馈停留 2200ms 后复位，卸载清除帧循环与定时器",
      "prefers-reduced-motion 下停用按压位移和连续填充，仍需完整等待 1200ms，完成后立即显示终态；状态通过 aria-live 播报",
    ],
    deps: [],
    file: "buttons/hold-to-confirm.tsx",
    tags: ["长按", "确认", "防误触", "按钮", "异步"],
    usage: `"use client";

import { useState } from "react";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export function ArchiveAction() {
  const [archived, setArchived] = useState(false);
  return (
    <div className="max-w-xs space-y-4">
      <HoldToConfirm label="长按归档" confirmedLabel="归档完成"
        onConfirm={() => setArchived(true)} />
      <p className="text-sm text-zinc-400">{archived ? "项目已归档" : "项目仍在工作区"}</p>
    </div>
  );
}`,
    preview: (
      <div className="w-full max-w-[280px]">
        <div className="mb-7 flex items-center justify-between border-b border-white/8 pb-3 text-[9px] text-zinc-500"><span>重要的决定，慢半拍</span><span className="font-mono tracking-wider">PRESS / HOLD</span></div>
        <HoldToConfirm label="长按，确认发布" confirmedLabel="准备就绪" icon={<Fingerprint className="size-4" />} />
      </div>
    ),
    previewClassName: "px-5 pb-3 pt-11 @md:p-8",
  },
  {
    slug: "copy-command",
    title: "命令复制",
    name: "Copy Command",
    category: "buttons",
    description: "紧凑的终端命令条，一键复制与明确反馈，为文档留下一处精致细节。",
    designNotes: [
      "#141618 底板、16px 圆角、1px 白色 12% 边框；标题栏与命令区之间为白色 8% 分隔线，顶部叠 1px 白色 3% 内高光",
      "命令字号在小舞台为 11px、大舞台为 14px；横向独立滚动并允许键盘聚焦，复制按钮最小高 36px、圆角 8px",
      "navigator.clipboard.writeText 复制完整命令；成功后切换 #bdd4bc 文字和 10% 同色底，反馈停留 2400ms",
      "同一时刻最多 1 个复制请求；权限拒绝时显示可选中手动复制的说明，状态用 aria-live 播报，卸载后停止更新",
      "仅颜色使用 motion-safe 的 150ms 过渡；不截短实际复制内容，不依赖终端、远程服务或额外图标包",
    ],
    deps: [],
    file: "buttons/copy-command.tsx",
    tags: ["复制", "命令行", "剪贴板", "文档"],
    usage: `import { CopyCommand } from "@/components/ui/copy-command";

export function InstallCommand() {
  return <CopyCommand label="安装依赖" command="pnpm add motion" className="max-w-md" />;
}`,
    preview: (
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center gap-2 text-[10px] text-zinc-500"><Terminal aria-hidden className="size-3.5" /><span>从一行命令开始。</span></div>
        <CopyCommand label="安装 / INSTALL" command="pnpm add motion" />
        <p className="mt-4 text-right font-mono text-[8px] tracking-[0.16em] text-zinc-600">READY TO BUILD SOMETHING GOOD.</p>
      </div>
    ),
    previewClassName: "px-5 pb-3 pt-11 @md:p-8",
  },
];
