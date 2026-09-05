import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/registry/components/effects/border-beam";

interface TerminalWindowProps {
  /** 顶栏标题，如 "bash" */
  title: string;
  /** 复制到剪贴板的原文 */
  code: string;
  /** shiki 渲染好的 HTML */
  html: string;
  className?: string;
  /** 是否叠加边框绕行光束 */
  beam?: boolean;
}

/** 终端窗口：macOS 圆点 + 标题 + 一键复制，主体为 shiki 高亮代码 */
export function TerminalWindow({ title, code, html, className, beam = true }: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="truncate font-mono text-[11px] text-mute">{title}</span>
        </div>
        <CopyButton text={code} label="复制命令" iconOnly className="my-1 size-7" />
      </div>
      <div
        className="code-surface overflow-auto text-[13px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {beam ? <BorderBeam size={80} duration={9} /> : null}
    </div>
  );
}
