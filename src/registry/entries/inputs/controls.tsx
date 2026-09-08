import { AudioLines, Bell } from "lucide-react";
import { RotaryDial } from "@/registry/components/inputs/rotary-dial";
import { SoftSwitch } from "@/registry/components/inputs/soft-switch";
import type { RegistryEntry } from "@/registry/types";

export const controlEntries: RegistryEntry[] = [
  {
    slug: "soft-switch",
    title: "柔光开关",
    name: "Soft Switch",
    category: "inputs",
    description: "金属拨钮沿凹槽轻滑，柔和绿光回应状态，让设置页也有细腻触感。",
    designNotes: [
      "容器使用 #151719 底色、16px 圆角、1px 白色 10% 边框，内边距从 16px 过渡到大舞台的 20px",
      "轨道 56×32px，22px 拨钮用 #f0f1ee 到 #aaaeab 的垂直渐变和 1px 内高光模拟金属；开启后横向移动 24px",
      "开启轨道为 emerald-200 的 20% 填充、25% 边框与 20px 外柔光；状态过渡 300ms，位移曲线 cubic-bezier(0.22,1,0.36,1)",
      "使用 1 个原生 checkbox 与 role=switch，支持空格、整行点击、name 表单提交，以及 checked / defaultChecked 两种状态模式",
      "disabled 时整体透明度 45%，焦点环 2px、偏移 4px；prefers-reduced-motion 下取消 300ms 过渡，状态立即到位",
    ],
    deps: [],
    file: "inputs/soft-switch.tsx",
    tags: ["开关", "设置", "表单", "柔光", "无障碍"],
    usage: `import { Bell } from "lucide-react";
import { SoftSwitch } from "@/components/ui/soft-switch";

export function NotificationSetting() {
  return (
    <SoftSwitch label="桌面通知" description="只在重要时刻提醒你"
      name="notifications" defaultChecked icon={<Bell className="size-4" />}
      className="max-w-sm" />
  );
}`,
    preview: (
      <div className="w-full max-w-sm space-y-2.5 @md:space-y-3">
        <div className="mb-4 hidden items-center justify-between px-1 text-[9px] text-zinc-500 @md:flex"><span>让工作保持心流</span><span className="font-mono tracking-widest">PREFERENCES</span></div>
        <SoftSwitch label="专注音景" description="把环境留在背景里" defaultChecked icon={<AudioLines className="size-4" />} />
        <SoftSwitch label="轻声提醒" description="只为重要的事打断" icon={<Bell className="size-4" />} />
      </div>
    ),
    previewClassName: "px-4 pb-3 pt-11 @md:p-8",
  },
  {
    slug: "rotary-dial",
    title: "刻度旋钮",
    name: "Rotary Dial",
    category: "inputs",
    description: "拉丝金属旋钮与细密刻度，把音量、强度和参数调节变成模拟设备的手感。",
    designNotes: [
      "旋钮舞台为 128px、大舞台为 176px，41 根刻度分布在 -135° 到 135° 的 270° 圆弧上；每 5 格用 10px 长刻度，其余为 6px",
      "指针色 #e0efcb，叠 8px 的 #d5f4a9 50% 柔光；金属外圈用锥形渐变，内盘为 #414640 到 #1a1e1b 的径向渐变",
      "上下拖动 160px 对应整个 min/max 区间，按 step 吸附；方向键每次增减 1 个步长，Home / End 跳到边界",
      "支持受控 value 与非受控 defaultValue，name 可提交表单；刻度坐标保留 4 位小数避免水合偏差，role=slider 播报范围、数值、单位与方向",
      "拖动时即时跟手，键盘调节时旋转过渡 150ms；prefers-reduced-motion 下直接定位，禁用时透明度 45% 且不接收操作",
    ],
    deps: [],
    file: "inputs/rotary-dial.tsx",
    tags: ["旋钮", "音量", "参数", "拟物", "键盘"],
    usage: `import { RotaryDial } from "@/components/ui/rotary-dial";

export function GainControl() {
  return <RotaryDial label="输出增益" min={-24} max={12} step={0.5}
    defaultValue={-6} unit="dB" name="gain" />;
}`,
    preview: (
      <div className="flex w-full max-w-xs flex-col items-center">
        <RotaryDial label="输出增益 / OUTPUT" min={-24} max={12} step={0.5} defaultValue={-6} unit="dB" />
        <p className="mt-3 text-[9px] tracking-wide text-zinc-500 @md:mt-5">上下拖动，找回旋钮的手感</p>
      </div>
    ),
    previewClassName: "p-3 @md:p-8",
  },
];
