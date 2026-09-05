import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DecryptText } from "@/registry/components/text/decrypt-text";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1440px] flex-col items-start justify-center px-5 md:px-8">
      <p className="font-pixel text-7xl text-accent md:text-9xl">404</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
        <DecryptText text="这一页不在词典里" className="font-sans" />
      </h1>
      <p className="mt-4 max-w-md text-mute">它可能被移动或删除了。词典的全部条目都在首页。</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-white/20"
      >
        <ArrowLeft className="size-4" />
        回到首页
      </Link>
    </section>
  );
}
