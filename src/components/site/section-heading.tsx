import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** 像素体分节编号，如 "01" */
  no: string;
  /** 分节标签 */
  label: string;
  title: string;
  description?: string;
  className?: string;
}

/** 宣传页分节标题：编号 + 标签 + 大标题 + 右侧描述，风格对齐首页画廊节 */
export function SectionHeading({ no, label, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
          <span className="font-pixel text-accent">{no}</span> — {label}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-mute">{description}</p>
      ) : null}
    </div>
  );
}
