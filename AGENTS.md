<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tome 组件词典 · 贡献规则

项目是一个「组件词典」：每个前端组件附带可复制给 AI 编程助手的中文提示词。`pnpm typecheck` 校验类型（严格模式），`pnpm build` 依赖 `next.config.ts` 的 `output: "export"` 把全站静态导出到 `out/`。

## 添加一个组件

只改两个文件：组件源码 + 注册条目。其余全部自动派生，禁止手工维护。

### 1. 组件源码：`src/registry/components/<分类>/<slug>.tsx`

文件名 = slug（kebab-case）。该文件会被 `lib/source.ts` 原样读出、拼进 AI 提示词，因此必须完全自包含：

- 允许的依赖：`@/lib/utils` 的 `cn`、Tailwind 类名、`motion`（导入 `motion/react`）。禁止引入其他库，禁止 import 项目内其他文件
- 使用 hooks / 浏览器 API / motion hooks 的组件，文件首行加 `"use client"`；纯 CSS 动画组件不加
- TypeScript 严格模式：显式 props interface；禁止 `any` 与 `@ts-ignore`；具名导出 `export function`，函数名对应条目 `name`
- 动画与可访问性：
  - Tailwind 类驱动的 CSS 动画加 `motion-safe:` 前缀；`<style>` 内联关键帧则把动画应用规则包进 `@media (prefers-reduced-motion: no-preference)`
  - JS 驱动的动画读取 prefers-reduced-motion 并跳到终态（引 motion 时用 `useReducedMotion()`，未引时用 `matchMedia`）
  - 手写 CSS 的 `transform` 会与 Tailwind v4 位移类（走独立 `translate` 属性）叠加产生双重位移，动效优先用独立 `scale` / `rotate` 属性
  - 装饰层加 `aria-hidden`；拆分文本的组件外层保留完整 `aria-label`
- 关键帧内联：`<style href="<slug>-keyframes" precedence="medium">`，`href` 全站唯一（React 19 自动去重并提升到 head）。禁止把关键帧写进 `globals.css`
- 水合安全：服务端首帧与客户端首帧必须一致；随机性只能发生在 `useEffect` 之后（参考 `DecryptText`）；渲染路径上不读 `window`
- 视觉按深色背景（`#0b0b0d`）调校至最佳
- 体积红线：单文件 ≤ 300 行；分类目录 ≤ 8 个文件，超出先按「新增分类」整理

### 2. 注册条目：`src/registry/entries/<分类>.tsx`

在数组**末尾**追加一个 `RegistryEntry`（数组顺序 = 词典编号 No.XX、首页跑马灯、详情页前后导航的顺序）：

- `slug`：kebab-case，全站唯一，决定 `/c/<slug>` 与 `/api/prompt/<slug>`
- `title` / `name`：中文名 / 英文名
- `category`：必须是 `src/registry/categories.ts` 已有的 id（类型约束，写错无法通过 typecheck）
- `description`：一句话描述；卡片最多显示两行；参与搜索
- `designNotes`：3–5 条设计要点，逐条写**具体数值**（尺寸、颜色含透明度、时长、缓动曲线、交互行为）；会原样编号写进提示词，是使用者让 AI 改造时保留设计意图的唯一依据，禁止空话
- `deps`：除 `clsx`、`tailwind-merge`（自动附带）之外的依赖，如 `["motion"]`；无则 `[]`
- `file`：相对 `src/registry/components/` 的路径，如 `"text/glitch-text.tsx"`；与真实文件不一致会在构建时直接失败
- `usage`：一段可直接复制运行的用法代码（提示词与详情页「用法」选项卡共用）；用到 `lucide-react` 图标时提示词会自动附安装说明
- `tags`：3–5 个标签，显示在详情页并参与搜索（搜索范围：title、name、slug、description、tags）
- `preview`：演示节点（JSX）；演示用的文案、图标、假数据只写在这里，不进组件本体
- `previewClassName`：可选；背景类等铺满舞台的组件传 `"p-0"` 去掉舞台默认 `p-8`

`preview` 适配规则：预览舞台是容器查询上下文（`@container`），需同时适配卡片小舞台（4:3）与详情页大舞台（高 ≥420px），字号用 `@md:`、`@xl:` 变体过渡（如 `text-2xl @md:text-4xl @xl:text-6xl`）。

入场动画（挂载即播、只播一次）的组件需提供 `loop` 属性：播完停顿约 2s 后自动重播，且 `preview` 中开启 `loop`——卡片随画廊渲染、用户滚到时动画早已播完，循环才能被看到；真实使用默认关闭（参考 `SplitText`、`BlurText`、`DecryptText`）。进视口触发（`whileInView`）的组件用 `once: false` 即可，悬停触发的组件初始静态可见，都不需要 loop。

### 3. 验证

```bash
pnpm typecheck
pnpm build
pnpm dev   # 逐项检查下列清单（命令分行，兼容不支持 && 的终端）
```

- [ ] 构建后 `out/c/<slug>.html` 已生成——以 `out/` 产物判断导出成败；`next.config.ts` 丢失时构建日志仍报成功但不更新 `out/`
- [ ] 首页卡片：小舞台预览与悬停交互正常，描述两行内可读
- [ ] `/c/<slug>`：大舞台预览正常，「重播」可重放入场动画
- [ ] 「提示词」选项卡：designNotes 数值准确、源码完整、usage 可运行
- [ ] ⌘K 命令面板：用 slug / 标签 / 描述关键词都能搜到
- [ ] `/api/prompt/<slug>` 与 `/llms.txt` 已收录新条目
- [ ] 浏览器控制台无报错、无水合警告

### 新增一个分类

现有分类语义都不贴切时才新建（分类即目录，也是首页筛选与词典检索的边界），不要把组件硬塞进无关类目。

1. `src/registry/types.ts`：`CategoryId` 联合类型加新 id
2. `src/registry/categories.ts`：`categories` 数组加一条（id、中文 `label`、英文 `code`、`description`）——首页筛选按钮与 `llms.txt` 章节标题来自这里
3. 新建 `src/registry/entries/<新分类>.tsx`，导出 `xxxEntries: RegistryEntry[]`
4. `src/registry/index.ts`：import 并展开进 `registry` 数组（位置决定跑马灯区段顺序）

### 自动生效清单（不要手工维护）

详情页路由与 metadata、首页卡片与画廊筛选、⌘K 搜索、词典编号、跑马灯、前后导航、`llms.txt` 索引、`/api/prompt/<slug>`、首页统计数字。

### 提示词拼接机制（了解即可）

`lib/prompt.ts` 按「任务目标 → 前置条件（安装命令 + `cn` 函数）→ 设计要点（designNotes 逐条编号）→ 组件源码 → 使用方式 → 验收标准」拼出 Markdown；`lib/source.ts` 按 `file` 读取源码并把 `@/registry/components/**/` 导入路径改写为 `@/components/ui/`。调整提示词模板改 `lib/prompt.ts`。
