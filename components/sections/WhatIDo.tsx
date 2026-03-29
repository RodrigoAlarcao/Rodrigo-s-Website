"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    number: "01",
    title: "Penso",
    body: "Começo pelo problema, não pela solução. Antes de qualquer linha de código ou pixel no Figma, percebo o que está realmente em jogo.",
  },
  {
    number: "02",
    title: "Estruturo",
    body: "Transformo ideias cruas em produtos com forma. Tenho uma metodologia própria para isso — desenvolvida ao longo de dois anos com AI.",
  },
  {
    number: "03",
    title: "Construo",
    body: "Não fico pelo desenho. Lanço. Já o fiz sozinho. Em semana e meia.",
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

export default function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── Entrance ─────────────────────────────────────────────────────────────
      gsap.from(labelRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(itemsRef.current.filter(Boolean), {
        y: 80,
        opacity: 0,
        scale: 0.78,
        duration: 1.1,
        ease: "back.out(1.3)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
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
          transformOrigin: "left",
          opacity: 0,
          ease: "none",
        })
        .to(
          itemsRef.current.filter(Boolean),
          {
            y: -40,
            opacity: 0,
            scale: 0.78,
            stagger: { each: 0.08, from: "start" },
            ease: "none",
          },
          "<"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="o-que-faco">
      <div className="container-site py-24 md:py-32">

        {/* Label de secção — mono, inline com divider */}
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <p ref={labelRef} className="font-mono text-label uppercase tracking-[0.12em] text-dim whitespace-nowrap">
            O que faço
          </p>
          <div ref={dividerRef} className="flex-1 border-t border-border" />
        </div>

        {/* Três blocos — grid com separadores verticais */}
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
