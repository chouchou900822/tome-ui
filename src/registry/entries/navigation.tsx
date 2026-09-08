import { ChartNoAxesCombined, Clock3, Folder, SlidersHorizontal } from "lucide-react";
import { ChapterScrubber, type Chapter } from "@/registry/components/navigation/chapter-scrubber";
import { ProgressSteps } from "@/registry/components/navigation/progress-steps";
import { SlidingTabs } from "@/registry/components/navigation/sliding-tabs";
import type { RegistryEntry } from "@/registry/types";

/** 演示数据：一期设计播客的章节表 */
const PODCAST_CHAPTERS: Chapter[] = [
  { id: "intro", title: "开场与本期主题", meta: "00:00", description: "从一张海报聊到整套排版系统，为什么值得聊一整期。" },
  { id: "font", title: "字体决定气质", meta: "01:42", description: "同一版式换三种字体，气质完全不同。" },
  { id: "grid", title: "排版网格的秘密", meta: "04:12", description: "12 栏网格如何让信息自然对齐。" },
  { id: "space", title: "留白是设计的一部分", meta: "08:05", description: "空白不是浪费，是呼吸的节奏。" },
  { id: "dark", title: "深色模式的设计陷阱", meta: "11:30", description: "纯黑背景上最容易翻车的三个细节。" },
  { id: "leading", title: "字距与行高的平衡", meta: "15:10", description: "中文正文为什么需要更大的行距。" },
  { id: "cjk", title: "中文排版的特殊性", meta: "18:45", description: "标点悬挂、避头尾与中西文混排间距。" },
  { id: "case", title: "案例拆解：新闻首页", meta: "22:20", description: "信息密度最高的页面如何保持可读。" },
  { id: "rhythm", title: "动效里的文字节奏", meta: "26:00", description: "文字入场动画的时长与错峰。" },
  { id: "tools", title: "工具箱与字体授权", meta: "29:35", description: "可商用中文字体的选择清单。" },
  { id: "qa", title: "听众问答", meta: "33:10", description: "关于屏幕适配与印刷排版的两问。" },
  { id: "outro", title: "收尾与下期预告", meta: "37:40", description: "下期：色彩系统的从零到一。" },
];

