import { copyFile, readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

/** Next 16 在 Windows 上把路由分段写成目录；浏览器请求的名称以点号连接。 */
async function normalizeSegments(directory: string, segmentRoot?: string): Promise<number> {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const root = segmentRoot ?? (entry.name.startsWith("__next.") ? directory : undefined);
      count += await normalizeSegments(path, root);
    } else if (segmentRoot && entry.isFile() && entry.name.endsWith(".txt")) {
      const filename = relative(segmentRoot, path).split(sep).join(".");
      await copyFile(path, join(segmentRoot, filename));
      count++;
    }
  }
  return count;
}

normalizeSegments(resolve("out"))
  .then((count) => {
    process.stdout.write(count ? "已规范化 " + count + " 个静态路由预取文件。\n" : "静态路由预取文件检查通过。\n");
  })
  .catch((error: unknown) => {
    console.error("静态路由预取文件处理失败", error);
    process.exitCode = 1;
  });
