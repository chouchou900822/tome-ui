import { backgroundEntries } from "./entries/backgrounds";
import { buttonEntries } from "./entries/buttons";
import { cardEntries } from "./entries/cards";
import { effectEntries } from "./entries/effects";
import { effectMoreEntries } from "./entries/effects/additional";
import { inputEntries } from "./entries/inputs";
import { navigationEntries } from "./entries/navigation";
import { scrollEntries } from "./entries/scroll";
import { textEntries } from "./entries/text";
import { textureEntries } from "./entries/textures";
import type { CategoryId, RegistryEntry, RegistrySummary } from "./types";

export { categories, getCategory, formatIndex } from "./categories";
export type { Category, CategoryId, RegistryEntry, RegistrySummary } from "./types";

/** 词典全部条目，顺序即编号顺序 */
export const registry: readonly RegistryEntry[] = [
  ...textEntries,
  ...buttonEntries,
  ...cardEntries,
  ...scrollEntries,
  ...backgroundEntries,
  ...effectEntries,
  ...effectMoreEntries,
  ...inputEntries,
  ...navigationEntries,
  ...textureEntries,
];

export function getEntry(slug: string): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}

export function getEntryIndex(slug: string): number {
  return registry.findIndex((e) => e.slug === slug);
}

export function getEntriesByCategory(category: CategoryId): RegistryEntry[] {
  return registry.filter((e) => e.category === category);
}

/** 去掉不可序列化字段，便于作为 props 传给客户端组件 */
export function toSummary(entry: RegistryEntry): RegistrySummary {
  const { preview: _preview, previewClassName: _previewClassName, ...summary } = entry;
  return summary;
}
