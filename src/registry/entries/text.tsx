import { BlurText } from "@/registry/components/text/blur-text";
import { DecryptText } from "@/registry/components/text/decrypt-text";
import { ShinyText } from "@/registry/components/text/shiny-text";
import { SplitText } from "@/registry/components/text/split-text";
import { TextReveal } from "@/registry/components/text/text-reveal";
import { Typewriter } from "@/registry/components/text/typewriter";
import { WordRotate } from "@/registry/components/text/word-rotate";
import type { RegistryEntry } from "@/registry/types";

export const textEntries: RegistryEntry[] = [
  {
    slug: "text-reveal",
    title: "文字显现",
    name: "Text Reveal",
    category: "text",
    description: "进入视口时，文字逐字从模糊与位移中浮现，为标题赋予呼吸感。",
    designNotes: [
      "中文按字、英文按词切分为独立单元，每个单元错峰 50ms 依次出现",
      "单个单元从下方 0.6em、模糊 12px、透明，过渡到原位清晰，时长 0.7s，使用 cubic-bezier(0.22,1,0.36,1) 缓出",
      "使用 whileInView 触发，默认只播放一次，元素露出 20% 时开始",
      "外层保留 aria-label 完整文本，内部单元 aria-hidden，保证可访问性",
      "尊重 prefers-reduced-motion：开启时直接显示最终状态",
    ],
    deps: ["motion"],
    file: "text/text-reveal.tsx",
    tags: ["标题", "入场", "模糊", "滚动触发"],
    usage: `import { TextReveal } from "@/components/ui/text-reveal";

export function Hero() {
  return (
    <h1 className="text-6xl font-semibold tracking-tight">
      <TextReveal text="复制一段提示词，得到一个惊艳的组件。" />
    </h1>
  );
}`,
    preview: (
      <h3 className="max-w-[14ch] text-center text-2xl font-semibold leading-tight tracking-tight text-balance text-white @md:text-4xl @xl:text-6xl">
        <TextReveal text="让每一个标题都值得被注视。" once={false} />
      </h3>
    ),
  },
  {
    slug: "shiny-text",
    title: "闪光文字",
    name: "Shiny Text",
    category: "text",
    description: "一道高光周期性掠过文字表面，像金属字牌在光下转动。",
    designNotes: [
      "文字底色为半透明白，高光为纯白，用 110deg 线性渐变表达斜向扫光",
      "背景尺寸 200% 宽，通过 background-position 从 200% 移到 -200% 实现循环扫过",
      "使用 background-clip: text 与透明文字色，让渐变只出现在字形内部",
      "默认 3s 一轮，线性匀速，无限循环，尊重 prefers-reduced-motion",
      "纯 CSS 实现，不依赖任何动画库",
    ],
    deps: [],
    file: "text/shiny-text.tsx",
    tags: ["高光", "循环", "纯 CSS", "标签"],
    usage: `import { ShinyText } from "@/components/ui/shiny-text";

export function Badge() {
  return (
    <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm">
      <ShinyText text="全新发布 · 组件词典 v1.0" />
    </span>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium @md:text-sm">
          <ShinyText text="全新发布 · 组件词典 v1.0" />
        </span>
        <ShinyText
          text="Shine on."
          speed={2.4}
          className="text-4xl font-semibold tracking-tight @md:text-6xl @xl:text-8xl"
        />
      </div>
    ),
  },
  {
    slug: "typewriter",
    title: "打字机",
    name: "Typewriter",
    category: "text",
    description: "逐字输入、停顿、删除，循环展示一组短语，附带闪烁光标。",
    designNotes: [
      "使用 Intl.Segmenter 按字素切分，中文与组合字符均保持完整；透明占位取全部短语的最大宽度，输入与删除不推动相邻文字",
      "输入间隔 70ms，删除间隔 35ms，一句打完停留 1.6s，删空后停 0.4s 再换下一句",
      "光标为实心竖块，1.1s 周期硬切闪烁（前半亮后半灭），透明度 70%、左间距 2px，与文字基线对齐",
      "屏幕阅读器仅在一句输入完成后通过 aria-live=polite 播报，不逐字打断阅读",
      "首帧显示首句；prefers-reduced-motion 时固定首句并停止输入、删除和光标闪烁",
    ],
    deps: [],
    file: "text/typewriter.tsx",
    tags: ["循环", "光标", "Hero", "文案"],
    usage: `import { Typewriter } from "@/components/ui/typewriter";

export function Headline() {
  return (
    <p className="text-3xl">
      为{" "}
      <Typewriter
        phrases={["产品经理", "独立开发者", "设计师", "所有人"]}
        className="text-lime-300"
      />{" "}
      准备的组件词典
    </p>
  );
}`,
    preview: (
      <p className="text-center text-2xl font-medium tracking-tight text-white @md:text-4xl @xl:text-5xl">
        为
        <Typewriter
          phrases={["产品经理", "独立开发者", "设计师", "所有人"]}
          className="mx-2 text-lime-300"
        />
        准备
      </p>
    ),
  },
  {
    slug: "decrypt-text",
    title: "解码文字",
    name: "Decrypt Text",
    category: "text",
    description: "字符先以乱码闪动，再从左到右逐个落定，像终端里被破译的密文。",
    designNotes: [
      "使用 requestAnimationFrame 驱动，每 30ms 更新一帧，每帧揭示 0.5 个字符",
      "未揭示的位置从 !<>-_\\/[]{}=+*^?# 与大写字母、数字中随机取字，空格保持不变",
      "首帧与服务端渲染的都是最终文本，挂载后才开始乱码，避免水合不一致",
      "悬停或键盘聚焦可重播；animateOnMount=false 时只响应交互，loop 开启时播完停 2.2s 重播，卸载清理动画帧与定时器",
      "按字素建立独立网格，用原字符透明占位稳定中西文字宽；聚焦显示 2px 焦点环、偏移 4px，prefers-reduced-motion 时直接显示完整原文",
    ],
    deps: ["motion"],
    file: "text/decrypt-text.tsx",
    tags: ["终端", "黑客", "悬停", "等宽"],
    usage: `import { DecryptText } from "@/components/ui/decrypt-text";

export function Terminal() {
  return (
    <h2 className="text-4xl uppercase tracking-widest">
      <DecryptText text="ACCESS GRANTED" />
    </h2>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-3">
        <DecryptText
          text="ACCESS GRANTED"
          loop
          className="text-xl font-medium tracking-[0.12em] text-lime-300 @md:text-3xl @xl:text-5xl"
        />
        <DecryptText
          text="悬停或聚焦，重新解码"
          frameDelay={45}
          className="text-xs tracking-widest text-zinc-500 @md:text-sm"
        />
      </div>
    ),
  },
  {
    slug: "word-rotate",
    title: "词语轮换",
    name: "Word Rotate",
    category: "text",
    description: "关键词在同一位置上翻出翻入，旧词上移、新词补位，让标语动起来。",
    designNotes: [
      "旧词上移 65% 淡出、新词从下方 65% 淡入，伴随 4px→0px 对焦；0.45s、cubic-bezier(0.22,1,0.36,1)，同步交接避免空白停顿",
      "默认每 2.4s 切换一次；用所有词的透明网格占位固定最大宽度，长短词交替不推动周围文字，overflow-hidden 裁掉越界部分",
      "aria-live=polite 播报新词；prefers-reduced-motion 时停止轮换并清除位移与模糊",
    ],
    deps: ["motion"],
    file: "text/word-rotate.tsx",
    tags: ["标语", "轮换", "Hero"],
    usage: `import { WordRotate } from "@/components/ui/word-rotate";

export function Headline() {
  return (
    <h1 className="text-5xl font-semibold">
      为
      <WordRotate className="mx-2 text-lime-300" words={["独立开发者", "设计师", "极客"]} />
      而造
    </h1>
  );
}`,
    preview: (
      <p className="text-center text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-5xl">
        把
        <WordRotate
          className="mx-2 text-lime-300"
          words={["灵感", "好设计", "细节", "创造力"]}
        />
        <br className="@md:hidden" />
        交给词典
      </p>
    ),
  },
  {
    slug: "split-text",
    title: "分字入场",
    name: "Split Text",
    category: "text",
    description: "字符从各自的裁切框底部依次升起，像一行排版被逐字推上来。",
    designNotes: [
      "每个字符套一层 overflow-hidden 裁切框，字符从 translateY 110% 升到 0%",
      "字符间隔默认 35ms，单字 0.6s、cubic-bezier(0.22,1,0.36,1) 缓出，挂载即播放；loop 开启时播完停 1.8s 自动重播",
      "空格渲染为不断行空格保持宽度；外层 aria-label 保留完整文本",
      "prefers-reduced-motion 时直接显示成品",
    ],
    deps: ["motion"],
    file: "text/split-text.tsx",
    tags: ["标题", "入场", "遮罩"],
    usage: `import { SplitText } from "@/components/ui/split-text";

export function Hero() {
  return (
    <h1 className="text-6xl font-semibold tracking-tight">
      <SplitText text="逐字推上舞台" />
    </h1>
  );
}`,
    preview: (
      <h3 className="text-center text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-6xl">
        <SplitText text="逐字推上舞台" loop />
      </h3>
    ),
  },
  {
    slug: "blur-text",
    title: "模糊显影",
    name: "Blur Text",
    category: "text",
    description: "以词为单位从失焦的光斑中对焦成形，比逐字入场更柔和的副标题动效。",
    designNotes: [
      "使用 Intl.Segmenter 按中英文词语切分，标点附着前词、保留空格与自然换行；每词 blur 16px→0、scale 1.06→1、opacity 0→1",
      "单词 0.55s、词间隔默认 120ms，挂载即播放；比逐字版本更柔和，loop 开启时播完停 1.8s 自动重播",
      "每个词的最大宽度为容器 100%，超长词允许折行；外层 aria-label 保留完整文本，内部装饰字符 aria-hidden",
      "prefers-reduced-motion 时直接显示成品",
    ],
    deps: ["motion"],
    file: "text/blur-text.tsx",
    tags: ["副标题", "模糊", "对焦"],
    usage: `import { BlurText } from "@/components/ui/blur-text";

export function SubHeadline() {
  return (
    <p className="max-w-xl text-2xl text-zinc-400">
      <BlurText text="Copy a prompt, ship a stunning component." />
    </p>
  );
}`,
    preview: (
      <p className="max-w-[26ch] text-center text-lg leading-relaxed text-zinc-300 @md:text-2xl @xl:text-3xl">
        <BlurText text="复制一段提示词，得到一个有质感的组件。" loop />
      </p>
    ),
  },
];
