"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SoftSwitchProps {
  label: string;
  description?: string;
  icon?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** 原生复选框保留表单与键盘行为，柔光只随状态变化。 */
export function SoftSwitch({
  label, description, icon, checked, defaultChecked = false,
  onCheckedChange, disabled = false, name, className,
}: SoftSwitchProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultChecked);
  const active = checked ?? internal;

  return (
    <label className={cn(
      "relative flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#151719] p-4 shadow-[inset_0_1px_0_#ffffff08] @md:gap-4 @md:p-5",
      disabled && "cursor-not-allowed opacity-45", className,
    )}>
      <input
        id={id} type="checkbox" role="switch" name={name} checked={active}
        disabled={disabled} aria-label={label}
        aria-describedby={description ? `${id}-description` : undefined}
        className="peer sr-only"
        onChange={(event) => {
          setInternal(event.target.checked);
          onCheckedChange?.(event.target.checked);
        }}
      />
      {icon && <span aria-hidden className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/4 text-zinc-500 motion-safe:transition-colors motion-safe:duration-300",
        active && "border-emerald-200/15 bg-emerald-200/8 text-emerald-200",
      )}>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-zinc-100 @md:text-sm">{label}</span>
        {description && <span id={`${id}-description`} className="mt-1 block text-[10px] leading-relaxed text-zinc-400 @md:text-xs">{description}</span>}
      </span>
      <span aria-hidden className={cn(
        "relative h-8 w-14 shrink-0 rounded-full border border-white/10 bg-black/35 p-1 shadow-[inset_0_2px_5px_#0008] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-emerald-200 motion-safe:transition-colors motion-safe:duration-300",
        active && "border-emerald-200/25 bg-emerald-200/20 shadow-[inset_0_2px_5px_#0005,0_0_20px_#a7f3d015]",
      )}>
        <span className={cn(
          "grid size-[22px] place-items-center rounded-full bg-linear-to-b from-[#f0f1ee] to-[#aaaeab] shadow-[0_2px_4px_#0006,inset_0_1px_1px_#fff] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          active && "translate-x-6",
        )}>
          <span className={cn("h-1.5 w-0.5 rounded-full bg-zinc-600", active && "bg-emerald-900")} />
        </span>
      </span>
    </label>
  );
}
