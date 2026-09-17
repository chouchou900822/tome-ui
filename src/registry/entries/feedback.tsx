import { Check, MessageSquare, Upload } from "lucide-react";
import { BreathingLine } from "@/registry/components/feedback/breathing-line";
import { ToastStack } from "@/registry/components/feedback/toast-stack";
import type { RegistryEntry } from "@/registry/types";

export const feedbackEntries: RegistryEntry[] = [
  {
    slug: "toast-stack",
    title: "通知叠栈",
    name: "Toast Stack",
    category: "feedback",
    description: "通知像信笺一样轻叠，展开浏览、逐条关闭，把反馈留在恰好的分寸里。",
    designNotes: [
      "卡片小舞台高 104px、内边距 12px，大舞台高 112px、内边距 16px；16px 圆角、#1a1e1f 底板与 1px 白色 15% 边框，图标容器 32px",
      "折叠时最多展示 3 张，每层下移 14px、缩小 5.5%、透明度递减 22%，变换原点在底部中心",
      "展开后行距为 120px，所有消息进入可滚动列表；视窗高 136px，大舞台 176px，避免列表撑出预览区域",
      "状态变化采用 stiffness 360、damping 32 的弹簧，prefers-reduced-motion 时 duration=0；初次挂载静态可见",
      "默认不自动关闭，用户逐条移除并移交焦点；折叠后只有第 1 张参与键盘和读屏，aria-live 礼貌播报增减，onDismiss 接收被关闭的 id",
    ],
    deps: ["motion"],
    file: "feedback/toast-stack.tsx",
    tags: ["通知", "反馈", "消息", "叠栈", "Toast"],
    usage: `import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";

const notifications: ToastItem[] = [
  { id: "saved", title: "修改已保存", description: "你的工作已安全保留。", tone: "success", meta: "刚刚" },
  { id: "comment", title: "收到新评论", description: "打开项目，继续这次讨论。", tone: "info", meta: "2 分钟前" },
];

export function Notifications() {
  return <ToastStack label="最近动态" items={notifications} />;
}`,
    preview: (
      <ToastStack label="工作室收件箱" className="[&>div:first-child]:hidden @md:[&>div:first-child]:flex" items={[
        { id: "saved", title: "所有修改，已妥善保存", description: "专注创作，剩下的交给我们。", meta: "刚刚", tone: "success", icon: <Check className="size-4" /> },
        { id: "comment", title: "一条新的设计反馈", description: "「这版留白的节奏很舒服。」", meta: "2 分钟前", tone: "info", icon: <MessageSquare className="size-3.5" /> },
        { id: "export", title: "导出文件已准备好", description: "品牌手册 · 最终版本。", meta: "5 分钟前", tone: "warning", icon: <Upload className="size-3.5" /> },
      ]} />
    ),
    previewClassName: "px-3 pb-3 pt-11 @md:p-8",
  },
  {
    slug: "breathing-line",
    title: "呼吸线",
    name: "Breathing Line",
    category: "feedback",
    description: "一道辉光沿发丝轨道生长、匀速、收缩消隐，用最少的像素表达页面级等待。",
    designNotes: [
      "轨道默认 240×1px，背景为两端透明、中段白色 16% 的水平渐变；光束高 2px 上移 1px 骑在轨道上，两端透明、中心为 #d7ff3c 的渐变",
      "光束叠两层 drop-shadow(0 0 3.5px) 辉光，中心 3px 圆点带 6px/2px 扩散的 45% 同色光晕",
      "一次扫掠 1.8s linear 无限循环，六段关键帧按轨道宽度百分比定义：left 0→21.67→41.67→61.67→76.67→93.33%，width 11.67→21.67→30→30→23.33→6.67%，即出生、生长、满长、匀速、收缩、消隐",
      "根元素 role=status 并携带 aria-label；prefers-reduced-motion 时光束静止在 35% 处、宽 30%",
      "颜色与时长通过 --bl-color / --bl-duration 自定义属性注入，轨道宽度改变时节奏不变",
    ],
    deps: [],
    file: "feedback/breathing-line.tsx",
    tags: ["加载", "Loading", "进度", "极简", "指示器"],
    usage: `import { BreathingLine } from "@/components/ui/breathing-line";

export function PageLoading() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-6">
      <BreathingLine width={240} duration={1.8} label="正在加载页面" />
      <p className="text-xs tracking-[0.12em] text-white/50">LOADING</p>
    </div>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-6 @md:gap-8">
        <BreathingLine width={240} className="max-w-[70cqw]" />
        <p className="text-[10px] tracking-[0.12em] text-white/40 @md:text-xs">240 × 1 PX TRACK · 1.8S · LINEAR · LOOP</p>
      </div>
    ),
  },
];
