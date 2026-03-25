"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    number: "01",
    title: "Product Design first",
    body: "Começo pelo utilizador, não pela tecnologia. Antes de escrever uma linha de código, percebo o problema, os fluxos e o que realmente precisa de existir.",
  },
  {
    number: "02",
    title: "AI como multiplicador",
    body: "Claude Code, Cursor, vibe coding. Não como atalho — como alavanca. A AI amplifica a intenção de design, não a substitui.",
  },
  {
    number: "03",
    title: "MVP em semanas",
    body: "Da ideia ao live em dias. Já o fiz três vezes. O ritmo não compromete a qualidade — obriga a focar no que é essencial.",
  },
];

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current.filter(Boolean), {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="metodologia">
      <div className="container-site py-24 md:py-32">

        {/* Label de secção */}
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-dim whitespace-nowrap">
            Como trabalho
          </p>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Três blocos — mesma grid do WhatIDo */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {items.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 flex flex-col gap-6"
            >
              <span className="font-mono text-label text-dim">
                {item.number}
              </span>
              <h3 className="font-display font-bold text-text text-[2rem] leading-[1.1] tracking-tight">
                {item.title}
              </h3>
              <p className="font-body font-light text-dim leading-[1.75]">
                {item.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
