"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Estado final imediato — sem animação
        gsap.set([nameRef.current, dividerRef.current, taglineRef.current, ctaRef.current], {
          clearProps: "all",
        });
        return;
      }

      // Timeline de entrada — PRD secção 5.1
      const tl = gsap.timeline({ delay: 0.2 });

      // Nome: clipPath reveal da esquerda para a direita
      tl.from(nameRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.0,
        ease: "power3.inOut",
      })
        // Separador: scale da esquerda
        .from(
          dividerRef.current,
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        // Tagline: sobe com fade
        .from(
          taglineRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // CTA: sobe suavemente
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col pt-32 md:pt-40 pb-16 md:pb-24"
    >
      <div className="container-site w-full flex flex-col flex-1">

        {/* Nome — sempre duas linhas, oversized, editorial */}
        <h1
          ref={nameRef}
          className="font-display font-extrabold text-hero-name text-text leading-[0.92] tracking-tight"
        >
          Rodrigo
          <br />
          Alarcão
        </h1>

        {/* Separador em accent + rodapé do hero */}
        <div className="mt-auto">
          {/* 1px accent divider — PRD secção 2.4 */}
          <div
            ref={dividerRef}
            className="w-full border-t border-accent mb-10 md:mb-14"
          />

          {/* Tagline + CTA — editorial: texto à esquerda, CTA à direita */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
            <p
              ref={taglineRef}
              className="text-hero-tagline font-body font-light text-text max-w-[560px] leading-[1.4]"
            >
              Projeto, estruturo e construo produtos digitais —
              <br className="hidden sm:block" />
              da ideia ao MVP, em semanas.
            </p>

            {/* CTA — confiante, sem implorar atenção */}
            <a
              ref={ctaRef}
              href="#contacto"
              className="font-display font-medium text-[1.125rem] text-text hover:text-accent transition-colors duration-300 whitespace-nowrap group flex items-center gap-2"
            >
              Fala comigo
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
