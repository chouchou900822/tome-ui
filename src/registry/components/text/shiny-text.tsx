import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  /** 一次扫光的时长（秒） */
  speed?: number;
  /** 文字底色 */
  baseColor?: string;
  /** 高光颜色 */
  shineColor?: string;
}

/**
 * 闪光文字：一道高光周期性扫过文字。纯 CSS 实现，零依赖。
 * 通过 background-clip: text 让渐变只显示在字形内部；
 * 关键帧样式借助 React 19 的 href + precedence 自动去重并提升到 head。
 */
export function ShinyText({
  text,
  className,
  speed = 3,
  baseColor = "rgba(255,255,255,0.45)",
  shineColor = "#ffffff",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent [background-size:200%_100%]",
        "motion-safe:animate-[shiny-text_3s_linear_infinite]",
        className,
      )}
      style={{
        animationDuration: `${speed}s`,
        backgroundImage: `linear-gradient(110deg, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%)`,
      }}
    >
      {text}
      <style href="shiny-text-keyframes" precedence="medium">
        {`@keyframes shiny-text{from{background-position:200% 0}to{background-position:-200% 0}}`}
      </style>
    </span>
  );
}
