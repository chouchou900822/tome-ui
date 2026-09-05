"use client";

import {
  Children,
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

type BeamNode = ReactElement<{ ref?: RefObject<HTMLElement | null> }>;

interface AnimatedBeamProps {
  /** 恰好两个子元素，作为光束的起点与终点节点（组件会向它们注入 ref） */
  children: ReactNode;
  /** 弧线弯曲程度（像素），正数向上拱 */
  curvature?: number;
  /** 光点沿路径一圈的时长（秒） */
  duration?: number;
  className?: string;
}

/**
 * 流动光束：一条渐变虚线弧连接两个子节点，一颗光点沿路径无限巡游。
 * 路径由两端元素的实时位置计算，ResizeObserver 跟随布局变化重算。
 */
export function AnimatedBeam({
  children,
  curvature = 60,
  duration = 3,
  className,
}: AnimatedBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLElement | null>(null);
  const toRef = useRef<HTMLElement | null>(null);
  const [d, setD] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const gradId = `beam-${useId().replace(/[:]/g, "")}`;
  const nodes = Children.toArray(children) as [BeamNode, BeamNode];

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLive(true);
  }, []);

  useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;
      const cr = container.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      const x1 = fr.left - cr.left + fr.width / 2;
      const y1 = fr.top - cr.top + fr.height / 2;
      const x2 = tr.left - cr.left + tr.width / 2;
      const y2 = tr.top - cr.top + tr.height / 2;
      const cy = Math.min(y1, y2) - curvature;
      const mx = (x1 + x2) / 2;
      setD(
        `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      );
    };

    compute();
    const observer = new ResizeObserver(compute);
    for (const el of [containerRef.current, fromRef.current, toRef.current]) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [curvature]);

  if (nodes.length !== 2) return null;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {cloneElement(nodes[0], { ref: fromRef })}
      {cloneElement(nodes[1], { ref: toRef })}
      {d ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d={d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={1.5}
            strokeOpacity={0.45}
            strokeDasharray="6 4"
          />
          <circle r={4} fill={`url(#${gradId})`}>
            {live ? <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={d} /> : null}
          </circle>
        </svg>
      ) : null}
    </div>
  );
}
