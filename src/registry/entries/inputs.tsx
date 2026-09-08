import { Zap } from "lucide-react";
import { ElasticSlider } from "@/registry/components/inputs/elastic-slider";
import { TierSlider } from "@/registry/components/inputs/tier-slider";
import type { RegistryEntry } from "@/registry/types";

export const inputEntries: RegistryEntry[] = [
  {
    slug: "tier-slider",
    title: "档位滑杆",
    name: "Tier Slider",
    category: "inputs",
    description: "渐变光随拖动流动、松手吸附档位的强度滑杆，拉满后进入呼吸发光。",
    designNotes: [
      "档位吸附：拖动中数值连续，松手按 Math.round(v / (100 / (档数 - 1))) 吸附到最近档位；方向键每次移动一档，Home / End 直达首尾，吸附与键盘操作触发 onChange",
      "填充色由 5 段 HSL 插值得出，从左到右渐次绚烂：石墨灰蓝 hsl(225 8% 62%) → 靛蓝 hsl(235 62% 62%) → 电光紫 hsl(275 72% 60%) → 品红 hsl(320 88% 58%) → 熔金橙 hsl(25 95% 55%)，品红到橙金跨 0° 相位时给终点补 360° 再插值",
      "填充为 90deg 线性渐变，起点取 palette(t - 0.35) 的更朴素色；background-size 锁定为滑块像素位置防止渐变被拉伸；档位高于 60% 后叠加 0–18px 同色光晕（透明度 0.35）",
      "最高档触发满档呼吸：填充、滑块、等级词同步进入 2.8s cubic-bezier(.4,0,.6,1) 无限循环呼吸，当前色相经 CSS 变量 --ts-gh 注入三处共享；16 颗 2–5.5px 星光粒子用固定种子伪随机分布，40% 档位起随强度变亮（--ts-master 控制 opacity）",
      "位置更新在 rAF 循环中以 0.18 系数向目标值缓动（拖拽跟手带惯性），拖拽时滑块放大至 1.08；CSS 动画全部包在 prefers-reduced-motion: no-preference 内，reduce 时 JS 缓动直接跳到目标值；role=slider 并以 aria-valuetext 播报档位名",
    ],
    deps: [],
    file: "inputs/tier-slider.tsx",
    usage: `import { Zap } from "lucide-react";
import { TierSlider } from "@/components/ui/tier-slider";

export function PowerControl() {
  return (
    <TierSlider
      label="5.6 Sol"
      levels={["关闭", "轻柔", "均衡", "强劲", "极致"]}
      defaultIndex={2}
      icon={<Zap className="size-5" />}
      onChange={(index) => console.log("当前档位", index)}
    />
  );
}`,
    tags: ["滑杆", "档位", "发光", "表单", "交互"],
    preview: (
      <TierSlider
        label="5.6 Sol"
        levels={["关闭", "轻柔", "均衡", "强劲", "极致"]}
        defaultIndex={2}
        icon={<Zap className="size-5" />}
      />
    ),
  },
  {
    slug: "elastic-slider",
    title: "弹性滑杆",
    name: "Elastic Slider",
    category: "inputs",
    description: "拖到端点继续拖，整条轨道被拉弯、端点被拽出，松手后弹簧拉回原位。",
    designNotes: [
      "SVG viewBox 为 320×88，轨道两端各留 40px；完整轨道与填充共用一条 5px 圆头二次贝塞尔曲线，pathLength=1 配合 strokeDasharray 按当前值显示填充",
      "过冲量由 motion 弹簧驱动（stiffness 240、damping 12、mass 0.7），松手时目标归零、轨道弹回直线，弹簧变化逐帧触发重绘",
      "端点过冲上限 30% 轨道宽，贝塞尔控制点最多上抬 33px；拖动时滑块半径 6.5px→8px、外圈 11px→14px，数值位于滑块上方 20px",
      "渐变从 #7dd3fc 到 #a5b4fc，gradientUnits=userSpaceOnUse 避免水平直线零高度导致渐变消失；只有拖动端延伸，另一端保持锚定",
      "主指针 capture 处理拖动、取消与丢失捕获；四个方向键每次 ±5，Home/End 直达 0/100；prefers-reduced-motion 时保持直线与固定滑块尺寸，键盘焦点环为 2px 天蓝 60%",
    ],
    deps: ["motion"],
    file: "inputs/elastic-slider.tsx",
    usage: `import { ElasticSlider } from "@/components/ui/elastic-slider";

export function VolumeControl() {
  return (
    <ElasticSlider
      label="音量"
      defaultValue={40}
      onChange={(value) => console.log("音量", value)}
    />
  );
}`,
    tags: ["滑杆", "弹性", "SVG", "表单", "交互"],
    preview: (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111214] p-5 @md:p-7">
        <div className="flex items-center justify-between"><span className="text-xs text-zinc-300">弹性张力</span><span className="font-mono text-[9px] tracking-[0.16em] text-zinc-500">TENSION</span></div>
        <ElasticSlider label="弹性张力" defaultValue={55} className="mx-auto my-2" />
        <p className="text-center text-[10px] text-zinc-500">在端点处继续拖动，松手回弹</p>
      </div>
    ),
  },
];
