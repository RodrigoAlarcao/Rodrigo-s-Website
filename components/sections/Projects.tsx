"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    name: "EcoReport",
    description: "Ferramenta de relatórios de sustentabilidade para empresas — da recolha de dados ao relatório final, sem fricção.",
    tags: ["Product Design", "AI Engineering"],
    url: "https://ecoreport.pt",
    urlLabel: "ecoreport.pt",
    detail: {
      whatIDid: "Ferramenta de relatórios de sustentabilidade que transforma dados complexos em relatórios estruturados para empresas. Input guiado, geração automática, exportação pronta a publicar.",
      whyIDid: "As empresas têm obrigação crescente de reportar sustentabilidade — mas os processos existentes são caros, lentos e exigem consultoras. Vi uma oportunidade de tornar isso acessível.",
      process: "Começou com um problema real de um cliente. UX no Figma primeiro — fluxos, estrutura de informação. Implementação com Claude Code + Next.js. MVP em menos de uma semana.",
      tools: ["Claude Code", "Next.js", "Figma"],
    },
  },
  {
    number: "02",
    name: "Palco Democrático",
    description: "Plataforma cívica que aproxima cidadãos da política local. Construída para tornar a participação democrática mais acessível.",
    tags: ["Product Design", "Vibe Coding"],
    url: "https://palcodemocratico.pt",
    urlLabel: "palcodemocratico.pt",
    detail: {
      whatIDid: "Plataforma cívica que aproxima cidadãos da política local — propostas, votação, debate estruturado entre eleitores e decisores.",
      whyIDid: "A distância entre cidadãos e decisores é um problema de design, não de falta de interesse. Se a participação fosse tão simples como usar uma app, mais pessoas participariam.",
      process: "Product design first — mapeei os fluxos de participação antes de escrever uma linha de código. Arquitetura no Figma, desenvolvimento com Claude Code + Cursor + Next.js.",
      tools: ["Claude Code", "Cursor", "Next.js", "Figma"],
    },
  },
  {
    number: "03",
    name: "LONA",
    description: "Arte que torna marcas inesquecíveis. Liga marcas a artistas para criar obras permanentes com impacto real.",
    tags: ["Product Design", "AI Engineering", "Vibe Coding"],
    url: "https://lona-kt9z38xp0-rodrigos-projects-578d09b9.vercel.app",
    urlLabel: "lona.vercel.app",
    detail: {
      whatIDid: "Plataforma que liga marcas a artistas para criar obras permanentes em espaços físicos — arte como ferramenta de marketing com impacto real e duradouro.",
      whyIDid: "O marketing tradicional não deixa marca. Uma obra de arte permanente no espaço de uma empresa gera conversas, cobertura mediática e identidade genuína. Quis construir a infra para isso acontecer.",
      process: "O mais complexo dos três — dois produtos (LONA Street + LONA Install), roster de artistas, processo de matching marca-artista. Design system no Figma, desenvolvimento com Claude Code + Cursor + Next.js.",
      tools: ["Claude Code", "Cursor", "Next.js", "Figma"],
    },
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Colapsar todos os painéis de detalhe no início
    detailRefs.current.forEach((el) => {
      if (el) gsap.set(el, { height: 0, opacity: 0, overflow: "hidden" });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(rowsRef.current.filter(Boolean), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleProject = (i: number) => {
    const isOpen = openIndex === i;

    // Fechar painel aberto anteriormente
    if (openIndex !== null) {
      const prevEl = detailRefs.current[openIndex];
      const prevIcon = iconRefs.current[openIndex];
      if (prevEl) gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in", overwrite: true });
      if (prevIcon) gsap.to(prevIcon, { rotate: 0, duration: 0.3, ease: "power2.out" });
    }

    if (!isOpen) {
      // Abrir novo painel
      const el = detailRefs.current[i];
      const icon = iconRefs.current[i];
      if (el) gsap.to(el, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true });
      if (icon) gsap.to(icon, { rotate: 45, duration: 0.3, ease: "power2.out" });
    }

    setOpenIndex(isOpen ? null : i);
  };

  return (
    <section ref={sectionRef} id="projetos">
      <div className="container-site py-24 md:py-32">

        {/* Label de secção */}
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-dim whitespace-nowrap">
            Projetos
          </p>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Lista de projectos */}
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="border-t border-border last:border-b"
            >
              {/* Linha clicável — abre/fecha accordion */}
              <button
                onClick={() => toggleProject(i)}
                className="w-full text-left group flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-16 py-10 md:py-12"
              >
                {/* Esquerda — número + nome + descrição + tags */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-label text-dim">
                    {project.number}
                  </span>
                  <h3 className="font-display font-bold text-text leading-[1.05] tracking-tight text-[clamp(2rem,4vw,3.5rem)] group-hover:text-accent transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="font-body font-light text-dim leading-[1.6] max-w-prose">
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

                {/* Direita — link externo + ícone toggle */}
                <div className="flex items-center gap-6 md:mt-[0.6rem] shrink-0">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-label text-dim hover:text-accent transition-colors duration-300 whitespace-nowrap flex items-center gap-1"
                  >
                    <span>{project.urlLabel}</span>
                    <span className="inline-block transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5">↗</span>
                  </a>
                  <span
                    ref={(el) => { iconRefs.current[i] = el; }}
                    className="font-mono text-[1.25rem] text-dim group-hover:text-accent transition-colors duration-300 leading-none select-none"
                    style={{ display: "inline-block" }}
                  >
                    +
                  </span>
                </div>
              </button>

              {/* Painel de detalhe — controlado por GSAP */}
              <div ref={(el) => { detailRefs.current[i] = el; }}>
                <div className="pb-12 flex flex-col gap-10">

                  {/* Screenshot placeholder */}
                  <div className="w-full aspect-video bg-surface border border-border rounded-sm flex items-center justify-center">
                    <span className="font-mono text-label text-dim">Screenshot em breve</span>
                  </div>

                  {/* 3 colunas de detalhe */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">
                        O que fiz
                      </h4>
                      <p className="font-body font-light text-text leading-[1.75]">
                        {project.detail.whatIDid}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">
                        Porque fiz
                      </h4>
                      <p className="font-body font-light text-text leading-[1.75]">
                        {project.detail.whyIDid}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="font-mono text-label uppercase tracking-[0.12em] text-dim">
                        Processo
                      </h4>
                      <p className="font-body font-light text-text leading-[1.75]">
                        {project.detail.process}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.detail.tools.map((tool) => (
                          <span
                            key={tool}
                            className="font-mono text-label text-dim border border-border px-2 py-1 rounded-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
