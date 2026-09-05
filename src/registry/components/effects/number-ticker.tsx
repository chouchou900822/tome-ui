"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  /** 目标数值 */
  value: number;
  className?: string;
  /** 动画时长（秒） */
  duration?: number;
  /** 小数位数 */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** 数字格式化使用的区域，控制千分位等 */
  locale?: string;
  /** 进入视口后再延迟多少秒开始 */
  delay?: number;
}

/**
 * 数字滚动：进入视口后从 0 平滑增长到目标值，使用等宽数字避免抖动。
 * 服务端渲染最终值以利于 SEO，客户端挂载后再从 0 开始播放。
 */
export function NumberTicker({
  value,
  className,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "zh-CN",
  delay = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    setCurrent(0);
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, delay, reduce]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(current);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
