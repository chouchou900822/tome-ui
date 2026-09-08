import { Layers3, PenTool } from "lucide-react";
import { ChoiceCards } from "@/registry/components/inputs/choice-cards";
import { ComparisonSlider } from "@/registry/components/inputs/comparison-slider";
import type { RegistryEntry } from "@/registry/types";

export const selectionEntries: RegistryEntry[] = [
  {
    slug: "choice-cards",
    title: "方案选择卡",
    name: "Choice Cards",
    category: "inputs",
    description: "把单选项变成有层次的方案卡，选中时边缘与底色一起回应。",
    designNotes: [
      "卡片圆角 12px、垂直间距 8px，#141618 底色搭配 1px 白色 10% 边框；小舞台横向内边距 14px、纵向 12px",
      "选中时底色变为 #1c2420、边框为 #c4d4bd 的 45%；16px 单选圆点反转为浅色底与 6px 深色内点",
      "图标容器 32px，标签字号 8px，标题从 12px 过渡到 14px，价格采用等宽数字；元数据与圆点保持不收缩",
      "每组以独立 name 的原生 radio 保持 1 个选中项；方向键切换、表单提交和 disabled 保留浏览器行为，同屏多实例互不串组",
      "选中颜色在 200ms 内切换，禁用单项透明度 40%、禁用整组 50%；prefers-reduced-motion 下立即切换，焦点环为 2px",
    ],
    deps: [],
    file: "inputs/choice-cards.tsx",
    tags: ["单选", "定价", "方案", "表单", "设置"],
    usage: `import { ChoiceCards, type ChoiceOption } from "@/components/ui/choice-cards";

const plans: ChoiceOption[] = [
  { value: "solo", label: "独立创作", description: "适合个人项目", meta: "¥0" },
  { value: "studio", label: "工作室", description: "适合团队协作", meta: "¥49", badge: "推荐" },
];

export function PlanPicker() {
  return <ChoiceCards label="选择方案" name="plan" options={plans}
    defaultValue="studio" className="max-w-md" />;
}`,
    preview: (
      <ChoiceCards label="选择你的创作空间" defaultValue="studio" className="max-w-sm" options={[
        { value: "solo", label: "独立创作", description: "留给专注的空间", meta: "¥0", icon: <PenTool className="size-3.5" /> },
        { value: "studio", label: "工作室", description: "协作，让想法发生", meta: "¥49", badge: "推荐", icon: <Layers3 className="size-3.5" /> },
      ]} />
    ),
    previewClassName: "px-4 pb-3 pt-11 @md:p-8",
  },
  {
    slug: "comparison-slider",
    title: "前后对比",
    name: "Comparison Slider",
    category: "inputs",
    description: "拖动一条光洁的分界线，在同一画布上比较原稿与成品。",
    designNotes: [
      "两个内容插槽始终按 100% 舞台尺寸重叠，前层用 clip-path 裁切，避免拖动时图片或排版被压缩",
      "默认分割比例 50%，范围 0–100%；分界线为 1px 白色 85%，手柄为 32×44px 的磨砂浅色胶囊，含 2 根竖向抓握线",
      "鼠标与触屏只跟踪 1 个主指针并使用 pointer capture，touch-action: pan-y 保留页面纵向滚动；取消或丢失捕获时结束拖动",
      "方向键每次移动 1%，按住 Shift 移动 10%，Home / End 展示单侧；role=slider 同时播报两侧标签和比例",
      "默认圆角 16px、4:3 比例、1px 白色 15% 边框；内容通过 inert 避免被裁切的控件误聚焦，比例变化即时生效且无自动动画",
    ],
    deps: [],
    file: "inputs/comparison-slider.tsx",
    tags: ["对比", "图片", "拖动", "作品集", "修图"],
    usage: `import { ComparisonSlider } from "@/components/ui/comparison-slider";

export function DesignComparison() {
  return (
    <ComparisonSlider className="max-w-xl" beforeLabel="原稿" afterLabel="成品"
      before={<div className="grid h-full place-items-center bg-zinc-800 text-3xl text-zinc-400">FORM</div>}
      after={<div className="grid h-full place-items-center bg-[#283b32] text-3xl tracking-[0.3em] text-[#d3e5bb]">FORM</div>} />
  );
}`,
    preview: (
      <ComparisonSlider className="h-full max-h-[360px] max-w-xl aspect-auto" beforeLabel="原始光线" afterLabel="暮色调色" label="暮光档案调色对比"
        before={
          <div className="relative h-full overflow-hidden bg-[radial-gradient(ellipse_at_60%_10%,#51565c,#22272d_70%)]">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 border-t border-white/10 bg-[linear-gradient(170deg,#3b424a,#1c2228)]" />
            <div aria-hidden className="absolute left-1/2 top-[18%] aspect-square w-[46%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_33%_24%,#b6bdc3_0%,#697781_35%,#25303a_68%,#10151b_88%)] shadow-[16px_30px_22px_-14px_#0009]" />
            <div className="absolute bottom-5 left-5"><p className="font-mono text-[8px] tracking-[0.24em] text-white/40">STILL LIFE / 008</p><p className="mt-2 text-xl font-light tracking-[0.12em] text-white/80 @md:text-3xl">暮光档案</p></div>
          </div>
        }
        after={
          <div className="relative h-full overflow-hidden bg-[radial-gradient(ellipse_at_60%_10%,#a77e62,#493b36_50%,#28262b_90%)]">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 border-t border-[#f5d5ad]/15 bg-[linear-gradient(170deg,#665049,#28252b)]" />
            <div aria-hidden className="absolute left-1/2 top-[18%] aspect-square w-[46%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_33%_24%,#f6e3b5_0%,#c39c68_32%,#795d48_54%,#29272d_83%)] shadow-[16px_30px_22px_-14px_#120b0aaa]" />
            <div className="absolute bottom-5 left-5"><p className="font-mono text-[8px] tracking-[0.24em] text-[#f3d4ab]/60">STILL LIFE / 008</p><p className="mt-2 text-xl font-light tracking-[0.12em] text-[#f8e7cc] @md:text-3xl">暮光档案</p></div>
          </div>
        }
      />
    ),
    previewClassName: "px-3 pb-3 pt-11 @md:p-8",
  },
];
