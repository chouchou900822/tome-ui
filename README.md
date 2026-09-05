# Tome · 面向 AI Vibe Coding 的前端组件词典

> 复制一段提示词，得到一个惊艳的组件。

Tome（意为「典籍」）是一个开源的「组件词典」。每个组件都附带一段精心编写的 AI 提示词，提示词里同时包含**设计要点、完整源码和用法示例**。把它粘贴给 Cursor、Claude Code、Windsurf 或 v0，AI 就能在你的项目里复现同样的效果——没有前端基础的人也能快速做出好看的界面。

站点本身就是用词典里的组件搭出来的：点阵背景、文字显现、磁吸按钮、流光按钮、数字滚动、跑马灯。

## 功能

- **实时预览**：每张卡片都是真实运行的组件，悬停、滚动、点击都可交互
- **一键复制提示词**：卡片右下角与详情页均可复制，提示词结构为「目标 → 前置条件 → 设计要点 → 源码 → 用法 → 验收标准」
- **源码 / 用法选项卡**：shiki 服务端高亮，客户端零开销
- **⌘K 命令面板**：按名称、描述、标签模糊搜索，方向键选择，回车跳转
- **分类筛选**：与 URL 同步（`/?category=text`），可直接分享
- **给 AI 用的接口**：`/llms.txt` 索引全部组件；`/api/prompt/{slug}` 直接返回 Markdown 提示词，AI 代理或 `curl` 都能拉取
- **全静态**：`next build` 产出纯静态页面，可部署到任何静态托管

## 内置组件（15 个）

| 分类 | 组件 |
| --- | --- |
| 文字动效 | 文字显现 Text Reveal · 闪光文字 Shiny Text · 打字机 Typewriter · 解码文字 Decrypt Text |
| 按钮 | 磁吸按钮 Magnetic Button · 流光按钮 Shimmer Button |
| 卡片 | 聚光灯卡片 Spotlight Card · 3D 倾斜卡片 Tilt Card |
| 背景 | 极光背景 Aurora Background · 交互点阵 Dot Grid · 网格光束 Grid Beams |
| 特效 | 无限跑马灯 Marquee · 数字滚动 Number Ticker · 边框光束 Border Beam · 程序坞 Dock |

所有组件均为 React + TypeScript + Tailwind CSS v4，尊重 `prefers-reduced-motion`，只依赖 `clsx`、`tailwind-merge`，部分组件额外依赖 `motion`。

## 快速开始

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # 生产构建（全静态）
pnpm typecheck  # TypeScript 严格检查
```

## 技术栈

Next.js 16（App Router）· React 19 · Tailwind CSS v4 · motion · shiki · lucide-react · Geist 字体

## 项目结构

```
src/
├── app/                    # 路由：首页、/c/[slug] 详情、/llms.txt、/api/prompt/[slug]
├── components/
│   ├── site/               # 页头、页脚、命令面板、复制按钮
│   ├── home/               # 首屏、使用流程
│   ├── gallery/            # 筛选栏、组件卡片、预览舞台
│   └── detail/             # 详情页预览与代码选项卡
├── lib/                    # prompt 生成、源码读取、高亮、搜索
└── registry/               # 词典本体
    ├── components/<分类>/  # 组件源码（会原样写入提示词）
    ├── entries/<分类>.tsx  # 元数据、设计要点、用法、演示节点
    ├── categories.ts
    ├── types.ts
    └── index.ts
```

## 添加一个组件

添加一个组件只涉及两个文件：**组件本体**（源码）与**注册条目**（元数据）。其余全部自动生效。以下是完整步骤，按顺序做完即可，没有隐藏步骤。

### 第 1 步：编写组件源码

在 `src/registry/components/<分类>/` 下新建文件，文件名用 kebab-case 并与 `slug` 一致（例如 `glitch-text.tsx`）。这个文件会被 `lib/source.ts` 原样读出、拼进提示词，所以它必须是**完全自包含**的——使用者只会拿到这一个文件加一个 `cn` 函数。必须遵守：

- **允许的依赖**：`@/lib/utils` 的 `cn`、Tailwind 类名、`motion`（导入路径 `motion/react`）。不要引入其他库，不要 import 项目里其他文件
- **客户端指令**：组件内用到了 hooks（`useState` / `useEffect` / motion 的 hooks / 浏览器 API）时，文件第一行加 `"use client"`；纯 CSS 动画的组件（如 Marquee、BorderBeam）不需要
- **TypeScript 严格模式**：显式的 props `interface`，不使用 `any` 与 `@ts-ignore`；可交互元素导出为具名函数（`export function GlitchText`），与条目的 `name` 对应
- **动画与可访问性**：
  - CSS 动画加 `motion-safe:` 前缀（`prefers-reduced-motion` 时自动禁用）
  - JS 驱动的动画用 `useReducedMotion()` 提前返回
  - 装饰层加 `aria-hidden`，拆分文本的组件外层保留 `aria-label` 完整文本
- **关键帧样式内联**：`<style href="glitch-keyframes" precedence="medium">{'@keyframes …'}</style>`，`href` 全站唯一（建议 `<slug>-keyframes`）。React 19 会自动去重并提升到 `<head>`，因此**不要**把关键帧写进 `globals.css`
- **水合安全**：服务端首帧与客户端首帧必须一致。随机性只能在 `useEffect` 之后发生（参考 `DecryptText`：先渲染最终文本，挂载后才播放乱码）；同理不要在渲染路径上读 `window`
- **视觉效果按深色背景调校**：预览舞台是 `#0b0b0d` 深色，组件默认配色在深色上应达到最佳状态
- **体积与命名**：单文件不超过 300 行；若某分类目录已接近 8 个文件，先按下面的「新增分类」整理再继续

