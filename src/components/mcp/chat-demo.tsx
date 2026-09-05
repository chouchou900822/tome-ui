import { Send, Wrench } from "lucide-react";
import { GlassSurface } from "@/registry/components/cards/glass-surface";
import { Typewriter } from "@/registry/components/text/typewriter";

/** 用户消息：右对齐气泡 */
function UserMsg({ text }: { text: string }) {
  return (
    <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-white/90">
      {text}
    </div>
  );
}

/** 工具调用：mono 卡片，展示工具名、入参与结果摘要 */
function ToolCall({ name, args, result }: { name: string; args: string; result: string }) {
  return (
    <div className="rounded-xl border border-line bg-black/40 px-4 py-3 font-mono text-xs leading-relaxed">
      <p className="flex items-center gap-2 text-white/80">
        <Wrench className="size-3.5 shrink-0 text-accent" />
        <span className="text-ink">{name}</span>
        <span className="text-mute">{args}</span>
      </p>
      <p className="mt-1.5 pl-5.5 text-mute">→ {result}</p>
    </div>
  );
}

/** Agent 回复：左对齐气泡，accent 勾边 */
function AgentMsg({ text }: { text: string }) {
  return (
    <div className="mr-auto max-w-[86%] rounded-2xl rounded-bl-md border border-accent/25 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-white/90">
      {text}
    </div>
  );
}

const followUps = [
  "再配一个打字机标题…",
  "把背景换成极光…",
  "注册按钮换成磁吸的…",
  "加一排数字滚动统计…",
];

/** 对话演示：一次真实的 Agent 查词典过程，底部输入栏持续打字 */
export function ChatDemo() {
  return (
    <GlassSurface className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="truncate font-mono text-[11px] text-mute">
            agent-session — tome-mcp 已连接
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          <span aria-hidden className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          live
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <UserMsg text="帮我找一个带流光边框的按钮，装到落地页注册区。" />
        <ToolCall
          name="list_components"
          args='{ "query": "按钮 流光" }'
          result="3 条匹配：shimmer-button · star-border · magnetic-button"
        />
        <ToolCall
          name="get_component_prompt"
          args='{ "slug": "shimmer-button" }'
          result="已取回设计要点与完整源码（锥形流光 3s 一圈、悬停上浮）"
        />
        <AgentMsg text="已把 ShimmerButton 装进 src/components/ui/ 并接到注册区，用法示例一并生成。还需要配一个打字机标题吗？" />
      </div>

      <div className="border-t border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2.5">
          <Typewriter className="min-w-0 flex-1 truncate text-sm text-mute" phrases={followUps} />
          <Send aria-hidden className="size-4 shrink-0 text-mute" />
        </div>
      </div>
    </GlassSurface>
  );
}
