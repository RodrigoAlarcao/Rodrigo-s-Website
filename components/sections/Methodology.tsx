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
    title: "AI como alavanca",
    body: "Claude Code, Cursor, vibe coding. Não como atalho — como alavanca. A AI amplifica a intenção de design, não a substitui.",
  },
  {
    number: "03",
    title: "MVP em semanas",
    body: "Da ideia ao live em dias. Já o fiz três vezes. O ritmo não compromete a qualidade — obriga a focar no que é essencial.",
  },
];

function scrambleNumber(el: HTMLElement, final: string) {
  let frame = 0;
  const total = 14;
  const tick = () => {
    frame++;
    if (frame < total) {
      el.textContent = String(Math.floor(Math.random() * 99)).padStart(2, "0");
      setTimeout(tick, 35);
    } else {
      el.textContent = final;
    }
  };
  tick();
}

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── Entrance ─────────────────────────────────────────────────────────────
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

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

      // ── Number scramble on enter ──────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          itemsRef.current.filter(Boolean).forEach((item, i) => {
            const numEl = item?.querySelector("[data-number]") as HTMLElement | null;
            if (!numEl) return;
            const final = numEl.dataset.number ?? "";
            setTimeout(() => scrambleNumber(numEl, final), i * 150);
          });
        },
      });

      // ── Exit (scrub as section scrolls past viewport top) ────────────────────
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      exitTl
        .to(dividerRef.current, {
          scaleX: 0,
          transformOrigin: "right",
          opacity: 0,
          ease: "none",
        })
        .to(
          itemsRef.current.filter(Boolean),
          {
            y: -24,
            opacity: 0,
            scale: 0.95,
            stagger: { each: 0.06, from: "start" },
            ease: "none",
          },
          "<"
        );
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
          <div ref={dividerRef} className="flex-1 border-t border-border" />
        </div>

        {/* Três blocos — mesma grid do WhatIDo */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {items.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="group py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 flex flex-col gap-6"
            >
              <span
                data-number={item.number}
                className="font-mono text-label text-dim"
              >
                {item.number}
              </span>
              {/* Title with expanding underline */}
              <h3 className="font-display font-bold text-text text-[2rem] leading-[1.1] tracking-tight transition-colors duration-300 group-hover:text-accent">
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                  {item.title}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
                </span>
              </h3>
              <p className="font-body font-light text-dim leading-[1.75] transition-colors duration-500 group-hover:text-text">
                {item.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
