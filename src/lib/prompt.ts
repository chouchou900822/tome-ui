import type { RegistrySummary } from "@/registry/types";

export interface PromptInput {
  entry: RegistrySummary;
  source: string;
}

function depsLine(deps: string[]): string {
  const all = ["clsx", "tailwind-merge", ...deps];
  return `pnpm add ${all.join(" ")}`;
}

/**
 * 生成可直接粘贴给 AI 编程助手的提示词。
 * 结构：目标 → 前置条件 → 设计要点 → 完整源码 → 用法 → 验收标准，
 * 让 AI 既能原样复制，也能在保留设计意图的前提下改造。
 */
export function buildPrompt({ entry, source }: PromptInput): string {
  const notes = entry.designNotes.map((n, i) => `${i + 1}. ${n}`).join("\n");
  const fileName = entry.file.split("/").pop() ?? entry.file;
  const usesLucide = entry.usage.includes("lucide-react");

  return `# 任务：在我的项目中实现「${entry.title}」（${entry.name}）组件

${entry.description}

## 前置条件
- 技术栈：React 18+ / TypeScript / Tailwind CSS v4${entry.deps.length ? `，额外依赖：${entry.deps.join("、")}` : "，无额外运行时依赖"}
- 安装依赖：\`${depsLine(entry.deps)}\`${usesLucide ? "\n- 用法示例中的图标来自 lucide-react（`pnpm add lucide-react`），可以换成任意 SVG 图标" : ""}
- 项目需要一个 \`cn\` 工具函数（位于 \`@/lib/utils\`）：
\`\`\`ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

## 设计要点（改造时请保留这些意图）
${notes}

## 组件源码
请把下面的代码原样写入 \`src/components/ui/${fileName}\`：

\`\`\`tsx
${source.trim()}
\`\`\`

## 使用方式
\`\`\`tsx
${entry.usage.trim()}
\`\`\`

## 验收标准
- 类型检查通过（严格模式），不使用 any 与 @ts-ignore
- 组件在深色背景上呈现效果最佳，请确保父容器为深色
- 保留源码中对 prefers-reduced-motion 的处理，不要为了简化而删掉
- 如需调整颜色、尺寸、速度，优先通过组件已暴露的 props，而不是修改内部实现
`;
}
