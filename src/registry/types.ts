import type { ReactNode } from "react";

export type CategoryId =
  | "text"
  | "buttons"
  | "cards"
  | "scroll"
  | "backgrounds"
  | "effects"
  | "inputs"
  | "navigation"
  | "textures"
  | "feedback";

export interface Category {
  id: CategoryId;
  /** 中文名称 */
  label: string;
  /** 英文标识，用于装饰性排版 */
  code: string;
  description: string;
}

/** 注册表条目：一个组件的全部元数据 */
export interface RegistryEntry {
  /** URL 中使用的唯一标识 */
  slug: string;
  /** 中文名称 */
  title: string;
  /** 英文名称 */
  name: string;
  category: CategoryId;
  /** 一句话描述 */
  description: string;
  /** 设计要点，会写入提示词 */
  designNotes: string[];
  /** 除 react / tailwind 之外的额外 npm 依赖 */
  deps: string[];
  /** 组件源文件路径，相对于 src/registry/components */
  file: string;
  /** 使用示例代码 */
  usage: string;
  tags: string[];
  /** 演示节点，在卡片与详情页中渲染 */
  preview: ReactNode;
  /** 预览容器额外类名，例如背景类组件需要去掉内边距 */
  previewClassName?: string;
}

/** 可安全传给客户端组件的序列化子集（去掉 ReactNode） */
export type RegistrySummary = Omit<RegistryEntry, "preview" | "previewClassName">;
