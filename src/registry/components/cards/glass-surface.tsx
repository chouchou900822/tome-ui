import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
}

/** 极细噪点贴图：feTurbulence 生成，平铺叠加在玻璃面上消除纯净感 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * 玻璃面板：毛玻璃底、顶部光泽、边缘内高光与细噪点四层叠出的厚度感，
 * 静态无动画，适合做内容容器的基底质感。
 */
export function GlassSurface({ children, className }: GlassSurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.08), transparent 50%), linear-gradient(to bottom, rgba(255,255,255,0.05), transparent 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_24px_rgba(255,255,255,0.03)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
