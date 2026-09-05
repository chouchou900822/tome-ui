import { BlurText } from "@/registry/components/text/blur-text";
import { DecryptText } from "@/registry/components/text/decrypt-text";
import { HyperText } from "@/registry/components/text/hyper-text";
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
      "按码点切分字符，中文、emoji 不会被截断成半个字符",
      "输入间隔 70ms，删除间隔 35ms，一句打完停留 1.6s，删空后停 0.4s 再换下一句",
      "光标是一个实心竖块字符，1s 周期硬切闪烁（前半亮后半灭）",
      "容器使用 inline-flex 与 items-baseline，光标与文字基线对齐",
      "使用 aria-live=polite 让屏幕阅读器在句子稳定后播报",
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
      "鼠标悬停可重新播放，组件卸载时取消动画帧",
      "使用等宽字体与 tabular-nums，乱码切换时宽度不抖动；尊重 prefers-reduced-motion",
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
          className="text-2xl font-semibold tracking-[0.2em] text-lime-300 @md:text-4xl @xl:text-6xl"
        />
        <DecryptText
          text="悬停以重新解码"
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
      "旧词位移 -80% 淡出、新词自 80% 淡入，0.45s、cubic-bezier(0.22,1,0.36,1)，AnimatePresence 串行衔接",
      "默认每词停留 2.4s 后切换；容器 overflow-hidden 裁掉出入场的越界部分",
      "aria-live=polite 让屏幕阅读器播报新词；prefers-reduced-motion 时直接硬切",
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
          words={["灵感", "组件", "动效", "质感"]}
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
      "字符间隔默认 35ms，单字 0.6s、cubic-bezier(0.22,1,0.36,1) 缓出，挂载即播放",
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
        <SplitText text="逐字推上舞台" />
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
      "按空格切词，每词整团显影：blur 16px 到 0、scale 1.06 到 1、透明到不透明",
      "单词 0.55s、词间隔默认 120ms，挂载即播放；比逐字版本更柔和",
      "scale 走独立属性，避免与 transform 位移叠加；外层 aria-label 保留完整文本",
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
        <BlurText text="复制一段提示词，得到一个有质感的组件。" />
      </p>
    ),
  },
  {
    slug: "hyper-text",
    title: "字符跳变",
    name: "Hyper Text",
    category: "text",
    description: "悬停时文字先整段抖成乱码，再从左到右逐位定格回原文。",
    designNotes: [
      "每 30ms 一帧，定格位置随时间从左推进，默认 900ms 走完全部字符",
      "未定格字符每帧从符号、字母、数字中重抽；空格不参与跳变",
      "初始与服务端渲染均为原文，挂载后悬停才开始乱码，水合安全",
      "支持键盘聚焦触发；prefers-reduced-motion 时悬停不产生乱码",
    ],
    deps: ["motion"],
    file: "text/hyper-text.tsx",
    tags: ["悬停", "乱码", "交互"],
    usage: `import { HyperText } from "@/components/ui/hyper-text";

export function NavBrand() {
  return (
    <span className="text-xl font-semibold">
      <HyperText text="TOME" />
    </span>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-3">
        <HyperText
          text="HOVER ME"
          className="text-2xl font-semibold tracking-[0.25em] text-white @md:text-4xl @xl:text-6xl"
        />
        <p className="text-xs text-zinc-500 @md:text-sm">鼠标悬停，看文字抖动定格</p>
      </div>
    ),
  },
];
