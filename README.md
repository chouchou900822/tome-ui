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
- **MCP 服务器**：本地 stdio 与远程 streamable-http 两种传输，AI 客户端可直接查询组件列表与提示词
- **全静态**：`next build` 产出纯静态页面，可部署到任何静态托管

## 在线体验

全部组件可在官网实时预览与交互：**https://tome-ui-seven.vercel.app/** —— 每张卡片都是真实运行的组件，悬停、滚动、点击皆可交互。

所有组件均为 React + TypeScript + Tailwind CSS v4，尊重 `prefers-reduced-motion`，只依赖 `clsx`、`tailwind-merge`，部分组件额外依赖 `motion`。

## 快速开始

使用 Node.js 22.6+，推荐与 Docker 镜像一致的 Node.js 24；包管理使用 pnpm。

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # 生产构建（全静态）
pnpm typecheck  # TypeScript 严格检查
```

构建会自动规范化 Windows 的静态路由预取文件名，保证页面跳转在普通静态托管中正常工作。

## Docker

容器内同时运行静态站点（nginx 伺服 `out/`）与 MCP 服务器（streamable-http），启动后日志打印两个访问地址：

```bash
# 方式一：直接使用 Docker Hub 镜像
docker run -d --name tome -p 3000:3000 -p 8787:8787 edisonguo/tome-ui:latest

# 方式二：本地构建镜像
docker build -t tome-ui .
docker run -d --name tome -p 3000:3000 -p 8787:8787 tome-ui
```

- 页面地址：`http://localhost:3000/`
- MCP 地址：`http://localhost:8787/mcp`（AI 客户端接入方式见下文「MCP 服务器」）
- 查看启动日志：`docker logs -f tome`
- 容器内监听端口可用环境变量 `WEB_PORT` / `MCP_PORT` 覆盖，`-p` 端口映射需同步调整

## MCP 服务器

内置一个 MCP（Model Context Protocol）服务器，把整个词典暴露给 AI 客户端，提供两个工具：

- `list_components`：列出全部组件（编号、slug、中英文名、分类、描述、标签、依赖），支持按分类与关键词过滤
- `get_component_prompt`：按 slug 返回该组件的完整 AI 提示词（目标 → 前置条件 → 设计要点 → 源码 → 用法 → 验收标准）

```bash
pnpm mcp                                             # 本地 stdio 传输（默认）
pnpm mcp:http                                        # streamable-http，默认 http://127.0.0.1:8787/mcp
pnpm mcp:http -- --host 0.0.0.0 --port 9000          # 自定义监听地址（用于远程部署）
```

在 Claude Code 中接入：

```bash
# 本地 stdio（Windows 下用 cmd /c 包装 pnpm 的 .cmd shim）
claude mcp add tome -- cmd /c pnpm mcp               # Windows
claude mcp add tome -- pnpm mcp                      # macOS / Linux

# 远程 streamable-http（服务器上 clone 仓库、pnpm install、pnpm mcp:http 后）
claude mcp add --transport http tome http://<host>:8787/mcp
```

Cursor、Windsurf 等 MCP 客户端同理配置。词典条目变动后 MCP 数据自动同步，无需任何维护。

## 技术栈

Next.js 16（App Router）· React 19 · Tailwind CSS v4 · motion · shiki · lucide-react · Geist 字体

## 项目结构

```
├── src/
│   ├── app/                    # 路由：首页、/c/[slug] 详情、/llms.txt、/api/prompt/[slug]
│   ├── components/
│   │   ├── site/               # 页头、页脚、命令面板、复制按钮
│   │   ├── home/               # 首屏、使用流程
│   │   ├── gallery/            # 筛选栏、组件卡片、预览舞台
│   │   └── detail/             # 详情页预览与代码选项卡
│   ├── lib/                    # prompt 生成、源码读取、高亮、搜索
│   ├── build/                  # 静态导出后的路由资源整理
│   └── registry/               # 词典本体
│       ├── components/<分类>/  # 组件源码（会原样写入提示词）
│       ├── entries/            # 分类注册条目；特效拆入 effects/ 子目录
│       ├── categories.ts
│       ├── types.ts
│       └── index.ts
├── mcp/                        # MCP 服务器（stdio 与 streamable-http 双传输）
│   ├── index.ts                # 入口：解析 --http / --host / --port
│   ├── server.ts               # 工具注册：list_components、get_component_prompt
│   ├── http.ts                 # 无状态 streamable-http 传输
│   └── data.ts                 # 运行时读取 registry 元数据与组件源码
└── docker/                     # 容器封装：nginx 站点配置与入口脚本（配合根目录 Dockerfile）
```

## 添加一个组件

只改两个文件：组件源码（`src/registry/components/<分类>/`）与注册条目（`src/registry/entries/<分类>.tsx`），其余全部自动生效。完整规范、字段说明与验证清单见 [AGENTS.md](./AGENTS.md)。

## 部署

站点使用全静态导出。执行 `pnpm build` 后，将 `out/` 交给静态服务器或 Vercel / Netlify / Cloudflare 等平台托管；`pnpm start` 不适用于此导出模式。Docker 镜像已包含静态服务配置。部署前可在 `src/lib/site.ts` 中调整仓库地址。

## 许可证

[MIT](./LICENSE)
