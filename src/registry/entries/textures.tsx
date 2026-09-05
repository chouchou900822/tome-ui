import { FlickeringGrid } from "@/registry/components/textures/flickering-grid";
import { LetterGlitch } from "@/registry/components/textures/letter-glitch";
import type { RegistryEntry } from "@/registry/types";

const fill = "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center";

export const textureEntries: RegistryEntry[] = [
  {
    slug: "flickering-grid",
    title: "闪烁网格",
    name: "Flickering Grid",
    category: "textures",
    description: "满屏 1px 微光方块按概率明灭，像一块呼吸着的电路板底纹。",
    designNotes: [
      "Canvas 满铺容器，网格单元 8px、方块 1px 居中，默认亮度上限 0.35",
      "每帧每格有 4% 概率重抽目标亮度，并以 0.08 系数向目标缓动，形成呼吸式明灭",
      "画布按 devicePixelRatio（上限 2）缩放保证高分屏清晰，ResizeObserver 跟随容器重排网格",
      "prefers-reduced-motion 时只绘制一帧静态网格，不进入动画循环",
    ],
    deps: [],
    file: "textures/flickering-grid.tsx",
    tags: ["底纹", "Canvas", "科技感", "满屏"],
    usage: `import { FlickeringGrid } from "@/components/ui/flickering-grid";

export function Hero() {
  return (
    <FlickeringGrid className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-semibold text-white">信号永不静止</h1>
    </FlickeringGrid>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <FlickeringGrid className={fill}>
        <h3 className="text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-5xl">
          信号永不静止
        </h3>
        <p className="text-xs text-zinc-500 @md:text-sm">底层是不断明灭的微光方块</p>
      </FlickeringGrid>
    ),
  },
  {
    slug: "letter-glitch",
    title: "字符雨屏",
    name: "Letter Glitch",
    category: "textures",
    description: "满屏青绿色等宽字符随机跳变，中心亮、四周渐隐，数字噪声般的底纹。",
    designNotes: [
      "Canvas 满铺容器，字符单元 14px、字号 12px 等宽，字符从符号、字母、数字中随机抽取",
      "色板以青（rgba(18,255,255)）与绿（rgba(0,255,102)）为主，掺 40% 白作高光，透明度 0.25–0.55",
      "每帧每格有 6% 概率同时重抽字符与颜色，视觉上是不定点的密集跳变",
      "整层加径向遮罩（中心 30% 内全显、76% 处渐隐），让边缘自然融进深色背景",
      "prefers-reduced-motion 时只绘制一帧静态字符场，不进入动画循环",
    ],
    deps: [],
    file: "textures/letter-glitch.tsx",
    tags: ["底纹", "字符", "赛博", "Canvas"],
    usage: `import { LetterGlitch } from "@/components/ui/letter-glitch";

export function Section() {
  return (
    <LetterGlitch className="flex min-h-screen items-center justify-center">
      <h2 className="text-4xl font-semibold text-white">躲在噪声之下</h2>
    </LetterGlitch>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <LetterGlitch className={fill}>
        <h3 className="text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-5xl">
          躲在噪声之下
        </h3>
        <p className="text-xs text-zinc-500 @md:text-sm">满屏字符在青绿噪声中跳变</p>
      </LetterGlitch>
    ),
  },
];
