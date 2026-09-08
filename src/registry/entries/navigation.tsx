import { ChapterScrubber, type Chapter } from "@/registry/components/navigation/chapter-scrubber";
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
];
