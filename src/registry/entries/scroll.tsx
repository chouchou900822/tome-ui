import { FullscreenExpandTransition } from "@/registry/components/scroll/fullscreen-expand-transition";
import { ScrollMascot } from "@/registry/components/scroll/scroll-mascot";
import { ScrollRingCarousel } from "@/registry/components/scroll/scroll-ring-carousel";
import { ScrollScene } from "@/registry/components/scroll/scroll-scene";
import { ScrollSnapGallery } from "@/registry/components/scroll/scroll-snap-gallery";
import { StackedScrollCards } from "@/registry/components/scroll/stacked-scroll-cards";
import type { RegistryEntry } from "@/registry/types";

export const scrollEntries: RegistryEntry[] = [
  {
    slug: "scroll-scene",
    title: "滚动场景切换",
    name: "Scroll Scene",
    category: "scroll",
    description: "滚过一个视口便切换一幕，以交叉淡化、色彩和章节进度组织连续叙事。",
    designNotes: [
      "组件内部建立 100% 高度的纵向滚动容器，每个场景占 1 个完整视口并设置 snap-start + snap-always",
      "滚动位置按 scrollTop / clientHeight 四舍五入为当前场景索引，索引始终限制在 0 至 items.length - 1",
      "相邻场景用 700ms opacity 交叉淡化，缓动为 cubic-bezier(0.22, 1, 0.36, 1)，减少动态偏好时取消过渡",
      "场景背景由右上 42% 半径彩色径向光晕叠加 #18181b→#09090b 线性渐变，右侧用 24px 激活进度条标明章节",
    ],
    deps: [],
    file: "scroll/scroll-scene.tsx",
    usage: `import { ScrollScene } from "@/components/ui/scroll-scene";

const scenes = [
  { eyebrow: "Chapter 01", title: "抵达", description: "从一束微光进入故事。", color: "#1d4ed8" },
  { eyebrow: "Chapter 02", title: "穿越", description: "滚动一次，切换一幕。", color: "#7c3aed" },
  { eyebrow: "Chapter 03", title: "远方", description: "让结尾停在新的地平线。", color: "#0f766e" },
];

export function Story() {
  return <ScrollScene items={scenes} className="h-screen" />;
}`,
    tags: ["滚动叙事", "场景", "吸附", "交叉淡化"],
    preview: (
      <ScrollScene
        items={[
          { eyebrow: "Chapter 01", title: "抵达", description: "从一束冷光进入故事。", color: "#1d4ed8" },
          { eyebrow: "Chapter 02", title: "穿越", description: "滚动一次，空间随之换幕。", color: "#7c3aed" },
          { eyebrow: "Chapter 03", title: "远方", description: "在新的地平线结束旅程。", color: "#0f766e" },
        ]}
      />
    ),
    previewClassName: "p-0",
  },
  {
    slug: "scroll-ring-carousel",
    title: "滚动 3D 环形轮播",
    name: "Scroll Ring Carousel",
    category: "scroll",
    description: "纵向滚动驱动一组卡片沿 Y 轴成环旋转，把浏览进度变成立体轨道。",
    designNotes: [
      "舞台 perspective 为 760px，所有卡片等分 360° 并以 rotateY(index × 360 / 数量) translateZ(150px) 排成环",
      "完整滚动距离为 max(220%, items.length × 70%)，映射到从第 1 张至最后 1 张的连续旋转角度",
      "舞台建立尺寸容器，卡宽 clamp(96px,40cqh,176px)、卡高 clamp(112px,48cqh,208px)，圆角 16px、白 15% 边框、背面隐藏；底部预留 48/64px，避免卡片与标题提示重叠",
      "prefers-reduced-motion 时连续旋转改为按最近索引离散跳转，仍保留键盘聚焦与滚动选择能力",
    ],
    deps: [],
    file: "scroll/scroll-ring-carousel.tsx",
    usage: `import { ScrollRingCarousel } from "@/components/ui/scroll-ring-carousel";

const projects = [
  { label: "Identity", title: "North / 01", color: "#172554" },
  { label: "Digital", title: "Pulse / 02", color: "#4c1d95" },
  { label: "Space", title: "Field / 03", color: "#134e4a" },
  { label: "Motion", title: "Orbit / 04", color: "#7c2d12" },
];

export function Portfolio() {
  return <ScrollRingCarousel items={projects} radius={150} className="h-screen" />;
}`,
    tags: ["3D", "环形轮播", "滚动驱动", "作品集"],
    preview: (
      <ScrollRingCarousel
        items={[
          { label: "Identity", title: "North / 01", color: "#172554" },
          { label: "Digital", title: "Pulse / 02", color: "#4c1d95" },
          { label: "Space", title: "Field / 03", color: "#134e4a" },
          { label: "Motion", title: "Orbit / 04", color: "#7c2d12" },
          { label: "Object", title: "Form / 05", color: "#3f3f46" },
        ]}
        radius={140}
      />
    ),
    previewClassName: "p-0",
  },
  {
    slug: "scroll-snap-gallery",
    title: "滚动吸附",
    name: "Scroll Snap Gallery",
    category: "scroll",
    description: "横向浏览时每张内容卡自动停在舞台中央，保留手势惯性又避免半屏悬停。",
    designNotes: [
      "横向容器使用 snap-x snap-mandatory 与 overscroll-x-contain，每张卡使用 snap-center + snap-always 强制完整停靠",
      "卡片宽度在小舞台为 72cqw、大舞台为 68cqw，高度占满容器；首尾留白分别按剩余宽度 28% / 32% 的一半计算",
      "卡片间距由 12px 过渡到 20px，垂直内边距由 16px 过渡到 24px，首尾卡都能精确吸附到容器中线",
      "组件不依赖 JavaScript；滚动区可通过 Tab 聚焦并使用 Shift+滚轮或触控板横向浏览，滚动条视觉隐藏",
    ],
    deps: [],
    file: "scroll/scroll-snap-gallery.tsx",
    usage: `import { ScrollSnapGallery } from "@/components/ui/scroll-snap-gallery";

const slides = [
  { eyebrow: "01 / Observe", title: "看见节奏", description: "每一屏只讲一件事。", color: "#172554" },
  { eyebrow: "02 / Focus", title: "自动停靠", description: "释放手势后回到视觉中心。", color: "#4c1d95" },
  { eyebrow: "03 / Continue", title: "继续探索", description: "下一张始终露出线索。", color: "#134e4a" },
];

export function Gallery() {
  return <ScrollSnapGallery items={slides} className="h-[70vh]" />;
}`,
    tags: ["CSS Snap", "横向滚动", "画廊", "触控"],
    preview: (
      <ScrollSnapGallery
        items={[
          { eyebrow: "01 / Observe", title: "看见节奏", description: "每一屏，只讲一件事。", color: "#172554" },
          { eyebrow: "02 / Focus", title: "自动停靠", description: "释放手势，内容回到中心。", color: "#4c1d95" },
          { eyebrow: "03 / Continue", title: "继续探索", description: "下一张始终留下一点线索。", color: "#134e4a" },
        ]}
      />
    ),
    previewClassName: "p-0",
  },
  {
    slug: "stacked-scroll-cards",
    title: "滚动叠层转场",
    name: "Stacked Scroll Cards",
    category: "scroll",
    description: "卡片随滚动依次吸附到同一位置，后一层覆盖前一层形成连续的纵深转场。",
    designNotes: [
      "每张卡使用 position:sticky；首层 top 在小/大舞台为 16px/28px，后续层分别递增 12px/14px，并以更高 z-index 覆盖前层",
      "单卡高度为容器 76%，小/大舞台最小高度 160px/208px；卡片间垂直距离由 80px 过渡到 112px，窄屏不再被 256px 最小舞台高度裁切",
      "卡片圆角 16px、1px 白色 10% 边框，并添加 0 -18px 50px 黑色 35% 顶部阴影强调叠层边界",
      "末尾留出容器宽度 52% 的滚动缓冲区，让最后一张完整吸附后仍有停留距离；全程无需 JavaScript",
    ],
    deps: [],
    file: "scroll/stacked-scroll-cards.tsx",
    usage: `import { StackedScrollCards } from "@/components/ui/stacked-scroll-cards";

const chapters = [
  { number: "01", title: "发现", description: "先看见真正的问题。", color: "#172554" },
  { number: "02", title: "塑形", description: "让想法获得清晰边界。", color: "#4c1d95" },
  { number: "03", title: "抵达", description: "用最后一层完成叙事。", color: "#134e4a" },
];

export function Process() {
  return <StackedScrollCards items={chapters} className="h-screen" />;
}`,
    tags: ["Sticky", "叠层", "转场", "滚动叙事"],
    preview: (
      <StackedScrollCards
        items={[
          { number: "01", title: "发现", description: "先看见真正的问题。", color: "#172554" },
          { number: "02", title: "塑形", description: "让想法获得清晰边界。", color: "#4c1d95" },
          { number: "03", title: "抵达", description: "用最后一层完成叙事。", color: "#134e4a" },
        ]}
      />
    ),
    previewClassName: "p-0",
  },
  {
    slug: "fullscreen-expand-transition",
    title: "滚动全屏扩展转场",
    name: "Fullscreen Expand Transition",
    category: "scroll",
    description: "中心画面随滚动由悬浮窗口扩展至全屏，让章节切换像一次镜头推进。",
    designNotes: [
      "面板初始 scale 默认 0.58、圆角 28px，滚动结束时分别到 1 与 0px；startScale 限制在 0.4–0.9",
      "内部滚动距离为容器高度 190%，进度采用 easeOutCubic：1 - (1 - progress)³，使扩展前快后缓",
      "初始彩色辉光位于四周 16% 内缩区域，blur 70px、opacity 0.7，并随扩展进度线性淡出到 0",
      "缩放使用独立 CSS scale 属性避免与 Tailwind 位移叠加；prefers-reduced-motion 时直接显示 scale 1、圆角 0px 的终态",
    ],
    deps: [],
    file: "scroll/fullscreen-expand-transition.tsx",
    usage: `import { FullscreenExpandTransition } from "@/components/ui/fullscreen-expand-transition";

export function ChapterCover() {
  return (
    <FullscreenExpandTransition className="h-screen" accent="#7c3aed">
      <div className="flex h-full flex-col justify-end p-12">
        <p className="text-sm text-white/50">Chapter 02</p>
        <h2 className="mt-3 text-7xl font-semibold">进入下一幕</h2>
      </div>
    </FullscreenExpandTransition>
  );
}`,
    tags: ["全屏", "缩放", "镜头推进", "滚动进度"],
    preview: (
      <FullscreenExpandTransition accent="#6d28d9">
        <div className="flex h-full flex-col justify-between p-6 @md:p-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">Chapter 02</p>
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.045em] @md:text-5xl">进入下一幕</h3>
            <p className="mt-2 text-xs text-white/50 @md:text-sm">向下滚动，让画面占满舞台。</p>
          </div>
        </div>
      </FullscreenExpandTransition>
    ),
    previewClassName: "p-0",
  },
  {
    slug: "scroll-mascot",
    title: "IP 跟随角色",
    name: "Scroll Mascot",
    category: "scroll",
    description: "IP 角色注视光标，并随滚动方向倾斜、升降和更换对白，让品牌形象参与浏览。",
    designNotes: [
      "光标在容器内的归一化坐标映射到角色 x ±18px、y ±14px，眼睛进一步映射到 x ±4px、y ±3px",
      "角色跟随弹簧为 stiffness 180、damping 18、mass 0.45；滚动倾斜限制在 ±10deg，并在停止 120ms 后回正",
      "完整滚动进度把角色垂直位置从 -12px 移到 +12px，同时按 messages.length - 1 个区间切换对白",
      "滚动方向弹簧为 stiffness 150、damping 14、mass 0.5；prefers-reduced-motion 时停用光标跟随、倾斜和升降，仅保留对白切换",
    ],
    deps: ["motion"],
    file: "scroll/scroll-mascot.tsx",
    usage: `import { ScrollMascot } from "@/components/ui/scroll-mascot";

export function Companion() {
  return (
    <ScrollMascot
      className="h-screen"
      color="#a3e635"
      messages={["嗨，我会看向你的光标。", "继续滚动，我也会跟上。", "到站啦，下次见！"]}
    />
  );
}`,
    tags: ["IP 形象", "鼠标跟随", "滚动方向", "品牌角色"],
    preview: (
      <ScrollMascot
        messages={["嗨，我会看向你的光标。", "继续滚动，我也会跟上。", "到站啦，下次见！"]}
      />
    ),
    previewClassName: "p-0",
  },
];
