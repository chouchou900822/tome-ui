import http from "node:http";
import type { ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildServer } from "./server";

export interface HttpOptions {
  host: string;
  port: number;
}

/** JSON-RPC 错误响应体 */
function rpcError(code: number, message: string): string {
  return JSON.stringify({ jsonrpc: "2.0", error: { code, message }, id: null });
}

/** 无状态模式下 GET（SSE 长连）与 DELETE（终止会话）无意义，按官方骨架直接 405 */
function rejectMethod(res: ServerResponse): void {
  res.writeHead(405, { Allow: "GET, POST, DELETE", "Content-Type": "application/json" });
  res.end(rpcError(-32000, "Method not allowed."));
}

/** 无状态 streamable-http 服务器：每个 POST 请求独立处理，不维护会话 */
export function startHttpServer({ host, port }: HttpOptions): void {
  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    if (url.pathname !== "/mcp") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(rpcError(-32000, "Not found."));
      return;
    }
    if (req.method !== "POST") {
      rejectMethod(res);
      return;
    }

    // 每请求新建一对 server + transport，响应关闭时清理，避免句柄泄漏
    const mcp = buildServer();
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // 无状态：不发也不校验 Mcp-Session-Id
        enableJsonResponse: true, // POST 回纯 JSON 而非 SSE 流，便于 curl 与代理
      });
      await mcp.connect(transport);
      // 不传 parsedBody，transport 自行读取并校验请求体与 Accept 头
      await transport.handleRequest(req, res);
      res.on("close", () => {
        transport.close();
        mcp.close();
      });
    } catch (error) {
      console.error("MCP 请求处理失败：", error);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(rpcError(-32603, "Internal error."));
      }
    }
  });

  httpServer.listen(port, host, () => {
    console.error(`Tome MCP（streamable-http）已监听 http://${host}:${port}/mcp`);
    if (host === "0.0.0.0") {
      console.error("警告：已绑定全部网卡且未启用鉴权，仅限可信网络使用。");
    }
  });
}
