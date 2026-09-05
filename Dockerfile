# 语法提示（需 BuildKit，Docker 23+ 默认开启）
# 单阶段镜像：MCP 运行时依赖完整 src/ 与全量 node_modules（tsx 为 devDep，
# registry entries 运行时被 import，含 JSX 与 lucide-react/motion），拆多阶段省不掉体积，从简。

FROM node:24-alpine

# nginx 伺服 Next 静态导出站点；node + tsx 跑 MCP 服务器
RUN apk add --no-cache nginx

WORKDIR /app

# corepack 按 packageManager 字段激活 pnpm@10.31.0
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV NEXT_TELEMETRY_DISABLED=1

# 先装依赖：仅 package.json / lockfile 变动才重装，pnpm store 走构建缓存
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# 源码：src 供 MCP 运行时读取，out/ 在容器内构建生成
COPY tsconfig.json next.config.ts postcss.config.mjs ./
COPY src ./src
COPY public ./public
COPY mcp ./mcp
RUN pnpm build && rm -rf .next

# nginx 站点配置模板与容器入口脚本
COPY docker/nginx.conf /etc/nginx/http.d/tome.conf.template
COPY docker/entrypoint.sh /entrypoint.sh
# 防 Windows checkout 出现 CRLF 导致脚本无法执行
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# 页面 3000 / MCP 8787（容器内端口，可由 WEB_PORT / MCP_PORT 环境变量覆盖）
EXPOSE 3000 8787

ENTRYPOINT ["/entrypoint.sh"]
