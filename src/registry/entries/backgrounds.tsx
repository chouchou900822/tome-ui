import { AuroraBackground } from "@/registry/components/backgrounds/aurora-background";
import { DotGrid } from "@/registry/components/backgrounds/dot-grid";
import { GridBeams } from "@/registry/components/backgrounds/grid-beams";
import type { RegistryEntry } from "@/registry/types";

const fill = "absolute inset-0 flex items-center justify-center";

export const backgroundEntries: RegistryEntry[] = [
  {
    slug: "aurora-background",
    title: "极光背景",
    name: "Aurora Background",
    category: "backgrounds",
    description: "三层大尺寸模糊色块以不同节奏漂移，叠加噪点，像夜空中缓慢流动的极光。",
    designNotes: [
      "三个占容器 55% 宽高的圆形色块，颜色默认紫、青、荧光绿，分别放在左上、右上、中下",
      "整组色块做 blur-3xl 模糊、饱和度 150%、透明度 70%，混合后形成柔和的过渡",
      "每个色块用同一段关键帧（位移 + 缩放）往返播放，时长 14s/17s/20s 并用负延迟错开相位",
      "顶层叠一层 SVG feTurbulence 噪点，透明度 12%、mix-blend-mode: overlay，消除渐变色带",
      "容器 isolate + overflow-hidden，子内容 relative 置于最上层；纯 CSS 动画",
    ],
    deps: [],
    file: "backgrounds/aurora-background.tsx",
    tags: ["Hero", "氛围", "模糊", "纯 CSS"],
    usage: `import { AuroraBackground } from "@/components/ui/aurora-background";

export function Hero() {
  return (
    <AuroraBackground className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">在极光下发布</h1>
    </AuroraBackground>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <AuroraBackground className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          在极光下发布
        </p>
      </AuroraBackground>
    ),
  },
  {
    slug: "dot-grid",
    title: "交互点阵",
    name: "Dot Grid",
    category: "backgrounds",
    description: "均匀的暗点铺满背景，指针像手电筒一样扫过，点亮周围一片点阵。",
    designNotes: [
      "点阵用 radial-gradient 平铺实现：1px 实心圆、1.5px 处透明，背景尺寸 24px，居中对齐",
      "两层完全相同排布的点阵：底层暗点（白 14%），顶层亮点（品牌色）",
      "顶层加一个跟随鼠标、半径 220px 的径向遮罩（中心不透明、70% 处透明），只显露指针附近的亮点",
      "鼠标坐标用 MotionValue 写入 mask-image，离开容器时把坐标移到画面外",
      "容器 isolate + overflow-hidden，子内容 relative 置于点阵上方",
    ],
    deps: ["motion"],
    file: "backgrounds/dot-grid.tsx",
    tags: ["Hero", "交互", "鼠标", "点阵"],
    usage: `import { DotGrid } from "@/components/ui/dot-grid";

export function Section() {
  return (
    <DotGrid className="flex min-h-[60vh] items-center justify-center rounded-3xl">
      <h2 className="text-4xl font-semibold text-white">移动鼠标</h2>
    </DotGrid>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <DotGrid className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          移动鼠标
        </p>
      </DotGrid>
    ),
  },
  {
    slug: "grid-beams",
    title: "网格光束",
    name: "Grid Beams",
    category: "backgrounds",
    description: "淡淡的网格线上，几束细光沿竖向网格线从上方坠落，边缘柔和淡出。",
    designNotes: [
      "网格用两组 1px 线性渐变平铺，间距 48px，线色白 6%；整体套椭圆径向遮罩，40% 起向边缘淡出",
      "光束是 1px 宽、容器 40% 高的竖条，颜色为透明→品牌色→透明的竖向渐变",
      "光束左侧位置 = 列序号 × 网格间距，精确落在网格线上；默认 7 束分布在不同列",
      "每束从 -100% 位移到 300%，时长在 5s 到 8.5s 之间、负延迟在 0 到 4.7s 之间，两者取自互不成比例的数表以避免同步，线性匀速无限循环",
      "纯 CSS 动画，关键帧随组件内联；容器 isolate + overflow-hidden",
    ],
    deps: [],
    file: "backgrounds/grid-beams.tsx",
    tags: ["Hero", "科技", "网格", "纯 CSS"],
    usage: `import { GridBeams } from "@/components/ui/grid-beams";

export function Hero() {
  return (
    <GridBeams className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">构建于网格之上</h1>
    </GridBeams>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <GridBeams className={fill} size={32}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          构建于网格之上
        </p>
      </GridBeams>
    ),
  },
];
