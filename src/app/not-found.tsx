import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SearchTrigger } from "@/components/site/search-trigger";
import { Ripple } from "@/registry/components/backgrounds/ripple";
import { DecryptText } from "@/registry/components/text/decrypt-text";

export default function NotFound() {
  return (
    <Ripple rings={4} speed={9} className="bg-canvas">
      <section className="page-shell relative flex min-h-[75svh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-accent/70" />暂未收录 / OFF THE INDEX</p>
        <p aria-hidden className="mt-7 font-pixel text-[clamp(7rem,18vw,14rem)] leading-none tracking-[-0.08em] text-accent/80">404</p>
        <h1 className="mt-6 text-2xl font-medium tracking-[-0.035em] sm:text-4xl"><DecryptText text="这一页，不在词典里。" className="font-sans" /></h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-mute">页面可能已被移动，或地址有一点偏差。<br />回到词典，新的灵感正在等你。</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/#gallery" className="button-primary"><ArrowLeft aria-hidden className="size-4" />返回组件词典</Link>
          <SearchTrigger className="h-11 w-auto gap-2 px-4 [&>span]:inline [&>kbd]:hidden" />
        </div>
        <Link href="/mcp" className="mt-8 inline-flex items-center gap-1.5 text-[11px] text-mute transition-colors hover:text-ink">也可以让 AI 帮你找<ArrowUpRight aria-hidden className="size-3" /></Link>
      </section>
    </Ripple>
  );
}
