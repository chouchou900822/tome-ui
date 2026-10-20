import { AsciiMedia } from "@/registry/components/textures/ascii-media";
import { FlickeringGrid } from "@/registry/components/textures/flickering-grid";
import { LetterGlitch } from "@/registry/components/textures/letter-glitch";
import type { RegistryEntry } from "@/registry/types";

const fill = "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center";

/** 字符影像的演示画面（480×360，白色明暗即字符亮度）：月亮 → 地球 → 太阳 → 太阳系 → 星云 */
const svg = (body: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">${body}</svg>`);

/** 以画面中心 (240,180) 为圆心的极坐标点；ry 小于 r 时落在压扁的椭圆轨道上 */
const at = (r: number, a: number, ry = r) => `${(240 + r * Math.cos(a)).toFixed(1)} ${(180 + ry * Math.sin(a)).toFixed(1)}`;
const orbit = (r: number, a: number) => at(r, a, r * 0.36);

const moon = svg(`<defs>
<radialGradient id="l" cx=".3" cy=".4" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#f0f0f0"/><stop offset="1" stop-color="#c8c8c8"/></radialGradient>
<filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
<mask id="c"><circle cx="240" cy="180" r="130" fill="#fff"/><circle cx="294" cy="166" r="118" filter="url(#b)"/></mask>
</defs>
<circle cx="240" cy="180" r="130" fill="#1c1c1c"/>
<g mask="url(#c)"><circle cx="240" cy="180" r="130" fill="url(#l)"/>
<ellipse cx="180" cy="168" rx="16" ry="26" fill="#8a8a8a" filter="url(#b)"/>
<g fill="#4a4a4a"><ellipse cx="148" cy="196" rx="12" ry="19"/><ellipse cx="176" cy="120" rx="16" ry="11"/><ellipse cx="168" cy="262" rx="17" ry="11"/>
<ellipse cx="132" cy="146" rx="7" ry="13"/><ellipse cx="192" cy="212" rx="10" ry="10"/></g></g>`);

const earth = svg(`<defs>
<clipPath id="e"><circle cx="240" cy="180" r="120"/></clipPath>
<linearGradient id="t"><stop offset=".62" stop-opacity="0"/><stop offset="1" stop-opacity=".6"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="1.5"/></filter><filter id="g"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<circle cx="240" cy="180" r="123" fill="none" stroke="#fff" stroke-width="5" filter="url(#g)"/>
<g clip-path="url(#e)"><rect x="120" y="60" width="240" height="240" fill="#383838"/>
<g fill="#fff" filter="url(#b)"><path d="M196 134L228 127L262 137L276 160L292 189L313 197L301 214L291 239L281 262L263 285L248 293L238 281L232 254L228 226L222 208L205 203L186 196L171 178L176 155Z"/>
<path d="M168 120L190 103L222 92L258 90L288 100L276 116L252 121L236 116L222 126L200 128L184 132Z"/><path d="M283 141L311 149L327 176L306 192L292 172Z"/>
<ellipse cx="302" cy="262" rx="6" ry="15" transform="rotate(18 302 262)"/></g>
<g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="5" opacity=".85" filter="url(#b)"><path d="M132 232q34-20 66-6"/><path d="M152 96q28-12 58-6"/>
<path d="M262 302q30-14 64-12"/><path d="M340 236a16 12 0 1 1-18-10a9 7 0 1 1 8 10"/></g>
<rect x="120" y="60" width="240" height="240" fill="url(#t)"/></g>
<circle cx="398" cy="74" r="17" fill="#fff"/><circle cx="392" cy="69" r="4.5" fill="#666"/>`);

const sun = svg(`<defs>
<radialGradient id="c"><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="b"><feGaussianBlur stdDeviation="2"/></filter>
</defs>
<circle cx="240" cy="180" r="160" fill="url(#c)"/>
<path fill="#fff" filter="url(#b)" d="${Array.from({ length: 16 }, (_, i) => {
  const a = (i * Math.PI) / 8 + 0.2;
  return `M${at(100, a - 0.1)}L${at(i % 2 ? 150 : 178, a)}L${at(100, a + 0.1)}Z`;
}).join("")}"/>
<circle cx="240" cy="180" r="102" fill="#fff"/>
<g fill="#4d4d4d"><circle cx="206" cy="158" r="11"/><circle cx="224" cy="170" r="6"/><circle cx="270" cy="216" r="9"/></g>
<g fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"><path d="M162 118C126 96 150 56 184 92"/><path d="M318 243C352 252 350 294 306 278"/></g>`);

const solarSystem = svg(`<defs><radialGradient id="g"><stop offset=".45" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<g transform="rotate(-12 240 180)">
<g fill="none" stroke="#fff" stroke-width="4.5" opacity=".75">${[56, 84, 112, 146, 192, 226]
  .map((r) => `<ellipse cx="240" cy="180" rx="${r}" ry="${(r * 0.36).toFixed(1)}"/>`)
  .join("")}</g>
<ellipse cx="240" cy="180" rx="168" ry="60.5" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="1 10" stroke-linecap="round" opacity=".9"/>
<circle cx="240" cy="180" r="44" fill="url(#g)"/><circle cx="240" cy="180" r="22" fill="#fff"/>
<g fill="#fff">${[[56, 3.6, 5], [84, 0.75, 7.5], [112, 2.3, 8], [146, 5.2, 6.5], [192, 0.4, 16], [226, 3.8, 13]]
  .map(([r, a, size]) => `<circle r="${size}" transform="translate(${orbit(r, a)})"/>`)
  .join("")}</g>
<ellipse rx="28" ry="8" fill="none" stroke="#fff" stroke-width="4.5" transform="translate(${orbit(226, 3.8)}) rotate(-16)"/>
</g>`);

const nebula = svg(`<defs>
<filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="4" seed="4"/>
<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 3 0 0 0 -1.05"/></filter>
<radialGradient id="m"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="k"><ellipse cx="240" cy="180" rx="236" ry="170" fill="url(#m)"/></mask>
<filter id="b"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<rect width="480" height="360" filter="url(#n)" mask="url(#k)"/>
<ellipse cx="252" cy="168" rx="100" ry="62" fill="url(#m)" transform="rotate(-20 252 168)"/>
<path d="M110 252C190 200 230 232 300 172S392 118 436 140" fill="none" stroke="#000" stroke-width="12" opacity=".45" filter="url(#b)"/>
<g fill="#fff">${"46,70,4 92,214,3.5 126,36,3.5 150,304,4 186,88,3.5 212,326,3.5 300,42,3.5 336,314,3.5 368,150,3.5 404,60,4 430,232,3.5 448,122,3.5 68,150,3.5 268,276,3.5 318,104,3.5 26,262,3.5 454,318,3.5 236,22,3.5 176,190,3 300,226,3 210,130,3 400,190,3"
  .split(" ")
  .map((star) => {
    const [x, y, r] = star.split(",");
    return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
  })
  .join("")}</g>
<g stroke="#fff" stroke-width="3.5">${[[88, 96], [392, 104], [360, 270], [140, 262], [252, 168]]
  .map(([x, y]) => `<path d="M${x - 24} ${y}H${x + 24}M${x} ${y - 24}V${y + 24}"/><circle cx="${x}" cy="${y}" r="6" fill="#fff"/>`)
  .join("")}</g>`);

const cosmos = [moon, earth, sun, solarSystem, nebula];

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
    description: "伪代码字符成片跳变，画面亮部化作亮字符浮现；多个画面依次拉远过渡，复刻 Inception 登录页右栏。",
    designNotes: [
      "纯黑底上铺 10px Courier New 等宽字符，行高 10px、列距取字宽的 1.3 倍；每行由关键字、随机串、0x 十六进制、运算符、括号组、标识符与符号拼成伪代码，12% 的行带 2–5 格缩进",
      "每 40ms（25fps）刷新一次：非空格字符以 (sin(0.002·t + 行相位 + 列相位) + 1) / 2 × 20% 的概率换成随机字符，列相位沿行从 0 递增到 π，跳变像波浪横扫；空格永不变化，保住代码排版骨架",
      "画面 contain 适配到画布 95% 并居中，合成到黑底后按字符网格每格取一个像素：亮度 > 0.05 的格子以 rgba(255,255,255, 0.15 + 0.85 × 亮度) 绘制，其余格子画 0.15 透明度的底纹",
      "传入数组时依次播放：每个画面 4000ms，末尾 35%（1.4s）与下一画面加色交叉淡化（smoothstep）；每个画面在可见窗口内从 1.48 倍缩到 0.67 倍，停留时缓慢、过渡时加速，像镜头一路拉远",
      "视频静音循环、内联播放；离屏时暂停循环与视频，ResizeObserver 重排网格；prefers-reduced-motion 时只绘制第一个画面的静态一帧",
    ],
    deps: [],
    file: "textures/ascii-media.tsx",
    tags: ["ASCII", "字符", "视频", "转场", "登录页"],
    usage: `import { AsciiMedia } from "@/components/ui/ascii-media";

// 依次拉远过渡的画面，图片或视频均可（同源或已开启 CORS）；也可只传一个地址，如 src="/hero.mp4"
const scenes = ["/moon.png", "/earth.png", "/sun.png", "/solar-system.png", "/nebula.png"];

export function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#0b0b0d]">
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-3xl font-semibold text-white">欢迎回来</h1>
      </main>
      <AsciiMedia src={scenes} className="hidden flex-1 lg:block" />
    </div>
  );
}`,
    previewClassName: "p-0",
    preview: <AsciiMedia src={cosmos} className="absolute inset-0" />,
  },
];
