import type { ReactNode } from "react";
import { SectionHeading } from "@/components/site/section-heading";

interface GuideSectionProps {
  id: string;
  no: string;
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function GuideSection({ id, no, label, title, description, children }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-[72px] border-b border-line">
      <div className="page-shell section-space">
        <SectionHeading no={no} label={label} title={title} description={description} />
        {children}
      </div>
    </section>
  );
}
