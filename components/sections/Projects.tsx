"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { ProjectsUI, Project } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ content }: { content: { ui: ProjectsUI; items: Project[] } }) {
  const { ui, items: projects } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    detailRefs.current.forEach((el) => {
      if (el) gsap.set(el, { height: 0, opacity: 0, overflow: "hidden" });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── Entrance ─────────────────────────────────────────────────────────────
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(rowsRef.current.filter(Boolean), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      // ── Mobile: scroll-triggered hover effect (no mouse on touch) ────────────
      if (window.innerWidth < 768) {
        (rowsRef.current.filter(Boolean) as HTMLDivElement[]).forEach((row) => {
          const item      = row.querySelector<HTMLElement>(".group")!;
          const h3        = item.querySelector("h3")!;
          const titleSpan = h3.querySelector("span")!;
          const underline = titleSpan.querySelector("span")!;
          const p         = item.querySelector("p")!;

          gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 65%",
              end: "bottom 35%",
              toggleActions: "play reverse play reverse",
            },
          })
          .to(h3,         { color: "var(--color-accent)", duration: 0.3, ease: "power2.out" }, 0)
          .to(titleSpan,  { y: -2,                        duration: 0.3, ease: "power2.out" }, 0)
          .to(underline,  { width: "100%",                duration: 0.5, ease: "power2.out" }, 0)
          .to(p,          { color: "var(--color-text)",   duration: 0.5, ease: "power2.out" }, 0);
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleProject = (i: number) => {
    const isOpen = openIndex === i;

    if (openIndex !== null) {
      const prevEl = detailRefs.current[openIndex];
      const prevIcon = iconRefs.current[openIndex];
      if (prevEl) gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in", overwrite: true });
      if (prevIcon) gsap.to(prevIcon, { rotate: 0, duration: 0.3, ease: "power2.out" });
    }

    if (!isOpen) {
      const el = detailRefs.current[i];
      const icon = iconRefs.current[i];
      if (el) {
        gsap.to(el, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true });
        const innerEls = el.querySelectorAll("[data-detail-item]");
        gsap.from(innerEls, {
          y: 18,
          opacity: 0,
          stagger: 0.07,
          duration: 0.45,
          ease: "power2.out",
          delay: 0.2,
        });
      }
      if (icon) gsap.to(icon, { rotate: 45, duration: 0.3, ease: "power2.out" });
    }

    setOpenIndex(isOpen ? null : i);
  };

  return (
    <section ref={sectionRef} id={ui.sectionId}>
      <div className="container-site py-24 md:py-32">

        {/* Label de secção */}
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-dim whitespace-nowrap">
            {ui.sectionLabel}
          </p>
          <div ref={dividerRef} className="flex-1 border-t border-border" />
        </div>

        {/* Lista de projectos */}
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="border-t border-border last:border-b"
            >
              {/* Conteúdo superior — número + nome + descrição + tags */}
              <div className="group flex flex-col gap-3 pt-10 md:pt-12 pb-8">
                <span className="font-mono text-label text-dim">
                  {project.number}
                </span>

                {/* Title with expanding underline */}
                <h3 className="font-display font-bold text-text leading-[1.05] tracking-tight text-[clamp(2rem,4vw,3.5rem)] transition-colors duration-300 group-hover:text-accent">
                  <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                    {project.name}
                    <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
                  </span>
                </h3>

                <p className="font-body font-light text-dim leading-[1.6] max-w-prose transition-colors duration-500 group-hover:text-text">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-label text-dim uppercase tracking-[0.12em]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dois CTAs grandes */}
              <div className="flex border-t border-border mb-10">
                {/* CTA 1 — ver projecto */}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between py-5 pr-8 border-r border-border group/link hover:text-accent transition-colors duration-300"
                >
                  <span className="font-display font-medium text-[1.25rem] text-text group-hover/link:text-accent transition-colors duration-300">
                    {ui.viewProject}
                  </span>
                  <span className="text-dim group-hover/link:text-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300 inline-block">
                    ↗
                  </span>
                </a>
                {/* CTA 2 — detalhes / fechar */}
                <button
                  onClick={() => toggleProject(i)}
                  className="flex-1 flex items-center justify-between py-5 pl-8 group/btn hover:text-accent transition-colors duration-300"
                >
                  <span className="font-display font-medium text-[1.25rem] text-text group-hover/btn:text-accent transition-colors duration-300">
                    {openIndex === i ? ui.close : ui.details}
                  </span>
                  <span
                    ref={(el) => { iconRefs.current[i] = el; }}
                    className="font-mono text-[1.25rem] text-dim group-hover/btn:text-accent transition-colors duration-300 leading-none select-none inline-block"
                  >
                    +
                  </span>
                </button>
              </div>

              {/* Painel de detalhe — controlado por GSAP */}
              <div ref={(el) => { detailRefs.current[i] = el; }}>
                <div className="pb-12 flex flex-col gap-10">

                  {/* Screenshot placeholder */}
                  <div data-detail-item className="w-full aspect-video bg-surface border border-border rounded-sm flex items-center justify-center">
                    <span className="font-mono text-label text-dim">{ui.screenshotSoon}</span>
                  </div>

                  {/* 3 colunas de detalhe */}
                  <div data-detail-item className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">{ui.whatIDid}</h4>
                      <p className="font-body font-light text-text leading-[1.75]">{project.detail.whatIDid}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">{ui.whyIDid}</h4>
                      <p className="font-body font-light text-text leading-[1.75]">{project.detail.whyIDid}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">{ui.process}</h4>
                      <p className="font-body font-light text-text leading-[1.75]">{project.detail.process}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.detail.tools.map((tool) => (
                          <span key={tool} className="font-mono text-label text-dim border border-border px-2 py-1 rounded-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA dentro da gaveta */}
                  <a
                    data-detail-item
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start flex items-center gap-6 justify-between border border-border px-8 py-5 min-w-[260px] hover:border-accent hover:bg-white/[0.03] transition-all duration-300 group/cta"
                  >
                    <span className="font-display font-medium text-[1.125rem] text-text group-hover/cta:text-accent transition-colors duration-300">
                      {ui.viewProject}
                    </span>
                    <span className="text-dim group-hover/cta:text-accent group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-all duration-300 inline-block">
                      ↗
                    </span>
                  </a>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
