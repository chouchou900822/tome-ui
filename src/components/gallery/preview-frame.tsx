import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  children: ReactNode;
  className?: string;
  /** 覆盖内边距等布局类，背景类组件会传入 p-0 */
  contentClassName?: string;
}

/**
 * 组件演示的统一舞台：深色底、细网格、容器查询上下文。
 * 演示节点可以用 @md: / @xl: 变体随舞台大小自适应。
 */
export function PreviewFrame({ children, className, contentClassName }: PreviewFrameProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-[#0b0b0d] @container",
        "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.045)_1px,transparent_1.5px)] bg-[size:20px_20px]",
        className,
      )}
    >
      <div className={cn("absolute inset-0 flex items-center justify-center p-8", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
