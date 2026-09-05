"use client";

import { useEffect, useRef, useState, type PointerEvent, type UIEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollMascotProps {
  messages?: string[];
  color?: string;
  className?: string;
}

const defaultMessages = ["嗨，我会看向你的光标。", "继续滚动，我也会跟上。", "到站啦，下次见！"];

export function ScrollMascot({
  messages = defaultMessages,
  color = "#a3e635",
  className,
}: ScrollMascotProps) {
  const content = messages.length > 0 ? messages : defaultMessages;
  const [activeIndex, setActiveIndex] = useState(0);
  const lastScroll = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const scrollTilt = useMotionValue(0);
  const scrollLift = useMotionValue(-12);
  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 18, mass: 0.45 });
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 18, mass: 0.45 });
  const smoothTilt = useSpring(scrollTilt, { stiffness: 150, damping: 14, mass: 0.5 });
  const smoothLift = useSpring(scrollLift, { stiffness: 120, damping: 18, mass: 0.6 });
  const eyeX = useTransform(smoothX, [-18, 18], [-4, 4]);
  const eyeY = useTransform(smoothY, [-14, 14], [-3, 3]);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    [],
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 36);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 28);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const progress = maxScroll > 0 ? viewport.scrollTop / maxScroll : 0;
    const nextIndex = Math.min(content.length - 1, Math.round(progress * (content.length - 1)));

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    if (reduceMotion) return;

    const delta = viewport.scrollTop - lastScroll.current;
    lastScroll.current = viewport.scrollTop;
    scrollTilt.set(Math.max(-10, Math.min(10, delta * 0.45)));
    scrollLift.set(-12 + progress * 24);

    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => scrollTilt.set(0), 120);
  }

  return (
    <div
      className={cn(
        "relative h-full min-h-64 w-full overflow-hidden bg-[#0b0b0d] text-white",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="滚动并移动光标与 IP 角色互动"
      >
        <div className="sticky top-0 flex h-full items-center justify-center overflow-hidden px-5 @md:px-10">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_28%_45%,rgba(163,230,53,0.10),transparent_36%),linear-gradient(145deg,#151518,#09090b)]" />
          <div className="relative grid w-full max-w-3xl grid-cols-[0.9fr_1.1fr] items-center gap-3 @md:gap-10">
            <motion.div
              aria-hidden
              className="mx-auto w-28 @md:w-40"
              style={reduceMotion ? undefined : { y: smoothLift, rotate: smoothTilt }}
            >
              <motion.div style={reduceMotion ? undefined : { x: smoothX, y: smoothY }}>
                <svg viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80 28V12" stroke="white" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="80" cy="9" r="7" fill={color} />
                  <path
                    d="M32 74C32 43.072 53.49 27 80 27C106.51 27 128 43.072 128 74V139C128 159.987 110.987 177 90 177H70C49.013 177 32 159.987 32 139V74Z"
                    fill={color}
                  />
                  <path d="M43 80C43 58.46 59.118 43 80 43C100.882 43 117 58.46 117 80V112H43V80Z" fill="#17171a" />
                  <motion.g style={reduceMotion ? undefined : { x: eyeX, y: eyeY }}>
                    <ellipse cx="65" cy="80" rx="7" ry="10" fill="white" />
                    <ellipse cx="95" cy="80" rx="7" ry="10" fill="white" />
                    <circle cx="67" cy="82" r="3" fill="#17171a" />
                    <circle cx="97" cy="82" r="3" fill="#17171a" />
                  </motion.g>
                  <path d="M68 99C74.5 104 85.5 104 92 99" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
                  <path d="M32 91L18 113" stroke={color} strokeWidth="12" strokeLinecap="round" />
                  <path d="M128 91L142 113" stroke={color} strokeWidth="12" strokeLinecap="round" />
                  <ellipse cx="80" cy="180" rx="42" ry="6" fill="black" fillOpacity="0.32" />
                </svg>
              </motion.div>
            </motion.div>

            <div className="relative min-h-28">
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Companion 0{activeIndex + 1}</p>
              <p className="mt-3 text-lg font-medium leading-tight tracking-[-0.03em] @md:text-3xl">
                {content[activeIndex]}
              </p>
              <div className="mt-5 flex gap-1.5">
                {content.map((message, index) => (
                  <span
                    key={message}
                    className={cn(
                      "h-1 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none",
                      index === activeIndex ? "w-7 bg-white" : "w-2 bg-white/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="pointer-events-none absolute bottom-5 right-5 text-[9px] uppercase tracking-[0.24em] text-white/30">
            Move + scroll
          </p>
        </div>
        <div aria-hidden style={{ height: `${Math.max(210, content.length * 75)}%` }} />
      </div>
    </div>
  );
}
