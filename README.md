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

## 内置组件（16 个）

| 分类 | 组件 |
| --- | --- |
| 文字动效 | 文字显现 Text Reveal · 闪光文字 Shiny Text · 打字机 Typewriter · 解码文字 Decrypt Text |
| 按钮 | 磁吸按钮 Magnetic Button · 流光按钮 Shimmer Button |
| 卡片 | 聚光灯卡片 Spotlight Card · 3D 倾斜卡片 Tilt Card |
| 背景 | 极光背景 Aurora Background · 交互点阵 Dot Grid · 网格光束 Grid Beams |
| 特效 | 无限跑马灯 Marquee · 数字滚动 Number Ticker · 边框光束 Border Beam · 程序坞 Dock |
| 输入控件 | 档位滑杆 Tier Slider |

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

只改两个文件：组件源码（`src/registry/components/<分类>/`）与注册条目（`src/registry/entries/<分类>.tsx`），其余全部自动生效。完整规范、字段说明与验证清单见 [AGENTS.md](./AGENTS.md)。

## 部署

项目无运行时服务依赖。`pnpm build` 后可用 `pnpm start` 运行，或部署到 Vercel / Netlify / Cloudflare 等平台。部署前把 `src/lib/site.ts` 中的 `github` 改成你的仓库地址。

## 许可证

[MIT](./LICENSE)
