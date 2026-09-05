import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  /** 光束长度（像素） */
  size?: number;
  /** 绕行一圈的时长（秒） */
  duration?: number;
  /** 边框宽度（像素） */
  borderWidth?: number;
  /** 光束起始色 */
  colorFrom?: string;
  /** 光束结束色 */
  colorTo?: string;
  /** 延迟（秒），多条光束错开时使用 */
  delay?: number;
  /** 反向绕行 */
  reverse?: boolean;
}

/**
 * 边框光束：一段渐变光沿容器边框匀速绕行。
 * 依赖 CSS offset-path: rect()，父元素需设置 relative 与 overflow-hidden，
 * 圆角通过 rounded-[inherit] 自动继承。
 */
export function BorderBeam({
  className,
  size = 64,
  duration = 6,
  borderWidth = 1.5,
  colorFrom = "#d7ff3c",
  colorTo = "#7c3aed",
  delay = 0,
  reverse = false,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-transparent",
        className,
      )}
      style={{
        borderWidth,
        maskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
        maskClip: "padding-box, border-box",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
    >
      <span
        className="absolute aspect-square motion-safe:animate-[border-beam_6s_linear_infinite]"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      />
      <style href="border-beam-keyframes" precedence="medium">
        {`@keyframes border-beam{to{offset-distance:100%}}`}
      </style>
    </div>
  );
}
