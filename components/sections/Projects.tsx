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
    description: "Plataforma de inteligência ambiental. Transforma reports de cidadãos em dados acionáveis para municípios — hotspots, padrões, relatórios mensais. Primeiro projecto de vibe coding, 2 anos de iteração.",
    tags: ["Product Design", "Cursor AI", "Dados Cívicos"],
    url: "https://ecoreport.pt",
    urlLabel: "ecoreport.pt",
    detail: {
      whatIDid: "Plataforma que acumula observações de cidadãos, identifica hotspots de poluição e gera relatórios mensais com recomendações para municípios. Uma queixa é ruído — cem reports do mesmo local ao longo de três meses são evidência impossível de ignorar.",
      whyIDid: "Os sistemas de queixas existentes transformam cidadãos em reclamadores perpétuos sem impacto real. A oportunidade era transformar indignação individual em inteligência colectiva — dados que municípios não têm capacidade de produzir sozinhos.",
      process: "Primeiro projecto de vibe coding — 2 anos antes do Claude Code existir. UX explorado no Figma. Desenvolvimento com Cursor AI. Backend por um developer externo. Aprendi o que são alucinações de AI, como as mitigar, e a importância crítica de documentar e planear antes de desenvolver com AI.",
      tools: ["Cursor AI", "Figma", "Supabase"],
    },
  },
  {
    number: "02",
    name: "Palco Democrático",
    description: "Plataforma de sondagem democrática em tempo real. Anonimato por encriptação, integridade por AI anti-bots. 100% a solo em 10 dias com Claude Code.",
    tags: ["Product Design", "Claude Code", "Democracia Digital"],
    url: "https://palcodemocratico.pt",
    urlLabel: "palcodemocratico.pt",
    detail: {
      whatIDid: "Plataforma onde cidadãos votam em questões políticas de forma anónima — privacidade garantida por encriptação end-to-end, integridade por AI de detecção de bots. Alternativa ao modelo de sondagens telefónicas do século XX.",
      whyIDid: "Em 2026, medir a vontade de um país com 300 chamadas telefónicas não é apenas ineficiente — é antidemocrático. Temos a tecnologia para capturar opinião real em tempo real. A maioria nunca foi ouvida. O silêncio foi assumido como indiferença.",
      process: "100% a solo em 10 dias com Claude Code. Product design primeiro — 5 pilares definidos antes de escrever uma linha de código. Supabase para backend, Cloudflare para infraestrutura.",
      tools: ["Claude Code", "Supabase", "Cloudflare", "Vercel"],
    },
  },
  {
    number: "03",
    name: "LONA",
    description: "Liga marcas a artistas para criar obras permanentes com impacto real. Animações avançadas GSAP + Framer Motion. Metodologia pessoal com documentos estruturados. 1 semana.",
    tags: ["Product Design", "Claude Code", "GSAP · Framer Motion"],
    url: "https://lona-kt9z38xp0-rodrigos-projects-578d09b9.vercel.app",
    urlLabel: "lona.vercel.app",
    detail: {
      whatIDid: "Marketplace que liga marcas a artistas para criar obras permanentes em espaços físicos. Dois produtos: LONA Street (arte urbana) e LONA Install (instalações interiores). Roster de artistas, processo de matching marca-artista, gestão de projecto.",
      whyIDid: "O marketing tradicional não deixa marca. Uma campanha digital dura dias — uma obra de arte permanente dura décadas. Arte e marketing não são opostos. São aliados naturais que nunca ninguém teve coragem de unir a sério.",
      process: "O projecto tecnicamente mais ambicioso. Animações avançadas com GSAP e Framer Motion. Construído com Claude Code usando uma metodologia pessoal baseada em documentos estruturados — o que permite escalar e iterar rapidamente sem perder coerência. De conceito a produto live em 1 semana.",
      tools: ["Claude Code", "GSAP", "Framer Motion", "Vercel"],
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
