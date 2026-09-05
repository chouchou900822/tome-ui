import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { startHttpServer } from "./http";
import { buildServer } from "./server";

interface CliOptions {
  http: boolean;
  port: number;
  host: string;
}

/** 极简 argv 解析：支持 --http、--port <n>、--host <h>，不引额外依赖 */
function parseArgs(argv: string[]): CliOptions {
  const value = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    const next = i >= 0 ? argv[i + 1] : undefined;
    return next && !next.startsWith("--") ? next : undefined;
  };
  return {
    http: argv.includes("--http"),
    port: Number(value("--port") ?? 8787),
    host: value("--host") ?? "127.0.0.1",
  };
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.http) {
    startHttpServer(opts);
    return;
  }
  // stdio 模式：stdout 是协议通道，日志只能走 stderr
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tome MCP（stdio）已启动");
}

main().catch((error: unknown) => {
  console.error("启动失败：", error);
  process.exit(1);
});
