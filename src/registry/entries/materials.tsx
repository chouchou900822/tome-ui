import { ArrowRight, Move } from "lucide-react";
import { LiquidGlass } from "@/registry/components/materials/liquid-glass";
import type { RegistryEntry } from "@/registry/types";

/** 玻璃后方的真实内容：色带、大字与细线，用来暴露边缘折射与色散 */
const bands = [
  "top-[18%] h-[9%] from-[#f97362] via-[#fbbf24] to-[#f472b6]",
  "top-[38%] h-[14%] from-[#38bdf8] via-[#34d399] to-[#a78bfa]",
  "top-[62%] h-[7%] from-[#e879f9] via-[#f43f5e] to-[#fb923c]",
];

export const materialEntries: RegistryEntry[] = [
  {
    slug: "liquid-glass",
    title: "液态玻璃",
    name: "Liquid Glass",
    category: "materials",
    description: "真实折射玻璃后方的网页内容：边缘随曲面弯折、带轻微色散，指针靠近时边缘泛起柔光。",
    designNotes: [
      "折射：Canvas 按圆角矩形有向距离场生成位移贴图，bevel 20px 曲面圈内以折射率 1.46、入射角曲线 (1-t)^1.28 的斯涅尔近似弯折，默认强度 48px（上限为短边 46%），经 feDisplacementMap 作为 backdrop-filter: url(#id) 应用——玻璃后方的真实网页内容参与折射，不是贴图",
      "色散：RGB 三通道分别以 strength ± 1.2px 位移，feColorMatrix 单通道分离后 screen 叠回；源模糊 0.4px、位移贴图预模糊 0.55px、结果再模糊 0.48px 消除锯齿",
      "受光：同一距离场生成受光贴图——距轮廓 0.72px 处窄高光（顶部权重 0.78·top²、底部 0.64·bottom³）、bevel 31% 处柔和肩光、右侧 1.8px 处 21% 暗部；指针坐标写入 --lg-x/--lg-y，白 68%→15%(38%)→透明(68%) 的径向柔光以受光贴图为遮罩只亮在边缘，默认停在 28% 12%",
      "叠层：着色 rgba(255,255,255,0.03)、圆角 28px、155° 光泽渐变（白 7.5%→透明 24%→透明 77%→白 1.8%）、外投影 0 24px 36px -20px 黑 50% 与 0 8px 16px -10px 黑 40%；正文置于所有材质层之上保持清晰",
      "降级与交互：非 Chromium / iOS 用 blur 6px saturate 1.1 毛玻璃并以 1px 内高光代替受光贴图；prefers-reduced-transparency 或 prefers-contrast: more 为 #26282e 实色；prefers-reduced-motion 时柔光不跟随指针；draggable 时用 setPointerCapture 与独立 translate 属性在定位父容器内拖动并钳制边界，方向键 8px / Shift 24px、Home 复位",
    ],
    deps: [],
    file: "materials/liquid-glass.tsx",
    tags: ["玻璃", "折射", "色散", "backdrop-filter", "拖拽"],
    usage: `import { LiquidGlass } from "@/components/ui/liquid-glass";

export function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden bg-[#0b0b0d]">
      {/* 玻璃后方放任何真实内容：图片、文字、色带 */}
      <h1 className="absolute bottom-12 right-8 text-8xl font-semibold text-white">
        Clarity.
      </h1>
      <LiquidGlass draggable className="absolute left-12 top-12 w-80 p-6 text-white">
        <p className="text-3xl font-medium">Transparent.</p>
        <p className="mt-2 text-sm text-white/70">拖动镜片，看边缘的折射与色散。</p>
      </LiquidGlass>
    </section>
  );
}`,
    previewClassName: "p-0",
    preview: (
      <div className="absolute inset-0 overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {bands.map((band) => (
            <span key={band} className={`absolute -left-[10%] w-[120%] -rotate-3 bg-linear-to-r ${band}`} />
          ))}
          <span className="absolute left-0 top-[80%] h-px w-full bg-white/50" />
          <span className="absolute bottom-[9%] left-5 font-mono text-[8px] tracking-[0.35em] text-white/45 @md:text-[10px]">
            LIGHT / SURFACE / REFRACTION
          </span>
          <span className="absolute bottom-[8%] right-5 text-5xl font-semibold tracking-tight text-white/90 @md:text-7xl @xl:text-8xl">
            Clarity.
          </span>
        </div>
        <LiquidGlass
          draggable
          className="absolute left-[8%] top-[15%] h-[60%] w-[56%] p-4 text-white @md:h-[56%] @md:w-[46%] @md:p-6"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between text-white/70">
              <span className="font-mono text-[8px] tracking-[0.25em] @md:text-[10px]">LIQUID / 01</span>
              <Move aria-hidden className="size-3.5 @md:size-4" />
            </div>
            <p className="text-2xl font-medium tracking-tight @md:text-4xl @xl:text-5xl">Transparent.</p>
            <div className="flex items-center justify-between text-[10px] text-white/70 @md:text-xs">
              <span>拖动镜片，看边缘</span>
              <ArrowRight aria-hidden className="size-3.5 @md:size-4" />
            </div>
          </div>
        </LiquidGlass>
      </div>
    ),
  },
];