### 第 2 步：追加注册条目

在 `src/registry/entries/<分类>.tsx` 的数组**末尾**追加一个 `RegistryEntry` 对象（数组顺序即词典编号 No.XX、首页跑马灯顺序与「上一个/下一个」导航顺序）。每个字段的用途与要求：

| 字段 | 说明 |
| --- | --- |
| `slug` | URL 标识，kebab-case 英文，全站唯一，决定 `/c/<slug>` 与 `/api/prompt/<slug>` |
| `title` / `name` | 中文名（卡片与详情页标题）/ 英文名（标题旁的灰色小字、命令面板） |
| `category` | 必须是 `src/registry/categories.ts` 里已有的分类 id，写错会通过不了类型检查 |
| `description` | 一句话描述，出现在卡片（最多显示两行）、详情页、`llms.txt` 与搜索匹配范围里 |
| `designNotes` | **3～5 条设计要点，会被原样编号写进 AI 提示词**，是使用者让 AI 改造时保留设计意图的唯一依据。每条写具体数值：尺寸、颜色（含透明度）、时长、缓动曲线、交互行为，不要写「好看的动画」这类空话 |
| `deps` | 除 `clsx`、`tailwind-merge`（这两个会自动带上）之外的 npm 依赖，如 `["motion"]`；会进入提示词的安装命令，没有就写 `[]` |
| `file` | 相对 `src/registry/components/` 的路径，如 `"text/glitch-text.tsx"`。**必须与真实文件一致**——构建时按它读源码，路径错误会直接构建失败 |
| `usage` | 一段可直接复制运行的用法代码（提示词的「使用方式」与详情页「用法」选项卡都用它）。若用到 `lucide-react` 图标，提示词会自动附加安装说明 |
| `tags` | 3～5 个标签，显示在详情页并参与搜索匹配（搜索范围：title、name、slug、description、tags） |
| `preview` | 演示节点（JSX）。**演示用的文案、图标、假数据都写在这里**，不要混进组件本体 |
| `previewClassName` | 可选。背景类等需要铺满舞台的组件传 `"p-0"`，去掉预览舞台默认的 `p-8` 内边距 |

`preview` 的适配规则：预览舞台是容器查询上下文（`@container`），同一份演示要在**卡片（约 4:3 的小舞台）和详情页（≥420px 高的大舞台）都好看**，字号等用 `@md:`、`@xl:` 变体过渡（如 `text-2xl @md:text-4xl @xl:text-6xl`）。背景类组件的 preview 自行 `absolute inset-0` 铺满。

### 第 3 步：验证

```bash
pnpm typecheck   # 类型检查（严格模式）
pnpm build       # 生产构建，静态页面数应 +1
pnpm dev         # 本地打开逐项检查
```

本地检查清单：

- [ ] 首页卡片：预览在小舞台正常、悬停交互正常、描述没有截断得看不懂
- [ ] 点进 `/c/<slug>`：大舞台预览正常，「重播」按钮能让入场动画重放
- [ ] 「提示词」选项卡：读一遍生成结果，确认 designNotes 数值准确、源码完整、用法可运行
- [ ] 命令面板（⌘K）：用 slug / 标签 / 描述里的词都能搜到
- [ ] `curl localhost:3000/api/prompt/<slug>` 或打开 `/llms.txt` 确认新条目已收录
- [ ] 控制台无报错、无水合警告（Hydration Warning）

### 自动生效，不需要改任何其他文件

条目注册后，以下全部由代码自动派生：详情页路由与 metadata、首页卡片与画廊筛选、⌘K 搜索、编号 No.XX、跑马灯、「上一个/下一个」导航、`llms.txt` 索引、`/api/prompt/<slug>` 接口、首页统计数字。

### 新增一个分类

当现有五个分类（text / buttons / cards / backgrounds / effects）都不合适时：

1. `src/registry/types.ts`：在 `CategoryId` 联合类型中加新 id
2. `src/registry/categories.ts`：在 `categories` 数组中加一条（id、中文名 `label`、装饰用英文 `code`、一句话 `description`，首页筛选与 `llms.txt` 的章节标题都来自这里）
3. 新建 `src/registry/entries/<新分类>.tsx`，导出 `xxxEntries: RegistryEntry[]`（分类为空时也保持文件存在）
4. `src/registry/index.ts`：import 并展开进 `registry` 数组——它在数组中的位置决定该分类在跑马灯里的区段顺序

### 提示词是如何拼出来的（了解即可）

`lib/prompt.ts` 按「任务目标 → 前置条件（依赖安装命令、`cn` 函数代码）→ 设计要点（`designNotes` 逐条编号）→ 组件源码（`lib/source.ts` 按 `file` 读取，并把 `@/registry/components/**/` 导入路径改写为 `@/components/ui/`）→ 使用方式（`usage`）→ 验收标准」拼出 Markdown。改这个文件可以调整所有提示词的模板。

## 部署

项目无运行时服务依赖。`pnpm build` 后可用 `pnpm start` 运行，或部署到 Vercel / Netlify / Cloudflare 等平台。部署前把 `src/lib/site.ts` 中的 `github` 改成你的仓库地址。

## 许可证

[MIT](./LICENSE)
