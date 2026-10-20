import { AsciiMedia } from "@/registry/components/textures/ascii-media";
import { FlickeringGrid } from "@/registry/components/textures/flickering-grid";
import { LetterGlitch } from "@/registry/components/textures/letter-glitch";
import type { RegistryEntry } from "@/registry/types";

const fill = "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center";

/** 字符影像的演示素材：一颗带环的受光行星，亮部会化作字符浮现 */
const planet =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
      <defs>
        <radialGradient id="p" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#ddd"/><stop offset=".75" stop-color="#888"/><stop offset="1" stop-color="#2a2a2a"/></radialGradient>
      </defs>
      <circle cx="402" cy="64" r="16" fill="#e0e0e0"/>
      <g transform="rotate(-16 240 180)" fill="none" stroke-width="22">
        <ellipse cx="240" cy="180" rx="222" ry="56" stroke="#8a8a8a"/>
        <circle cx="240" cy="180" r="112" fill="url(#p)" stroke="none"/>
        <path d="M18 180A222 56 0 0 0 462 180" stroke="#fff"/>
      </g>
    </svg>`,
  );

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
  {
    slug: "ascii-media",
    title: "字符影像",
    name: "ASCII Media",
    category: "textures",
    description: "暗色伪代码铺满画布并按波浪成片跳变，图片或视频的亮部化作更亮的字符浮现，复刻 Inception 登录页右栏。",
    designNotes: [
      "纯黑底上铺 10px Courier New 等宽字符，行高 10px、列距取字宽的 1.3 倍；每行由关键字、随机串、0x 十六进制、运算符、括号组、标识符与符号拼成伪代码，12% 的行带 2–5 格缩进",
      "每 40ms（25fps）刷新一次：非空格字符以 (sin(0.002·t + 行相位 + 列相位) + 1) / 2 × 20% 的概率换成随机字符，列相位沿行从 0 递增到 π，跳变像波浪横扫；空格永不变化，保住代码排版骨架",
      "媒体 contain 适配到画布 95% 并居中，按字符网格缩采样：亮度 > 0.05 且 alpha > 20 的格子以 rgba(255,255,255, a × (0.15 + 0.85 × 亮度)) 绘制，其余格子画 0.15 透明度的底纹",
      "视频静音循环、内联播放；IntersectionObserver 离屏时暂停循环与视频，ResizeObserver 重排网格，画布按 devicePixelRatio（上限 2）缩放",
      "prefers-reduced-motion 时不跳变、不播放，只绘制一帧静态字符画（视频取首帧）",
    ],
    deps: [],
    file: "textures/ascii-media.tsx",
    tags: ["ASCII", "字符", "视频", "Canvas", "登录页"],
    usage: `import { AsciiMedia } from "@/components/ui/ascii-media";

export function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#0b0b0d]">
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-3xl font-semibold text-white">欢迎回来</h1>
      </main>
      {/* 换成你自己的图片或视频（同源或已开启 CORS），留空则只有代码底纹 */}
      <AsciiMedia src="/hero.mp4" className="hidden flex-1 lg:block" />
    </div>
  );
}`,
    previewClassName: "p-0",
    preview: <AsciiMedia src={planet} className="absolute inset-0" />,
  },
];
