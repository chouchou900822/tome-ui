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
        "surface-panel relative min-w-0 overflow-hidden shadow-[0_24px_80px_-30px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-white/[0.02] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex shrink-0 items-center gap-1.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/12" />
            <span className="size-2 rounded-full bg-white/8" />
          </span>
          <span className="truncate font-mono text-[10px] text-mute">{title}</span>
        </div>
        <CopyButton text={code} label="复制命令" iconOnly className="my-1 size-7" />
      </div>
      <div
        className="code-surface overflow-auto bg-black/15 text-[13px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {beam ? <BorderBeam size={80} duration={9} /> : null}
    </div>
  );
}
