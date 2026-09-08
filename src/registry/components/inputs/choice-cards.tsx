"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  badge?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ChoiceCardsProps {
  label: string;
  options: readonly ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

/** 保留原生单选组的方向键行为与表单提交能力。 */
export function ChoiceCards({
  label, options, value, defaultValue, onValueChange, name,
  disabled = false, className,
}: ChoiceCardsProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue ?? options.find((option) => !option.disabled)?.value ?? "");
  const selected = value ?? internal;

  return (
    <fieldset disabled={disabled} className={cn("w-full min-w-0 space-y-2", disabled && "opacity-50", className)}>
      <legend className="mb-3 text-[10px] font-medium tracking-[0.12em] text-zinc-400 @md:text-xs">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={cn("group/choice block cursor-pointer", option.disabled && "cursor-not-allowed opacity-40")}>
          <input
            type="radio" name={name ?? id} value={option.value}
            checked={selected === option.value} disabled={option.disabled}
            className="peer sr-only"
            onChange={() => {
              setInternal(option.value);
              onValueChange?.(option.value);
            }}
          />
          <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#141618] px-3.5 py-3 shadow-[inset_0_1px_0_#ffffff05] peer-checked:border-[#c4d4bd]/45 peer-checked:bg-[#1c2420] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d6e6ce] motion-safe:transition-colors motion-safe:duration-200 @md:gap-4 @md:p-4">
            {option.icon && <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/3 text-[#c4d4bd]">{option.icon}</span>}
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-zinc-100 @md:text-sm">{option.label}</span>
                {option.badge && <span className="rounded border border-[#c4d4bd]/20 bg-[#c4d4bd]/8 px-1.5 py-0.5 text-[8px] text-[#d5e3cd]">{option.badge}</span>}
              </span>
              {option.description && <span className="mt-1 block text-[10px] leading-relaxed text-zinc-400 @md:text-xs">{option.description}</span>}
            </span>
            {option.meta && <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-300 @md:text-sm">{option.meta}</span>}
            <span aria-hidden className={cn(
              "grid size-4 shrink-0 place-items-center rounded-full border border-white/20",
              selected === option.value && "border-[#c4d4bd] bg-[#c4d4bd]",
            )}>
              {selected === option.value && <span className="size-1.5 rounded-full bg-[#1a241c]" />}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
