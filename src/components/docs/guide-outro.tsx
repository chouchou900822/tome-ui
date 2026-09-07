import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/site/copy-button";
import { Marquee } from "@/registry/components/effects/marquee";

interface GuideOutroProps {
  highlights: string[];
  title: string;
  description: string;
  command: string;
  copyLabel: string;
  href: string;
  linkLabel: string;
  external?: boolean;
}

export function GuideOutro({ highlights, title, description, command, copyLabel, href, linkLabel, external = false }: GuideOutroProps) {
  return (
    <section>
      <div className="border-b border-line bg-white/[0.012] py-5">
        <Marquee duration={36} gap="3rem">
          {highlights.map((highlight) => (
            <span key={highlight} className="flex items-center gap-12 text-[10px] tracking-widest text-mute">
              {highlight}<span aria-hidden className="size-1 rotate-45 bg-accent/50" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="page-shell py-14 md:py-20">
        <div className="surface-panel relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#d7ff3c08,transparent_65%)] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-12">
          <div className="max-w-xl">
            <p className="eyebrow text-accent/75">下一步，交给你创造</p>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] sm:text-3xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-mute">{description}</p>
          </div>
          <div className="mt-7 flex shrink-0 flex-wrap items-center gap-3 lg:mt-0 lg:flex-col lg:items-stretch">
            <CopyButton text={command} label={copyLabel} variant="primary" />
            <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="button-secondary text-xs">
              {linkLabel}<ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
