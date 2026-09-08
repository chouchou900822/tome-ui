import { Check, MessageSquare, Upload } from "lucide-react";
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
];
