import { AuroraBackground } from "@/registry/components/backgrounds/aurora-background";
import { DotGrid } from "@/registry/components/backgrounds/dot-grid";
import { GridBeams } from "@/registry/components/backgrounds/grid-beams";
import { LightRays } from "@/registry/components/backgrounds/light-rays";
import { Meteors } from "@/registry/components/backgrounds/meteors";
import { Ripple } from "@/registry/components/backgrounds/ripple";
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
  {
    slug: "meteors",
    title: "流星雨",
    name: "Meteors",
    category: "backgrounds",
    description: "细长光条头亮尾散，从右上向左下错峰坠落，安静夜空里的一阵流星。",
    designNotes: [
      "每条流星是 120px×1px 的圆角细条，白色 70% 向右渐隐；头部 3px 白点带 6px 半径的白 35% 光晕",
      "位移沿 215deg 方向推进 480px，前 15% 淡入、70% 前保持全亮、随后淡出，时长 3.5–6.5s 各不相同",
      "animation-fill-mode: backwards 且基础态 opacity-0：错峰延迟期与 prefers-reduced-motion 下均不可见，避免横条裸露",
      "数量默认 14 条，top/left/延迟/时长由索引经确定性伪随机派生，服务端与客户端渲染一致",
      "纯 CSS 关键帧，无限循环，尊重 prefers-reduced-motion；容器 isolate + overflow-hidden",
    ],
    deps: [],
    file: "backgrounds/meteors.tsx",
    tags: ["夜空", "Hero", "循环", "纯 CSS"],
    usage: `import { Meteors } from "@/components/ui/meteors";

export function Hero() {
  return (
    <Meteors className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">今夜有流星</h1>
    </Meteors>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <Meteors className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          今夜有流星
        </p>
      </Meteors>
    ),
  },
  {
    slug: "ripple",
    title: "同心波纹",
    name: "Ripple",
    category: "backgrounds",
    description: "多圈圆环从中心依次扩散淡出、周而复始，像水面被轻轻叩了一下。",
    designNotes: [
      "默认 5 圈正圆环，1px 白 25% 描边，宽度撑满容器（上限 640px）并保持 1:1",
      "每圈从 scale 0.15、不透明度 0.55 扩散到 scale 1、完全透明，一轮 4.5s，线性匀速",
      "圈与圈之间按总时长的等分错开延迟，画面任意时刻都有 5 圈处于不同相位",
      "动画走独立 scale 属性而非 transform，避免与 Tailwind 位移类叠加；尊重 prefers-reduced-motion",
    ],
    deps: [],
    file: "backgrounds/ripple.tsx",
    tags: ["水波", "扩散", "极简", "纯 CSS"],
    usage: `import { Ripple } from "@/components/ui/ripple";

export function Section() {
  return (
    <Ripple className="flex min-h-[60vh] items-center justify-center">
      <h2 className="text-4xl font-semibold text-white">一圈，又一圈</h2>
    </Ripple>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <Ripple className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          一圈，又一圈
        </p>
      </Ripple>
    ),
  },
  {
    slug: "light-rays",
    title: "光束倾泻",
    name: "Light Rays",
    category: "backgrounds",
    description: "顶边中点向下张开数道光束，双层模糊反向缓摆，像放映机的灯锥。",
    designNotes: [
      "两层 220% 宽的正方形光层以顶边中点为 conic-gradient 原点，向下 0–120° 扇区内分布 3 束白光与 1 束淡青光，束宽 6–8°",
      "主层 blur(12px)、透明度 80%，10s 摆完一轮；副层 blur(40px)、透明度 50%、束位错开，16s 反向摆动，均 alternate 往返",
      "摆动是围绕顶边中点 ±2.5° 的 rotate；线性遮罩让光在 85%/90% 高度处渐隐",
      "纯 CSS 实现，尊重 prefers-reduced-motion；容器 isolate + overflow-hidden",
    ],
    deps: [],
    file: "backgrounds/light-rays.tsx",
    tags: ["光束", "氛围", "放映机", "纯 CSS"],
    usage: `import { LightRays } from "@/components/ui/light-rays";

export function Hero() {
  return (
    <LightRays className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">聚光灯下</h1>
    </LightRays>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <LightRays className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          聚光灯下
        </p>
      </LightRays>
    ),
  },
];
