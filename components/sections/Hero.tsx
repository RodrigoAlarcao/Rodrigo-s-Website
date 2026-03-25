"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  // Animações de entrada
  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([nameRef.current, dividerRef.current, taglineRef.current, ctaRef.current, imageWrapRef.current], {
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(nameRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.0,
        ease: "power3.inOut",
      })
        .from(imageWrapRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "power3.inOut",
        }, 0)
        .from(dividerRef.current, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.6,
          ease: "power2.inOut",
        }, "-=0.2")
        .from(taglineRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.3")
        .from(ctaRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax de rato na imagem
  useEffect(() => {
    const section = containerRef.current;
    const inner = imageInnerRef.current;
    if (!section || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(inner, {
        x: x * -18,
        y: y * -18,
        duration: 0.9,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col pt-32 md:pt-40 pb-16 md:pb-24 relative overflow-hidden"
    >
      {/* Imagem — direita, parallax com cursor — substituir div por <Image> quando tiveres a foto */}
      <div
        ref={imageWrapRef}
        className="hidden md:block absolute right-0 top-0 h-full w-[42%] overflow-hidden"
        style={{ clipPath: "inset(0 0 0% 0)" }}
      >
        <div ref={imageInnerRef} className="w-full h-full scale-110">
          <Image
            src="/images/rodrigo.jpg"
            alt="Rodrigo Alarcão"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      <div className="container-site w-full flex flex-col flex-1">

        {/* Nome — sempre duas linhas, oversized, editorial */}
        <h1
          ref={nameRef}
          className="font-display font-extrabold text-hero-name text-text leading-[0.92] tracking-tight md:max-w-[55%]"
        >
          Rodrigo
          <br />
          Alarcão
        </h1>

        {/* Separador em accent + rodapé do hero */}
        <div className="mt-auto">
          <div
            ref={dividerRef}
            className="w-full md:w-[55%] border-t border-accent mb-10 md:mb-14"
          />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16 md:max-w-[55%]">
            <div ref={taglineRef} className="flex flex-col gap-1">
              <p className="text-hero-tagline font-body font-light text-text leading-[1.4]">
                Projeto, estruturo e construo produtos digitais.
              </p>
              <p className="text-hero-tagline font-body font-light italic text-dim leading-[1.4]">
                De ideia ao MVP em semanas.
              </p>
            </div>

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