export const navigationEntries: RegistryEntry[] = [
  {
    slug: "chapter-scrubber",
    title: "章节擦洗器",
    name: "Chapter Scrubber",
    category: "navigation",
    description: "垂直刻度轨道，悬停时指针周围泛起升余弦放大波，预览卡跟随光标逐章扫过。",
    designNotes: [
      "全部刻度由两个共享弹簧驱动，避免逐行状态：指针弹簧 stiffness 700 / damping 52 / mass 0.5，近临界阻尼、几乎零延迟跟随光标且从不过冲；强度弹簧 stiffness 260 / damping 30 / mass 0.6 更软，波形起落带呼吸感",
      "每根刻度的抬升量 = 强度 × 升余弦 bump(与指针的行距 / 半径)，波峰为 1、半径外为 0、两端斜率为零，衰减无接缝；默认半径 4 行，刻度由静息 14px 伸长至峰值 56px，透明度从 0.22（当前章节 0.55）升至 1，厚度 scaleY 1 → 1.4",
      "预览卡最大宽 260px，窄容器取 100cqw - 104px、距轨道 20px；top 钳制在轨道上下界，靠近视口边缘时翻向更宽敞侧；出现时 scale 0.97→1、横向移动 6px",
      "可访问性：role=listbox + roving tabindex（同一时刻仅一章可 Tab），上下 / 左右方向键逐章移动，Home / End 跳首尾，Enter / Space 选中，aria-activedescendant 跟随活动项",
      "prefers-reduced-motion 时去掉弹簧的时间缓动、保留空间波形，抬升即时呈现；当前章节刻度以强调色常亮",
    ],
    deps: ["motion"],
    file: "navigation/chapter-scrubber.tsx",
    usage: `import { ChapterScrubber, type Chapter } from "@/components/ui/chapter-scrubber";

const chapters: Chapter[] = [
  { id: "intro", title: "开场", meta: "00:00", description: "主题与嘉宾介绍。" },
  { id: "grid", title: "排版网格的秘密", meta: "04:12", description: "12 栏网格如何让信息自然对齐。" },
  { id: "qa", title: "听众问答", meta: "33:10", description: "关于屏幕适配与印刷排版的两问。" },
];

export function PlayerChapters() {
  return (
    <ChapterScrubber
      chapters={chapters}
      currentIndex={1}
      onSelect={(chapter) => console.log("跳转章节", chapter.id)}
    />
  );
}`,
    tags: ["导航", "章节", "悬停", "弹簧", "可访问性"],
    preview: (
      <div className="flex h-full w-full items-center gap-4 pl-4 pr-6 @xl:gap-8 @xl:pl-10">
        <ChapterScrubber chapters={PODCAST_CHAPTERS} currentIndex={3} />
        <div className="min-w-0 flex-1 border-l border-white/8 pl-5">
          <p className="font-mono text-[8px] tracking-[0.2em] text-zinc-500 @md:text-[10px]">DESIGN NOTES / 012</p>
          <h4 className="mt-4 text-xl font-medium tracking-tight text-zinc-200 @md:text-3xl">留白之间</h4>
          <p className="mt-2 text-[10px] text-zinc-500 @md:text-xs">关于字体、秩序与阅读的节奏</p>
          <p className="mt-6 text-[9px] text-zinc-400 @md:text-[11px]">划过左侧刻度，预览章节</p>
        </div>
      </div>
    ),
    previewClassName: "px-0",
  },
  {
    slug: "sliding-tabs",
    title: "滑动页签",
    name: "Sliding Tabs",
    category: "navigation",
    description: "浅色浮片在深色轨道中滑行，清楚标记当前位置，也保留面板中的输入状态。",
    designNotes: [
      "轨道为 #101314、12px 圆角、6px 内边距与 1px 白色 10% 边框；每个标签最小高 40px，标签间距 4px",
      "选中浮片使用 #dbe4d1 底色、#233020 文字、8px 圆角与 1px 顶部白色内高光，Motion 共享 layoutId 在选项之间移动",
      "弹簧 stiffness 420、damping 34；useId 为每个实例创建独立标记，初次挂载不播入场动画，减少动画时 duration=0",
      "每组只有 1 个 Tab 入口，左右方向键循环跳过禁用项，Home / End 到首尾；tab 与 tabpanel 通过独立 id 关联",
      "面板距轨道小舞台 12px、大舞台 16px，通过 hidden 切换而非卸载，表单内容保留；支持 value / defaultValue，面板焦点环为 2px",
    ],
    deps: ["motion"],
    file: "navigation/sliding-tabs.tsx",
    tags: ["页签", "导航", "弹簧", "面板", "键盘"],
    usage: `import { SlidingTabs, type SlidingTab } from "@/components/ui/sliding-tabs";

const tabs: SlidingTab[] = [
  { id: "overview", label: "概览", content: <p className="p-4 text-sm text-zinc-300">项目概览</p> },
  { id: "activity", label: "动态", content: <p className="p-4 text-sm text-zinc-300">最近的项目动态</p> },
  { id: "settings", label: "设置", content: <label className="block p-4 text-sm text-zinc-300"><input type="checkbox" defaultChecked /> 自动保存</label> },
];

export function ProjectTabs() {
  return <SlidingTabs label="项目视图" tabs={tabs} className="max-w-md" />;
}`,
    preview: (
      <SlidingTabs label="工作室视图" className="max-w-sm" tabs={[
        { id: "overview", label: "概览", icon: <ChartNoAxesCombined className="size-3.5" />, content: (
          <div className="rounded-xl border border-white/8 bg-[#151a18] p-3 @md:p-5">
            <div className="flex items-center justify-between text-[9px]"><span className="text-zinc-400">本周访问</span><span className="text-[#bed3ad]">+18.6%</span></div>
            <p className="mt-2 font-mono text-2xl tracking-tight text-zinc-100 @md:mt-3 @md:text-3xl">24,680</p>
            <div aria-hidden className="mt-2 flex h-4 items-end gap-1.5 @md:mt-3 @md:h-6">{[35, 55, 42, 65, 58, 80, 72, 95, 82, 100, 86, 98].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-[#c3d8b1]/40 last:bg-[#c3d8b1]" style={{ height: `${height}%` }} />)}</div>
          </div>
        ) },
        { id: "activity", label: "动态", icon: <Clock3 className="size-3.5" />, content: (
          <div className="rounded-xl border border-white/8 bg-[#151a18] p-3 @md:p-5">
            <p className="text-[9px] text-zinc-400">今天，一切都在发生</p>
            <div className="mt-2 flex items-center justify-between border-b border-white/8 pb-2 text-xs text-zinc-200 @md:mt-3 @md:pb-3"><span>品牌手册已更新</span><span className="font-mono text-[9px] text-zinc-500">14:32</span></div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-200 @md:mt-3"><span>新成员加入工作室</span><span className="font-mono text-[9px] text-zinc-500">10:18</span></div>
          </div>
        ) },
        { id: "settings", label: "设置", icon: <SlidersHorizontal className="size-3.5" />, content: (
          <div className="rounded-xl border border-white/8 bg-[#151a18] p-3 @md:p-5">
            <p className="text-xs text-zinc-200">让灵感被妥善保留</p>
            <p className="mt-2 text-[10px] text-zinc-400">切换页签后，选择依然保留。</p>
            <label className="mt-4 flex items-center gap-2 text-[10px] text-zinc-300"><input type="checkbox" defaultChecked className="size-3.5 accent-[#c3d8b1]" />自动保存工作进度</label>
          </div>
        ) },
      ]} />
    ),
    previewClassName: "px-4 pb-3 pt-11 @md:p-8",
  },
  {
    slug: "progress-steps",
    title: "步骤导航",
    name: "Progress Steps",
    category: "navigation",
    description: "珠点与细线串联任务进度，把复杂流程拆成清晰、可返回的小步。",
    designNotes: [
      "底板为 #141719、16px 圆角、1px 白色 10% 边框；步骤节点小舞台 24px、大舞台 32px，节点外侧留 5px 同色隔离环",
      "当前节点为 #dce8cd，完成路径为 #c2d5b9；1px 连接线从左向右延伸，350ms 到位，减少动画时 duration=0",
      "当前及之前的步骤可点击，未来步骤只通过下一步推进；第 1 步禁用返回，最后一步显示 finalAction 插槽或完成提示",
      "内容通过 hidden 切换，保留每一步的表单状态；value / defaultValue 支持 2 种模式，aria-current=step 与实时播报明确当前步骤",
      "小舞台内容横向内边距 12px、纵向 8px，大舞台 24px；底部按钮最小高 28px、大舞台 36px，前进或返回后焦点移到新标题",
    ],
    deps: ["motion"],
    file: "navigation/progress-steps.tsx",
    tags: ["步骤", "流程", "引导", "导航", "进度"],
    usage: `import { ProgressSteps, type ProgressStep } from "@/components/ui/progress-steps";

const steps: ProgressStep[] = [
  { id: "space", title: "工作空间", content: <label className="text-sm text-zinc-300">名称<input defaultValue="我的工作室" className="ml-3 rounded border border-white/20 bg-white/5 p-2" /></label> },
  { id: "style", title: "视觉语言", content: <p className="text-sm text-zinc-400">选择适合你的风格。</p> },
  { id: "ready", title: "准备就绪", content: <p className="text-sm text-zinc-400">一切就绪，可以开始创作。</p> },
];

export function SetupFlow() {
  return <ProgressSteps label="创建工作空间" steps={steps} className="max-w-md" />;
}`,
    preview: (
      <ProgressSteps label="创建工作空间" className="max-w-sm" steps={[
        { id: "space", title: "工作空间", content: <div className="flex items-center gap-2 text-[10px] text-zinc-400"><Folder aria-hidden className="size-3.5 text-[#c2d5b9]" /><span>Studio / 我们的下一次创作</span></div> },
        { id: "style", title: "视觉语言", content: <div className="flex items-center gap-2 text-[10px] text-zinc-400"><span aria-hidden className="size-3 rounded-full border border-white/20 bg-[#1c2420]" /><span aria-hidden className="size-3 rounded-full bg-[#c2d5b9]" /><span>石墨与鼠尾草</span></div> },
        { id: "ready", title: "准备就绪", content: <p className="text-[10px] text-[#c2d5b9]">空间已准备好，下一步交给灵感。</p> },
      ]} />
    ),
    previewClassName: "px-3 pb-3 pt-11 @md:p-8",
  },
];
