"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    name: "ecoREPORT",
    description: "Ferramenta de relatórios de sustentabilidade para empresas — da recolha de dados ao relatório final, sem fricção.",
    tags: ["Product Design", "AI Engineering"],
    url: "https://ecoreport.pt",
    urlLabel: "ecoreport.pt",
  },
  {
    number: "02",
    name: "Palco Democrático",
    description: "Plataforma cívica que aproxima cidadãos da política local. Construída para tornar a participação democrática mais acessível.",
    tags: ["Product Design", "Vibe Coding"],
    url: "https://palcodemocratico.pt",
    urlLabel: "palcodemocratico.pt",
  },
  {
    number: "03",
    name: "LONA",
    description: "Arte que torna marcas inesquecíveis. Liga marcas a artistas para criar obras permanentes com impacto real.",
    tags: ["Product Design", "AI Engineering", "Vibe Coding"],
    url: "https://lona-kt9z38xp0-rodrigos-projects-578d09b9.vercel.app",
    urlLabel: "lona.vercel.app",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
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
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-16 py-10 md:py-12"
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

                {/* Direita — link */}
                <div className="flex items-center gap-2 md:mt-[0.6rem] shrink-0 font-mono text-label text-dim group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
                  <span>{project.urlLabel}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
