import type { Category, CategoryId } from "./types";

export const categories: readonly Category[] = [
  {
    id: "text",
    label: "文字动效",
    code: "TEXT",
    description: "让标题与文案自己开口说话：显现、闪光、打字、解码。",
  },
  {
    id: "buttons",
    label: "按钮",
    code: "BUTTONS",
    description: "用户最常点击的地方，值得多一点物理感与光泽。",
  },
  {
    id: "cards",
    label: "卡片",
    code: "CARDS",
    description: "跟随鼠标的光斑与三维倾斜，让信息容器不再扁平。",
  },
  {
    id: "scroll",
    label: "滚动交互",
    code: "SCROLL",
    description: "把滚动距离变成镜头、层级与角色动作，组织连续的页面叙事。",
  },
  {
    id: "backgrounds",
    label: "背景",
    code: "BACKGROUNDS",
    description: "一层氛围，撑起整个首屏：极光、点阵与光晕。",
  },
  {
    id: "effects",
    label: "特效",
    code: "EFFECTS",
    description: "跑马灯、数字滚动、边框光束，为页面注入节律。",
  },
  {
    id: "inputs",
    label: "输入控件",
    code: "INPUTS",
    description: "滑杆、开关与旋钮，把每一次调节都变成视觉享受。",
  },
  {
    id: "navigation",
    label: "导航",
    code: "NAVIGATION",
    description: "章节、页签与路径，把每一次跳转都变成顺滑的擦洗。",
  },
  {
    id: "textures",
    label: "纹理底纹",
    code: "TEXTURES",
    description: "像素与字符铺成的数字噪声，沉在最底层的科技质感。",
  },
] as const;

export function getCategory(id: CategoryId): Category {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`未知分类：${id}`);
  return found;
}

/** 两位数编号，例如 03；放在这里供客户端组件深导入，不必经过聚合 barrel */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
