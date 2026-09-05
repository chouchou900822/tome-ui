"use client";

import { useEffect, useState } from "react";

/**
 * 监听一组节锚点，返回当前处于激活带（header 下方到视口中线）的节 id。
 * keep-last 规则：节间隙或快速滚动时不闪回 null，保持上一个激活节。
 */
export function useSectionSpy(ids: readonly string[], headerOffset = 88): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0 || typeof IntersectionObserver === "undefined") {
      setActive(null);
      return;
    }

    const visible = new Set<string>();
    let prev: string | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const next = ids.find((id) => visible.has(id)) ?? prev;
        prev = next;
        setActive(next);
      },
      { rootMargin: `-${headerOffset}px 0px -55% 0px` },
    );

    for (const id of ids) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [ids, headerOffset]);

  return active;
}
