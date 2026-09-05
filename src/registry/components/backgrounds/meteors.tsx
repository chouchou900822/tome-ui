import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  children?: ReactNode;
  className?: string;
  /** 流星数量 */
  count?: number;
}

/** 确定性伪随机：同一索引在服务端与客户端得到同一序列，保证水合一致 */
const seeded = (i: number, salt: number): number => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const meteorStyle = (i: number): CSSProperties => ({
  top: `${Math.floor(seeded(i, 1) * 55)}%`,
  left: `${Math.floor(seeded(i, 2) * 100)}%`,
  animationDelay: `${(seeded(i, 3) * 4).toFixed(2)}s`,
  animationDuration: `${(3.5 + seeded(i, 4) * 3).toFixed(2)}s`,
});

/**
 * 流星雨：若干细长光条从右上向左下划过，头亮尾散、错峰坠落。
 * 纯 CSS 关键帧，位置由索引确定性派生，服务端与客户端渲染一致。
 */
export function Meteors({ children, className, count = 14 }: MeteorsProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0b0b0d]", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="meteors-fall pointer-events-none absolute h-px w-[120px] rounded-full bg-gradient-to-r from-white/70 to-transparent opacity-0"
          style={meteorStyle(i)}
        >
          <span className="absolute -left-0.5 top-1/2 size-[3px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.35)]" />
        </span>
      ))}
      <div className="relative">{children}</div>
      <style href="meteors-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .meteors-fall { animation: meteors-fall linear infinite backwards; }
}
@keyframes meteors-fall {
  0% { transform: rotate(215deg) translateX(0); opacity: 0; }
  15% { opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-480px); opacity: 0; }
}`}
      </style>
    </div>
  );
}
