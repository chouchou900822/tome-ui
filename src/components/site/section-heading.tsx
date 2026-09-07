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
    <div className={cn("mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12", className)}>
      <div>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">{no}</span><span aria-hidden className="h-px w-5 bg-white/20" />{label}
        </p>
        <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] md:text-[2.75rem]">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-sm text-sm leading-7 text-mute">{description}</p>
      ) : null}
    </div>
  );
}
