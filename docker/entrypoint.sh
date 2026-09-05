#!/bin/sh
# 容器入口：并行启动 nginx（静态站点）与 MCP（streamable-http），打印访问地址后常驻
set -eu

WEB_PORT="${WEB_PORT:-3000}"
MCP_PORT="${MCP_PORT:-8787}"

# 按环境变量生成 nginx 站点配置
sed "s/__WEB_PORT__/${WEB_PORT}/" /etc/nginx/http.d/tome.conf.template > /etc/nginx/http.d/tome.conf
rm /etc/nginx/http.d/tome.conf.template

nginx -g "daemon off;" &
NGINX_PID=$!

cd /app
./node_modules/.bin/tsx mcp/index.ts --http --host 0.0.0.0 --port "${MCP_PORT}" &
MCP_PID=$!

echo ""
echo "============================================"
echo "  Tome 组件词典已启动"
echo ""
echo "  页面地址: http://localhost:${WEB_PORT}/"
echo "  MCP  地址: http://localhost:${MCP_PORT}/mcp"
echo ""
echo "  （地址按 docker run -p <宿主端口>:<容器端口> 的映射调整）"
echo "============================================"
echo ""

# 收到终止信号时清理两个子进程
trap 'kill "${NGINX_PID}" "${MCP_PID}" 2>/dev/null || true' TERM INT

# 任一进程退出即结束容器
while kill -0 "${NGINX_PID}" 2>/dev/null && kill -0 "${MCP_PID}" 2>/dev/null; do
    sleep 1
done

echo "有进程退出，容器即将停止" >&2
